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

func ShowEmailModal(triggerID, userName, timestamp, channleId string) {
	privateMetadata, err := json.Marshal(map[string]string{"userName": userName, "timestamp": timestamp, "channelId": channleId})
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
