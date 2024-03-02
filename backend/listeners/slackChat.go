package listeners

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"bot/api/utils"
	customutils "bot/customUtils"
	"bot/db"
	"bot/logging"
	"bot/models"
	profanityutils "bot/profanity_utils"

	"github.com/slack-go/slack"
	"github.com/slack-go/slack/slackevents"
	"github.com/slack-go/slack/socketmode"
)

var socketClient *socketmode.Client

var channelIDs = make(map[string]string)

func InitAndRunSocketClient(client *slack.Client, channelTokens map[string]string) {
	socketClient = socketmode.New(
		client,
		socketmode.OptionDebug(true),
	)
	channelIDs = channelTokens
	go socketClient.Run()
}

func MsgListener(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case event := <-socketClient.Events:
			switch event.Type {
			case socketmode.EventTypeEventsAPI:
				eventsAPIEvent, ok := event.Data.(slackevents.EventsAPIEvent)
				if !ok {
					continue
				}
				socketClient.Ack(*event.Request)
				s, isMessage := eventsAPIEvent.InnerEvent.Data.(*slackevents.MessageEvent)
				if isMessage && s.BotID == "" {
					if s.SubType == "message_deleted" {
						continue
					} else if strings.HasPrefix(s.Text, "!") {
						continue
					} else {
						sender := utils.GetSlackUserInfo(s.User)
						msg := models.Message{Text: s.Text, Sender: sender.Profile.DisplayName, ImageUrl: sender.Profile.ImageOriginal, Timestamp: string(s.TimeStamp)}
						db.AddMsgToDB(msg, s.Channel, s.ThreadTimeStamp, "") //empty userID for messages sent by Slack users
						utils.SendMsgToFrontend(msg, s.Channel, s.ThreadTimeStamp)
					}
				}
			case socketmode.EventTypeInteractive:
				callback, ok := event.Data.(slack.InteractionCallback)
				if !ok {
					continue
				}
				socketClient.Ack(*event.Request)
				if callback.Type == slack.InteractionTypeMessageAction {
					if callback.CallbackID == "delete_message" {
						utils.DeleteMsg(callback.Channel.ID, callback.Message.Timestamp, callback.TriggerID)
						db.RemoveMsgFromDB(callback.Channel.ID, callback.Message.Timestamp)
						utils.SendMsgDeleteSignal(callback.Channel.ID, callback.Message.Timestamp)
					}
					if callback.CallbackID == "email_respond" {
						utils.ShowEmailModal(callback.TriggerID, callback.Message.Username , callback.Message.Timestamp , callback.Channel.ID)
					}
				}
				if callback.Type == slack.InteractionTypeViewSubmission {
					response := callback.View.State.Values["email_response"]["email_response"].Value
					var metaData map[string]string
    				err := json.Unmarshal([]byte(callback.View.PrivateMetadata), &metaData)
    					if err != nil {
        				logging.LogException(err)
   					}
    				userName := metaData["userName"]
					channelId := metaData["channelId"]
					timestamp := metaData["timestamp"]
					email := db.GetUserEmail(userName)
					if (email == "") {
						fmt.Println("email not found")
						fmt.Println("channelId", channelId)
						utils.SendMsgAsBot(channelId, "User has not provided email", timestamp)
					}else{
						result := customutils.SendEmail(callback.User.ID, email, response)
						if(result == "mail sent successfully") {
							utils.SendMsgAsBot(channelId, "Email sent successfully", timestamp)
							db.RemoveUserEmail(userName)
						} else {
							utils.SendMsgAsBot(channelId, "Error sending email", timestamp)
						}
					}
					
				}
			case socketmode.EventTypeSlashCommand:
				commandObj, ok := event.Data.(slack.SlashCommand)
				if !ok {
					continue
				}
				if commandObj.ChannelID != channelIDs["admin"] {
					utils.SendMsgAsBot(commandObj.ChannelID, "Unauthorized operation", "")
				}
				socketClient.Ack(*event.Request)
				commandBody := strings.Split(commandObj.Text, " ")
				var reply string
				var isreply bool
				if commandObj.Command == "/addchanneltoken" {
					isreply = true
					reply = addChannelTokenHandler(commandBody[0], commandBody[1])
				} else if commandObj.Command == "/removeprofane" {
					isreply = true
					reply = profanityutils.RemoveProfane(commandBody[0])
				} else if commandObj.Command == "/addprofane" {
					isreply = true
					reply = profanityutils.AddProfane(commandBody[0])
				} else if commandObj.Command == "/users" {
					isreply = true
					reply = showUsers(channelIDs["tp"])
				} else if commandObj.Command == "/info" {
					isreply = true
					reply = utils.RequestUserInfo(commandBody[0])
				} else if commandObj.Command == "/ban" {
					utils.BanUser(commandBody[0], channelIDs["admin"])
				} else if commandObj.Command == "/unban" {
					utils.UnbanUser(commandBody[0], channelIDs["admin"])
				} else {
					reply = "Invalid command: " + commandObj.Command
				}
				if isreply {
					utils.SendMsgAsBot(channelIDs["admin"], reply, "")
				}
			}
		}
	}
}
