package utils

import (
	"fmt"

	"github.com/slack-go/slack"
)

var Client *slack.Client

func InitClient(token, appToken string) {
	Client = slack.New(token, slack.OptionDebug(true), slack.OptionAppLevelToken(appToken))
}

func SendMsgAsBot(channelToken, msg, tstamp string) (timestamp string) {
	var ts string
	var perr error
	if tstamp != "" {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionAttachments(slack.Attachment{
				Pretext: msg,
			}),
			slack.MsgOptionTS(tstamp),
		)
	} else {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionAttachments(slack.Attachment{
				Pretext: msg,
			}),
		)
	}
	if perr != nil {
		fmt.Println("Exception while posting message to slack as bot: ", perr)
		panic(perr)
	}
	return ts
}

func SendMsg(channelToken, msg, userName, tstamp string) (timestamp string) {
	var ts string
	var perr error
	if tstamp != "" {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionAttachments(slack.Attachment{
				Pretext: msg,
			}),
			slack.MsgOptionUsername(userName),
			slack.MsgOptionTS(tstamp),
		)
	} else {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionAttachments(slack.Attachment{
				Pretext: msg,
			}),
			slack.MsgOptionUsername(userName),
		)
	}
	if perr != nil {
		fmt.Println("Exception while posting message to slack as a user: ", perr)
		panic(perr)
	}
	return ts
}

func GetSlackUserInfo(userID string) *slack.User {
	user, err := Client.GetUserInfo(userID)
	if err != nil {
		fmt.Println("Error while fetching user info: ", err)
		panic(err)
	}
	return user
}

// func incomingMsgBroadcaster(ctx context.Context, client *slack.Client, socketClient *socketmode.Client, channelTokens map[string]string, channelNames map[string]string) {
// 	for {
// 		select {
// 		case <-ctx.Done():
// 			fmt.Println("Stopping the socketmode client")
// 			return
// 		case event := <-socketClient.Events:
// 			switch event.Type {
// 			case socketmode.EventTypeEventsAPI:
// 				eventsAPIEvent, ok := event.Data.(slackevents.EventsAPIEvent)
// 				if !ok {
// 					// fmt.Printf("Ignored %+v\n", event)
// 					continue
// 				}
// 				socketClient.Ack(*event.Request)
// 				s, isMessage := eventsAPIEvent.InnerEvent.Data.(*slackevents.MessageEvent)
// 				if isMessage && s.BotID == "" { //checking if msg was not sent by a bot
// 					user, err := Client.GetUserInfo(s.User)
// 					if err != nil {
// 						fmt.Println("Error while fetching user info: ", err)
// 						SendMsgAsBot(s.Channel, "There was some issue fetching the user who sent this message, pls try resending the message", s.ThreadTimeStamp)
// 					}
// 					newMsg := models.Message{
// 						Text:      string(s.Text),
// 						Sender:    user.Profile.DisplayName,
// 						ImageUrl:  user.Profile.ImageOriginal,
// 						Timestamp: string(s.TimeStamp),
// 					}
// 					if s.Channel != channelTokens["private"] {
// 						var closedWSIndex []int
// 						var aliveConns []*websocket.Conn
// 						fmt.Println("Received message on public channel")
// 						for index, value := range webSockets[channelNames[s.Channel]] {
// 							err := value.WriteJSON(newMsg)
// 							if err != nil {
// 								if err == websocket.ErrCloseSent {
// 									closedWSIndex = append(closedWSIndex, index)
// 								}
// 							}
// 							aliveConns = append(aliveConns, value)
// 						}
// 						if len(closedWSIndex) != 0 {
// 							webSockets[channelNames[s.Channel]] = aliveConns //cleaning up closed connections
// 						}
// 					} else {
// 						// fmt.Println("Received message on private channel")
// 						// find the websocket using mapping and send message to that websocket
// 						err := privateChatWS[s.ThreadTimeStamp].WriteJSON(newMsg)
// 						if err != nil {
// 							if err == websocket.ErrCloseSent {
// 								delete(privateChatWS, s.ThreadTimeStamp)
// 								SendMsgAsBot(channelTokens["private"], "This user has left the chat", s.ThreadTimeStamp)
// 							} else {
// 								// fmt.Println("Error while sending message received on slack to a private chat user: ", err)
// 								panic(err)
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// }
