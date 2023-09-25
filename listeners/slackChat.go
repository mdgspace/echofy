package listeners

import (
	"context"
	"strings"

	"bot/api/utils"
	"bot/db"
	"bot/globals"
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
					if strings.HasPrefix(s.Text, "!") {
						commandListener(strings.Split(s.Text, "!")[1], s.Channel, s.TimeStamp)
					} else {
						sender := utils.GetSlackUserInfo(s.User)
						msg := models.Message{Text: s.Text, Sender: sender.Profile.DisplayName, ImageUrl: sender.Profile.ImageOriginal, Timestamp: string(s.TimeStamp)}
						db.AddMsgToDB(msg, s.Channel, s.ThreadTimeStamp, "") //empty userID for messages sent by Slack users
						utils.SendMsgToFrontend(msg, s.Channel, s.ThreadTimeStamp)
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
				if commandObj.Command == "/addchanneltoken" {
					reply = addChannelTokenHandler(commandBody[0], commandBody[1])
				} else if commandObj.Command == "/removeProfane" {
					profanityutils.RemoveProfane(commandBody[0])
				} else {
					reply = "Invalid command: " + commandObj.Command
				}

				utils.SendMsgAsBot(channelIDs["admin"], reply, "")
			}
		}
	}
}

// TODO: store users in such a way that we can access their websocket object from their user id
// for commands like `!users`
func commandListener(command, channelToken, msgTS string) {
	if command == "users" {
		userNames := db.GetAllUsers(globals.FindChannelNameIfValidToken(channelToken))
		names := ""
		for _, name := range userNames {
			names += name + ", "
		}
		if names == "" {
			utils.SendMsgAsBot(channelToken, "No users as of now", "")
			return
		}
		names = names[:len(names)-2]
		utils.SendMsgAsBot(channelToken, names, "")
	} else if strings.HasPrefix(command, "info") {
		// send request to frontend for information
		// receive information
		// send information to slack
		username := strings.Split(command, " ")[1]
		reqInfo := utils.RequestUserInfo(username)
		if reqInfo["Status"] == "Fail" {
			utils.SendMsgAsBot(channelToken, "Request for user info failed\nError msg: "+reqInfo["Error"], msgTS)
		}
	} else if strings.HasPrefix(command, "ban") {
		// ip based blacklisting
		username := strings.Split(command, " ")[1]
		utils.BanUser(username, channelToken)
	} else if strings.HasPrefix(command, "unban") {
		username := strings.Split(command, " ")[1]
		utils.UnbanUser(username, channelToken)
	}
}
