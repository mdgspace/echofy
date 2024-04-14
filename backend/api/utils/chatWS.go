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
	"bot/logging"
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
var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
var webSocketMapsMutex sync.Mutex
var wg sync.WaitGroup

// common chat user handler
func ChatUserHandler(c echo.Context, name string, channel string, userID string) error {
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
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), c.Response().Header())
	if err != nil {
		logging.LogException(err)
		SendInternalServerErrorCloseMessage(c, "Internal Server Error while upgrading the websocket connection")
		return err
	}
	userAgent := c.Request().UserAgent()
	ws.WriteMessage(websocket.TextMessage, []byte("Welcome to MDG Chat!"))
	if userID == "" || !db.CheckValidUserID(userID) {
		if channel == "public" || channel == "chatbot" {
			userID = channel + name + strconv.Itoa(int(time.Now().Unix()))
		} else if channel == "private" {
			userID = SendMsgAsBot(globals.GetChannelID("private"), name+" has joined private chat", "")
		}
		ws.WriteJSON(map[string]string{"userID": userID})
		db.AddUserEntry(name, userID)
		db.AddUserInfoToDb(name, userID, userAgent, c.RealIP(), channel)
	}
	addUserAndWebsocketToLocalData(ws, userID, channel)
	if channel == "public" {
		go PublicChatsHandler(c, name, userID, ws)
	} else if channel == "private" {
		go PrivateChatsHandler(c, name, userID, ws)
	} else if channel == "chatbot" {
		go ChatBotChatHandler(c, c.FormValue("topic"), name, userID, ws)
	} else {
		SendBadRequestMessage(c, "Invalid channel name")
	}
	return nil
}

// handler for private chats
func PrivateChatsHandler(c echo.Context, name, userID string, ws *websocket.Conn) error {
	defer ws.Close()
	privateChatWS[userID] = ws
	prevMsgs := getMarshalledSegregatedMsgHistoryPrivateUser(userID)
	ws.WriteMessage(websocket.TextMessage, prevMsgs)
	rootTS := userID
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			if err.Error() == "websocket: close 1000 (normal)" || err.Error() == "websocket: close 1001 (going away)" || err.Error() == "websocket: close 1005 (no status)" || err.Error() == "websocket: close 1006 (abnormal closure)"{
				SendMsgAsBot(globals.GetChannelID("private"), "This user has left the chat", rootTS)
				delete(privateChatWS, userID)
				return nil
			}
			CloseWebsocketAndClean(ws, "private", rootTS)
			logging.LogException(err)
			panic(err)
		}
		if profanityutils.IsMsgProfane(string(msg)) {
			handleProfaneUser(ws, name, string(msg), rootTS, "private")
		}
		SendMsg(globals.GetChannelID("private"), string(msg), name, rootTS)
		newMsg := models.Message{
			Text:      string(msg),
			Sender:    name,
			Timestamp: rootTS,
		}
		sendSlackToPrivateUser(newMsg, userID)
		db.AddMsgToDB(newMsg, globals.GetChannelID("private"), rootTS, userID)
		err = ws.WriteMessage(websocket.TextMessage, []byte("Message send successful")) //This is just so that we can check at frontend regularly that connection is alive
		if err != nil {
			if err == websocket.ErrCloseSent {
				SendMsgAsBot(globals.GetChannelID("private"), "This user has left the chat", rootTS)
			} else {
				SendMsgAsBot(globals.GetChannelID("private"), "There was some error in the websocket corresponding to the user and hence it has been closed", rootTS)
			}
			CloseWebsocketAndClean(ws, "private", rootTS)
			logging.LogException(err)
			panic(err)
		}
	}
}

// handler for public chats
func PublicChatsHandler(c echo.Context, name string, userID string, ws *websocket.Conn) error {
	defer ws.Close()
	prevMsgs := getMarshalledSegregatedMsgHistoryPublicUser(userID)
	ws.WriteMessage(websocket.TextMessage, prevMsgs)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			logging.LogException(err)
			SendInternalServerErrorCloseMessage(c, "Internal Server Error while reading the message from websocket connection")
			CloseWebsocketAndClean(ws, "public", userID)
			return nil
		}
		if string(msg) != "" {
			ts := SendMsg(globals.GetChannelID("public"), string(msg), name, "")
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
			sendMsgToPublicUsers(newMsg)
			db.AddMsgToDB(newMsg, globals.GetChannelID("public"), ts, userID)
			err = ws.WriteMessage(websocket.TextMessage, []byte("Message send successful")) //This is just so that we can check at frontend regularly that connection is alive
			if err != nil {
				logging.LogException(err)
				SendInternalServerErrorCloseMessage(c, "Internal Server Error while writing the message to websocket connection")
				CloseWebsocketAndClean(ws, "public", userID)
				return nil
			}
		}
	}
}

