package utils

import (
	"bot/globals"
	"bot/logging"
	"bot/models"
	"encoding/json"
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
			slack.MsgOptionText(msg, false),
			slack.MsgOptionTS(tstamp),
		)
	} else {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionText(msg, false),
		)
	}
	if perr != nil {
		logging.LogException(perr)
		return ""
	}
	return ts
}

func SendMsg(channelToken, msg, userName, tstamp string) (timestamp string) {
	var ts string
	var perr error
	if tstamp != "" {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionUsername(userName),
			slack.MsgOptionTS(tstamp),
			slack.MsgOptionText(msg, false),
		)
	} else {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionUsername(userName),
			slack.MsgOptionText(msg, false),
		)
	}
	if perr != nil {
		fmt.Println("Exception while posting message to slack as a user: ", perr)
		logging.LogException(perr)
		panic(perr)
	}
	return ts
}

func GetSlackUserInfo(userID string) *slack.User {
	user, err := Client.GetUserInfo(userID)
	if err != nil {
		fmt.Println("Error while fetching user info: ", err)
		logging.LogException(err)
		panic(err)
	}
	return user
}

func SendUserInfoToSlack(infoObj models.UserInfo) {
	Client.PostMessage(
		globals.GetChannelID(infoObj.Channel),
		slack.MsgOptionAttachments(slack.Attachment{
			Text: fmt.Sprintf("IP: %v\nLocation: %v\nAgent: %v\nOperating System: %v\n", infoObj.IP, infoObj.Location, infoObj.Agent, infoObj.OS),
		}),
		slack.MsgOptionText("Info for user "+infoObj.Username, false))
}

// Function to delete a message
/*
Can delete only those messages which are sent by frontend clients
*/
func DeleteMsg(channelToken, tstamp, triggerID string) {
	_, _, e := Client.DeleteMessage(channelToken, tstamp)
	if e != nil {
		fmt.Println("Error while deleting message: ", e)
		logging.LogException(e)
	}
}

func ShowEmailModal(triggerID,userName,timestamp,channleId string) {
	privateMetadata, err := json.Marshal(map[string]string{"userName": userName, "timestamp": timestamp , "channelId": channleId})
    if err != nil {
        fmt.Printf("Error encoding private metadata: %v\n", err)
        return
    }
	modalRequest := slack.ModalViewRequest{
		Type:       "modal",
		CallbackID: "email response",
		Title: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "My App",
		},
		Close: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Close",
		},
		Blocks: slack.Blocks{
			BlockSet: []slack.Block{
				slack.InputBlock{
					Type:    "input",
					BlockID: "email_response",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "email_response",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter message here"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Email Response"},
				},
			},
		},
		Submit: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Submit",
		},
		PrivateMetadata: string(privateMetadata), 
	}
	 _, err = Client.OpenView(triggerID, modalRequest)
    if err != nil {
        fmt.Printf("Error opening view: %v\n", err)
    }
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
