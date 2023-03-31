package main

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"os"

	"github.com/joho/godotenv"
	"github.com/slack-go/slack"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/slack-go/slack/slackevents"
	"github.com/slack-go/slack/socketmode"
)

// Custom struct of message object which is broadcasted to frontend clients
type messageData struct {
    Text string `json:"text"`
	Sender string `json:"sender"`
	ImageUrl string `json:"url"`
	Timestamp string `json:"timestamp"`
}

//making global variable because API handlers need to access it
var webSockets = make(map[string]([]*websocket.Conn))
var channelTokens = make(map[string]string)
var channelNames = make(map[string]string)
var client *slack.Client
var socketClient *socketmode.Client
var channels = []string{"public", "private"}
var privateChatWS = make(map[string]*websocket.Conn) //key - thread time stamp, value - websocket of that user

func main() {
	//token handling
	godotenv.Load(".env")
	token := os.Getenv("SLACK_AUTH_TOKEN")
	channelTokens["public"] = os.Getenv("SLACK_PUBLIC_CHANNEL_ID")
	channelTokens["private"] = os.Getenv("SLACK_PRIVATE_CHANNEL_ID")
	channelNames[os.Getenv("SLACK_PUBLIC_CHANNEL_ID")] = "public"
	channelNames[os.Getenv("SLACK_PRIVATE_CHANNEL_ID")] = "private"
	appToken := os.Getenv("SLACK_APP_TOKEN")

	// starting echo server
	e := echo.New()
	e.GET("/wsnew", joinChat)
	// client to make Slack API requests
	client = slack.New(token, slack.OptionDebug(true), slack.OptionAppLevelToken(appToken))
	// socket to continuously listen to incoming messages from slack
	socketClient = socketmode.New(
		client,
		socketmode.OptionDebug(true),

	)

	// context used for the goroutine that listens to events on Slack and broadcasts to frontend clients
	ctx, cancel := context.WithCancel(context.Background())
    defer cancel()
	go incomingMsgBroadcaster(ctx, client, socketClient)
	
	go socketClient.Run()
	e.Start(":1323")
}

func incomingMsgBroadcaster(ctx context.Context, client *slack.Client, socketClient *socketmode.Client){
	for {
		select {
		case <-ctx.Done():
			fmt.Println("Stopping the socketmode client")
			return
		case event := <-socketClient.Events:
			switch event.Type {
			case socketmode.EventTypeEventsAPI:
				eventsAPIEvent, ok := event.Data.(slackevents.EventsAPIEvent)
				if !ok {
					fmt.Printf("Ignored %+v\n", event)
					continue
				}
				socketClient.Ack(*event.Request)
				s, isMessage := eventsAPIEvent.InnerEvent.Data.(*slackevents.MessageEvent)
				if isMessage == true && s.BotID == "" { //checking if msg was not sent by a bot
					user, err := client.GetUserInfo(s.User)
					imgUrl := user.Profile.ImageOriginal
					if (err != nil){
						fmt.Println("Error while fetching user info: ", err)
						_, _, err = client.PostMessage(
							s.Channel,
							slack.MsgOptionAttachments(slack.Attachment{
								Pretext: string(fmt.Sprintf("There was some issue fetching the user who sent this message, pls try resending the message")),
							}),
							slack.MsgOptionTS(s.ThreadTimeStamp),
						)
						if (err != nil){
							fmt.Println("Error while sending failure message to channel: ", err)
						}
					}
					newMsg := messageData{
						Text: string(s.Text),
						Sender: user.Profile.DisplayName,
						ImageUrl: imgUrl,
						Timestamp: string(s.TimeStamp),
					}
					if s.Channel != channelTokens["private"]{
						var closedWSIndex []int
						var aliveConns[] *websocket.Conn
						fmt.Println("Received message on public channel")
						for index, value := range webSockets[channelNames[s.Channel]] {
							err := value.WriteJSON(newMsg)
							if (err != nil){
								if (err == websocket.ErrCloseSent){
									closedWSIndex = append(closedWSIndex, index)
								}
							}
							aliveConns = append(aliveConns, value)
						}
						if (len(closedWSIndex) != 0){
							webSockets[channelNames[s.Channel]] = aliveConns //cleaning up closed connections
						}
					} else {
						fmt.Println("Received message on private channel")
						// route to private channel
						// find the websocket using mapping and send message to that websocket
						err := privateChatWS[s.ThreadTimeStamp].WriteJSON(newMsg)
						if (err != nil){
							if (err == websocket.ErrCloseSent){
								delete(privateChatWS, s.ThreadTimeStamp)
								_, _, err = client.PostMessage(
									channelTokens["private"],
									slack.MsgOptionAttachments(slack.Attachment{
										Pretext: string(fmt.Sprintf("This user has left the chat")),
									}),
									slack.MsgOptionTS(s.ThreadTimeStamp),
								)
							} else {
								fmt.Println("Error while sending message received on slack to a private chat user: ", err)
								panic(err)
							}
						}
					}
				}
			}
		}
		
	}
}