// handler for chats with chatbot
func ChatBotChatHandler(c echo.Context, chatTopic, name, userID string, ws *websocket.Conn) {
	defer ws.Close()
	if !checkValidBotTopic(chatTopic) {
		ws.WriteMessage(websocket.TextMessage, []byte("Invalid chat topic"))
		return
	}
	sesID, err := initNewSessionClient(userID)
	if err != nil || sesID == "" {
		ws.WriteMessage(websocket.TextMessage, []byte("Internal Server Error"))
		logging.LogException(err)
		return
	}
	defer closeSessionClient(sesID)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			logging.LogException(err)
			SendInternalServerErrorCloseMessage(c, "Internal Server Error while reading the message from websocket connection")
			CloseWebsocketAndClean(ws, "chatbot", userID)
			return
		}
		if string(msg) != "" {
			ws.WriteMessage(websocket.TextMessage, []byte("You: "+string(msg)))
			answer, err := retrieveTextQueryResponse(sesID, string(msg), chatTopic)
			if err != nil {
				if err.Error() == globals.ChatbotNoAnswerFound {
					err = ws.WriteMessage(websocket.TextMessage, []byte("No answers found for that query, please try again or proceed to public/private slack chat"))
				}
			} else {
				err = ws.WriteMessage(websocket.TextMessage, []byte(answer))
			}
			if err != nil {
				CloseWebsocketAndClean(ws, "chatbot", userID)
				if err != websocket.ErrCloseSent {
					logging.LogException(err)
				}
			}
		}
	}
}

// close websocket and remove it from wherever it is stored (golang slices)
func CloseWebsocketAndClean(ws *websocket.Conn, channelName, userID string) {
	wg.Wait()
	wg.Add(1)
	webSocketMapsMutex.Lock()
	defer ws.Close()
	defer ws.CloseHandler()(websocket.CloseNormalClosure, "Connection closed")
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
	if privateChatWS[threadTS] == nil {
		return
	}
	err := privateChatWS[threadTS].WriteJSON(msgObj)
	if err != nil {
		if err == websocket.ErrCloseSent {
			go CloseWebsocketAndClean(privateChatWS[threadTS], "private", threadTS)
			SendMsgAsBot(globals.GetChannelID("private"), "This user has left the chat", threadTS)
		} else {
			fmt.Println("Error while sending message received on slack to a private chat user: ", err)
			logging.LogException(err)
			panic(err)
		}
	}
}

// function to broadcast msg from slack to all corresponding frontend clients
func sendMsgToPublicUsers(msgObj models.Message) {
	var closedWSIndex []int
	var aliveConns []*websocket.Conn
	for index, value := range webSockets["public"] {
		err := value.WriteJSON(msgObj)
		if err != nil {
			if err == websocket.ErrCloseSent {
				go CloseWebsocketAndClean(value, "public", webSocketsUserID[value])
				closedWSIndex = append(closedWSIndex, index)
			} else {
				fmt.Println("Unhandled exception while sending message to public chat users", err)
				logging.LogException(err)
			}
		}
		aliveConns = append(aliveConns, value)
	}
	if len(closedWSIndex) != 0 {
		webSockets["public"] = aliveConns //cleaning up closed connections
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
				fmt.Println("Unhandled exception while sending message to public chat users", err)
				logging.LogException(err)
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
		sendMsgToPublicUsers(msgObj)
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

func RequestUserInfo(username string) string {
	userID := db.GetUserID(username)
	if userID == "" {
		return "No user Exists with this username"
	} else {
		info := db.GetUserInfo(userID)
		return info
	}
}

func getMarshalledSegregatedMsgHistoryPublicUser(userID string) []byte {
	currUserSentMsg, otherUserSentMsg := db.RetrieveAllMessagesPublicChannel(userID)
	allPrevMsgs := make(map[string]map[string]string)
	allPrevMsgs["Sent by you"] = currUserSentMsg
	allPrevMsgs["Sent by others"] = otherUserSentMsg
	chatHistory, err := json.Marshal(allPrevMsgs)
	if err != nil {
		logging.LogException(err)
		return []byte{}
	}
	return chatHistory
}

func getMarshalledSegregatedMsgHistoryPrivateUser(userID string) []byte {
	currUserSentMsg, otherUserSentMsg := db.RetrieveAllMessagesPrivateUser(userID)
	allPrevMsgs := make(map[string]map[string]string)
	allPrevMsgs["Sent by you"] = currUserSentMsg
	allPrevMsgs["Sent by others"] = otherUserSentMsg
	chatHistory, err := json.Marshal(allPrevMsgs)
	if err != nil {
		logging.LogException(err)
		return []byte{}
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

func SendBanMessage(c echo.Context, reason string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	closeCode := websocket.ClosePolicyViolation
	closeMessage := websocket.FormatCloseMessage(closeCode, reason)
	if err := ws.WriteMessage(websocket.CloseMessage, closeMessage); err != nil {
		return err
	}
	return nil
}

func SendConflictMessage(c echo.Context, reason string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	closeCode := 4001 //custom close code for same uername
	closeMessage := websocket.FormatCloseMessage(closeCode, reason)
	if err := ws.WriteMessage(websocket.CloseMessage, closeMessage); err != nil {
		return err
	}
	return nil
}

func SendBadRequestMessage(c echo.Context, reason string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	closeCode := websocket.CloseInvalidFramePayloadData
	closeMessage := websocket.FormatCloseMessage(closeCode, reason)
	if err := ws.WriteMessage(websocket.CloseMessage, closeMessage); err != nil {
		return err
	}
	return nil
}

func SendNormalCloseMessage(c echo.Context, reason string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	closeCode := websocket.CloseNormalClosure
	closeMessage := websocket.FormatCloseMessage(closeCode, reason)
	if err := ws.WriteMessage(websocket.CloseMessage, closeMessage); err != nil {
		return err
	}
	return nil
}

func SendInternalServerErrorCloseMessage(c echo.Context, reason string) error {
	ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	closeCode := websocket.CloseInternalServerErr
	closeMessage := websocket.FormatCloseMessage(closeCode, reason)
	if err := ws.WriteMessage(websocket.CloseMessage, closeMessage); err != nil {
		return err
	}
	return nil
}
