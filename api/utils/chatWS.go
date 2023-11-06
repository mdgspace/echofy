package utils

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"

	"bot/db"
	"bot/globals"
	"bot/models"
	profanityutils "bot/profanity_utils"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"

	"net/http"
)

var bannedUserIps = make(map[string]string) // userid to ip
var webSockets = make(map[string]([]*websocket.Conn))
var privateChatWS = make(map[string]*websocket.Conn) //key - thread time stamp, value - websocket of that user
var userIDWebSockets = make(map[string]*websocket.Conn)
var webSocketsUserID = make(map[*websocket.Conn]string)
var blacklistedIP = make(map[string]time.Time)
var upgrader =  websocket.Upgrader{ CheckOrigin: func(r* http.Request) bool { return true }, }
var webSocketMapsMutex sync.Mutex
var wg sync.WaitGroup

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
	if len(history) == 0 {
		ts = SendMsg(globals.GetChannelID("private"), string(fmt.Sprintf("%v has entered the private chat", name)), name, "")
		db.AddUserEntry(name, ts)
	} else {
		SendMsg(globals.GetChannelID("private"), "User has re-entered the private chat", name, id)
		ts = id
	}
	addUserAndWebsocketToLocalData(ws, ts, "private")
	entryInfo, err := json.Marshal(map[string]interface{}{"history": history, "id": ts})
	if err != nil {
		panic(err)
	}
	ws.WriteMessage(websocket.TextMessage, entryInfo)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			CloseWebsocketAndClean(ws, "private", ts)
			panic(err)
		}
		if profanityutils.IsMsgProfane(string(msg)) {
			handleProfaneUser(ws, name, string(msg), ts, "private")
		}
		SendMsg(globals.GetChannelID("private"), string(msg), name, ts)
		newMsg := models.Message{
			Text:      string(msg),
			Sender:    name,
			Timestamp: ts,
		}
		db.AddMsgToDB(newMsg, globals.GetChannelID("private"), ts, ts)
		err = ws.WriteMessage(websocket.TextMessage, []byte("Message send success")) //This is just so that we can check at frontend regularly that connection is alive
		if err != nil {
			if err == websocket.ErrCloseSent {
				SendMsgAsBot(globals.GetChannelID("private"), "This user has left the chat", ts)
			} else {
				SendMsgAsBot(globals.GetChannelID("private"), "There was some error in the websocket corresponding to the user and hence it has been closed", ts)
			}
			CloseWebsocketAndClean(ws, "private", ts)
			panic(err)
		}
	}
}

// handler for public chats
func PublicChatsHandler(c echo.Context, name string, channel string, userID string) error {
	// check if the websocket userIDWebSockets[id] is already present in the map and open
	// if yes, then close the previous websocket and remove it from the map
	if userIDWebSockets[userID] != nil {
		err := userIDWebSockets[userID].WriteMessage(websocket.TextMessage, []byte("ping"))
		if err == websocket.ErrCloseSent { // if the websocket is already closed
			CloseWebsocketAndClean(userIDWebSockets[userID], "public", userID)
		} else if err != nil { // if there is some other error
			fmt.Println("Error while pinging the websocket: ", err)
			return c.String(500, "Internal Server Error, please contact the administrator")
		} else {
			return c.String(409, "Username already taken")
		}
	}
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), c.Response().Header()) //Yet to be tested
	if err != nil {
		panic(err)
	}
	defer ws.Close()
	ws.WriteMessage(websocket.TextMessage, []byte("Welcome to MDG Chat!"))
	if !db.CheckValidUserID(userID) {
		userID = channel + name + strconv.Itoa(int(time.Now().Unix()))
		ws.WriteJSON(map[string]string{"userID": userID})
		db.AddUserEntry(name, userID)
	}
	addUserAndWebsocketToLocalData(ws, userID, channel)
	prevMsgs := getMarshalledSegregatedMsgHistoryPublicUser(userID, channel)
	ws.WriteMessage(websocket.TextMessage, prevMsgs)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			CloseWebsocketAndClean(ws, channel, userID)
			return nil
			// panic(err)
		}
		ts := SendMsg(globals.GetChannelID(channel), string(msg), name, "")
		fmt.Println("msg: ", string(msg), "is profane :", profanityutils.IsMsgProfane(string(msg)))
		if profanityutils.IsMsgProfane(string(msg)) {
			handleProfaneUser(ws, name, string(msg), ts, "public")
			return nil
		}
		newMsg := models.Message{
			Text:      string(msg),
			Sender:    name,
			Timestamp: ts,
		}
		sendMsgToPublicUsers(newMsg, channel)
		db.AddMsgToDB(newMsg, globals.GetChannelID(channel), ts, userID)
		err = ws.WriteMessage(websocket.TextMessage, []byte("Messsage send successful")) //This is just so that we can check at frontend regularly that connection is alive
		if err != nil {
			CloseWebsocketAndClean(ws, channel, userID)
			panic(err)
		}
	}
}

// close websocket and remove it from wherever it is stored (golang slices)
func CloseWebsocketAndClean(ws *websocket.Conn, channelName, userID string) {
	wg.Wait()
	wg.Add(1)
	webSocketMapsMutex.Lock()
	defer webSocketMapsMutex.Unlock()
	delete(userIDWebSockets, userID)
	delete(webSocketsUserID, ws)
	if channelName != "private" {
		var aliveConns []*websocket.Conn
		for _, value := range webSockets[channelName] {
			if value != ws {
				aliveConns = append(aliveConns, value)
			}
		}
		webSockets[channelName] = aliveConns
	} else {
		delete(privateChatWS, userID)
	}
	wg.Done()
	db.ChangeActiveUserToInactive(userID)
}