// handler for http request to join chat
func joinChat(c echo.Context) error {
	// get user name from form values
	name := c.FormValue("name")
	channel := c.FormValue("channel")
	var validChannel bool = false
	for _, ch := range channels {
		print(ch)
		if (channel == ch){
			validChannel = true
			break
		}
	}
	if (name == "" || validChannel == false) {
		return c.String(http.StatusBadRequest, "Name and/or channel missing")
	}
	if (channel != "private"){
		go publicChatsHandler(c, c.FormValue("name"), channel) //this is done like this because there will be many public chat rooms in future
	}
	if (channel == "private"){
		go privateChatsHandler(c, c.FormValue("name"))
	}
	time.Sleep(time.Second)
	return nil
}

var (
	upgrader = websocket.Upgrader{}
)

func privateChatsHandler(c echo.Context, name string) error {
	ws, err := websocket.Upgrade(c.Response(), c.Request(), nil, 0, 0)
	if err != nil {
		panic(err)
	}
	defer ws.Close()
	// send a hello message in the channel and create a new thread corresponding to the user
	_, ts, err := client.PostMessage(
		channelTokens["private"],
		slack.MsgOptionAttachments(slack.Attachment{
			Pretext: string(fmt.Sprintf("%v has entered the private chat", name)),
		}),
		slack.MsgOptionUsername(name),
	)
	if (err != nil){
		fmt.Println("Error while sending msg for new private chat user: ", err)
		panic(err)
	}
	privateChatWS[ts] = ws
	for {
		err1 := ws.WriteMessage(websocket.TextMessage, []byte("Alive!")) //This is just so that we can check at frontend regularly that connection is alive
		if err1 != nil {
			if (err1 == websocket.ErrCloseSent){
				_, _, err = client.PostMessage(
					channelTokens["private"],
					slack.MsgOptionAttachments(slack.Attachment{
						Pretext: string(fmt.Sprintf("This user has left the chat")),
					}),
					slack.MsgOptionTS(ts),
				)
				delete(privateChatWS, ts)
			}
			fmt.Println("error: ", err1.Error())
			ws.Close()
			break
		}
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("error: ", err)
			if (err == &websocket.CloseError{}){
				return nil
			}
			ws.Close()
			break
		}
		fmt.Println("Received msg: ", string(msg))
		_, _, err = client.PostMessage(
			channelTokens["private"],
			slack.MsgOptionTS(ts),
			slack.MsgOptionAttachments(slack.Attachment{
				Pretext: string(msg),
			}),
			slack.MsgOptionUsername(name),
		)
		if (err != nil){
			fmt.Println("Error while sending message of a private user to slack: ", err)
			panic(err)
		}
	}
	return nil
}

func publicChatsHandler(c echo.Context, name string, channel string) error {
	ws, err := websocket.Upgrade(c.Response(), c.Request(), nil, 0, 0)
	if err != nil {
		panic(err)
	}
	defer ws.Close()
	webSockets[channel] = append(webSockets[channel], ws)
	print(len(webSockets))
	for {
		err1 := ws.WriteMessage(websocket.TextMessage, []byte("Alive!")) //This is just so that we can check at frontend regularly that connection is alive
		if err1 != nil {
			fmt.Println("error: ", err1.Error())
			ws.Close()
			break
			// panic(err1)
		}
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("error: ", err)
			if (err == &websocket.CloseError{}){
				return nil
			}
			ws.Close()
			break
		}
		fmt.Println("Received msg: ", string(msg))
		_, ts, err := client.PostMessage(
			channelTokens[channel],
			slack.MsgOptionAttachments(slack.Attachment{
				Pretext: string(msg),
			}),
			slack.MsgOptionUsername(name),
		)
		if (err != nil){
			fmt.Println("error encountered: ", err)
			panic(err)
		}
		fmt.Println("msg sent at ", ts)
		newMsg := messageData{
			Text: string(msg),
			Sender: name,
			Timestamp: ts,
		}
		for _, publicUserSocket := range webSockets[channel]{
			if (publicUserSocket != ws){
				err1 := publicUserSocket.WriteJSON(newMsg)
				if (err1 != nil){
					fmt.Println("Error in broadcasting msg: ", err1)
					panic(err1)
				}
			}
		}
		fmt.Println("Successfully broadcasted msg")
	}
	return nil
}