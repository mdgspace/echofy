package utils

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"bot/db"
	"bot/models"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

var webSockets = make(map[string]([]*websocket.Conn))
var privateChatWS = make(map[string]*websocket.Conn) //key - thread time stamp, value - websocket of that user
var channelTokens = make(map[string]string)
var channelNames = make(map[string]string)
var userIDWebSockets = make(map[string]*websocket.Conn)
var blacklistedIP = make(map[string]time.Time)
var upgrader websocket.Upgrader

func InitChannelTokens() {
	godotenv.Load("../../.env")
	channelTokens["public"] = os.Getenv("SLACK_PUBLIC_CHANNEL_ID")
	channelTokens["private"] = os.Getenv("SLACK_PRIVATE_CHANNEL_ID")
	channelNames[os.Getenv("SLACK_PUBLIC_CHANNEL_ID")] = "public"
	channelNames[os.Getenv("SLACK_PRIVATE_CHANNEL_ID")] = "private"
}

// handler for private chats
func PrivateChatsHandler(c echo.Context, name, id string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), c.Response().Header()) //Yet to be tested
	if err != nil {
		panic(err)
	}
	defer ws.Close()
	// send a hello message in the channel and create a new thread corresponding to the user
	var ts string
	ws.WriteMessage(websocket.TextMessage, []byte("Welcome to MDG Chat!"))
	history := db.RetrieveAllMessagesPrivateUser(id)
	if (len(history) == 0){
		ts = SendMsg(channelTokens["private"], string(fmt.Sprintf("%v has entered the private chat", name)), name, "")
	} else {
		SendMsg(channelTokens["private"], "User has re-entered the private chat", name, id)
		ts = id
	}
	privateChatWS[ts] = ws
	entryInfo, err := json.Marshal(map[string]interface{}{"history":history, "id":ts})
	if (err != nil){
		panic(err)
	}
	ws.WriteMessage(websocket.TextMessage, entryInfo)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("error: ", err)
			if (err == &websocket.CloseError{}) {
				return nil
			}
			ws.Close()
			break
		}
		fmt.Println("Received msg: ", string(msg))
		SendMsg(channelTokens["private"], string(msg), name, ts)
		newMsg := models.Message{
			Text:      string(msg),
			Sender:    name,
			Timestamp: ts,
		}
		db.AddMsgToDB(newMsg, channelTokens["private"], ts)
		err = ws.WriteMessage(websocket.TextMessage, []byte("Message send success")) //This is just so that we can check at frontend regularly that connection is alive
		if err != nil {
			if err == websocket.ErrCloseSent {
				SendMsgAsBot(channelTokens["private"], "This user has left the chat", ts)
				delete(privateChatWS, ts)
			}
			fmt.Println("error: ", err)
			ws.Close()
			break
		}
	}
	return nil
}

// handler for public chats
func PublicChatsHandler(c echo.Context, name string, channel string, userID string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), c.Response().Header()) //Yet to be tested
	if err != nil {
		panic(err)
	}
	defer ws.Close()
	webSockets[channel] = append(webSockets[channel], ws)
	ws.WriteMessage(websocket.TextMessage, []byte("Welcome to MDG Chat!"))
	if (!db.CheckValidUserID(userID)){
		userID = name + channel + strconv.Itoa(int(time.Now().Unix()))
		ws.WriteJSON(map[string]string{"userID":userID})
		db.AddPublicUser(name, userID)
	}
	userIDWebSockets[userID] = ws;
	prevMsgs, err := json.Marshal(db.RetrieveAllMessagesPublicChannels("public"))
	if (err != nil){
		panic(err)
	}
	ws.WriteMessage(websocket.TextMessage, prevMsgs)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("error: ", err)
			if (err == &websocket.CloseError{}) {
				db.RemovePublicUser(userID)
				return nil
			}
			ws.Close()
			break
		}
		fmt.Println("Received msg: ", string(msg))
		ts := SendMsg(channelTokens["public"], string(msg), name, "")
		newMsg := models.Message{
			Text:      string(msg),
			Sender:    name,
			Timestamp: ts,
			OutsiderUserID: userID,
		}
		sendMsgToPublicUsers(newMsg, "public")
		db.AddMsgToDB(newMsg, channelTokens["public"], ts)
		err = ws.WriteMessage(websocket.TextMessage, []byte("Messsage send successful")) //This is just so that we can check at frontend regularly that connection is alive
		if err != nil {
			fmt.Println("error: ", err)
			ws.Close()
			break
		}
	}
	return nil
}

// function to send msg from slack to corresponding frontend client
func sendSlackToPrivateUser(msgObj models.Message, threadTS string) {
	err := privateChatWS[threadTS].WriteJSON(msgObj)
	if err != nil {
		if err == websocket.ErrCloseSent {
			delete(privateChatWS, threadTS)
			SendMsgAsBot(channelTokens["private"], "This user has left the chat", threadTS)
		} else {
			fmt.Println("Error while sending message received on slack to a private chat user: ", err)
			panic(err)
		}
	}
}

// function to broadcast msg from slack to all corresponding frontend clients
func sendMsgToPublicUsers(msgObj models.Message, channelName string) {
	var closedWSIndex []int
	var aliveConns []*websocket.Conn
	fmt.Println("Received message on public channel")
	for index, value := range webSockets[channelName] {
		err := value.WriteJSON(msgObj)
		if err != nil {
			if err == websocket.ErrCloseSent {
				db.RemovePublicUser(msgObj.OutsiderUserID)
				closedWSIndex = append(closedWSIndex, index)
			} else {
				fmt.Println("Unhandled exception while sending message to public chat users")
				panic(err)
			}
		}
		aliveConns = append(aliveConns, value)
	}
	if len(closedWSIndex) != 0 {
		webSockets[channelName] = aliveConns //cleaning up closed connections
	}
}

// to send messages to frontend clients
func SendMsgToFrontend(msgObj models.Message, channelID string, threadTS string) {
	if channelNames[channelID] == "private" {
		sendSlackToPrivateUser(msgObj, threadTS)
	} else {
		sendMsgToPublicUsers(msgObj, channelNames[channelID])
	}
}

func BanUser(username string) {
	userID := db.GetUserID(username)
	ws := userIDWebSockets[userID]
	ip := strings.Split(ws.RemoteAddr().String(), ":")[0]
	blacklistedIP[ip] = time.Now().AddDate(0, 0, 7)
	ws.WriteJSON(map[string]string{"Message":"You are banned now"})
	SendMsgAsBot(channelTokens["public"], "User with id " + userID + " is banned successfully", "")
	ws.Close()
	db.RemovePublicUser(userID)
}

func IsUserBanned(ip string) bool {
	for blackIP, banTime := range(blacklistedIP){
		if (blackIP == ip){
			if (banTime.After(time.Now())){
				return true
			} else {
				delete(blacklistedIP, ip)
				return false
			}
		}
	}
	return false
}