func addUserAndWebsocketToLocalData(ws *websocket.Conn, userID, channelName string) {
	wg.Wait()
	wg.Add(1)
	webSocketMapsMutex.Lock()
	if channelName == "private" {
		privateChatWS[userID] = ws
	} else {
		webSockets[channelName] = append(webSockets[channelName], ws)
	}
	userIDWebSockets[userID] = ws
	webSocketsUserID[ws] = userID
	webSocketMapsMutex.Unlock()
	wg.Done()
}

func CloseWebsocketAndCleanByUserID(userID string) bool {
	wg.Wait()
	wg.Add(1)
	webSocketMapsMutex.Lock()
	ws := userIDWebSockets[userID]
	for channelName, wsArr := range webSockets {
		for _, val := range wsArr {
			if val == ws {
				go CloseWebsocketAndClean(ws, channelName, userID)
				webSocketMapsMutex.Unlock()
				wg.Done()
				return true
			}
		}
	}
	webSocketMapsMutex.Unlock()
	wg.Done()
	return false
}

// function to send msg from slack to corresponding frontend client
func sendSlackToPrivateUser(msgObj models.Message, threadTS string) {
	err := privateChatWS[threadTS].WriteJSON(msgObj)
	if err != nil {
		if err == websocket.ErrCloseSent {
			go CloseWebsocketAndClean(privateChatWS[threadTS], "private", threadTS)
			SendMsgAsBot(globals.GetChannelID("private"), "This user has left the chat", threadTS)
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
	for index, value := range webSockets[channelName] {
		err := value.WriteJSON(msgObj)
		if err != nil {
			if err == websocket.ErrCloseSent {
				go CloseWebsocketAndClean(value, channelName, webSocketsUserID[value])
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

// to send signal to frontend to delete a message
func SendMsgDeleteSignal(channelID, msgTS string) {
	channelName := globals.FindChannelNameIfValidToken(channelID)
	var closedWSIndex []int
	var aliveConns []*websocket.Conn
	for index, value := range webSockets[channelName] {
		err := value.WriteJSON(map[string]string{"Delete": msgTS})
		if err != nil {
			if err == websocket.ErrCloseSent {
				go CloseWebsocketAndClean(value, channelName, webSocketsUserID[value])
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
	if globals.FindChannelNameIfValidToken(channelID) == "private" {
		sendSlackToPrivateUser(msgObj, threadTS)
	} else {
		sendMsgToPublicUsers(msgObj, globals.FindChannelNameIfValidToken(channelID))
	}
}

func BanUser(username, channelToken string) {
	userID := db.GetUserID(username)
	if userID == "" {
		SendMsgAsBot(channelToken, "User with username: "+username+" does not exist", "")
		return
	}
	ws := userIDWebSockets[userID]
	ip := strings.Split(ws.RemoteAddr().String(), ":")[0]
	bannedUserIps[userID] = ip
	blacklistedIP[ip] = time.Now().AddDate(0, 0, 7)
	ws.WriteJSON(map[string]string{"Message": "You are banned now"})
	SendMsgAsBot(channelToken, "User with id "+userID+" is banned successfully", "")
	ws.Close()
	db.BanUserInDB(username)
}

func UnbanUser(username, channelToken string) {
	userID := db.GetBannedUserId(username) // TODO: this gives empty string kyoki user is banned now
	print("")
	ip := bannedUserIps[userID]
	delete(blacklistedIP, ip)
	SendMsgAsBot(channelToken, "User with id "+userID+" is un-banned successfully", "")
	db.UnbanUserInDB(username)
}

func IsUserBanned(ip string) bool {
	for blackIP, banTime := range blacklistedIP {
		if blackIP == ip {
			if banTime.After(time.Now()) {
				return true
			} else {
				delete(blacklistedIP, ip)
				return false
			}
		}
	}
	return false
}

func RequestUserInfo(username string) map[string]string {
	userID := db.GetUserID(username)
	if userID == "" {
		return map[string]string{"Status": "Fail", "Error": "No user exists with given name"}
	} else {
		ws := userIDWebSockets[userID]
		ws.WriteJSON(map[string]string{"Message": "Send user info"})
		return map[string]string{"Status": "Request Sent"}
	}
}

func getMarshalledSegregatedMsgHistoryPublicUser(userID, channelName string) []byte {
	currUserSentMsg, otherUserSentMsg := db.RetrieveAllMessagesPublicChannels(channelName, userID)
	allPrevMsgs := make(map[string]map[string]string)
	allPrevMsgs["Sent by you"] = currUserSentMsg
	allPrevMsgs["Sent by others"] = otherUserSentMsg
	chatHistory, err := json.Marshal(allPrevMsgs)
	if err != nil {
		panic(err)
	}
	return chatHistory
}

// handler for user using illicit language
func handleProfaneUser(ws *websocket.Conn, name, msg, threadTS, channelName string) {
	ws.WriteMessage(websocket.TextMessage, []byte("You have been banned for using illicit language in the chat. You may contact the administrator for any further discussions."))
	BanUser(name, globals.GetChannelID(channelName))
	SendMsgAsBot(globals.GetChannelID(channelName), fmt.Sprintf("This user has been banned due to use of illicit language.\nThe profane part of the chat is %s", profanityutils.GetProfanePartOfMsg(string(msg))), threadTS)
	// unban user
}

func CheckConnectionStillActive(userID string) bool {
	ws := userIDWebSockets[userID]
	err := ws.WriteMessage(websocket.TextMessage, []byte("ping"))
	if err == websocket.ErrCloseSent {
		CloseWebsocketAndCleanByUserID(userID)
		return false
	} else if err != nil {
		fmt.Println("Error while pinging the websocket: ", err)
		CloseWebsocketAndCleanByUserID(userID)
		return false
	}
	return true
}
