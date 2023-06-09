package listeners

import (
	"context"
	"strings"

	"bot/api/utils"
	"bot/db"
	"bot/models"

	"github.com/slack-go/slack"
	"github.com/slack-go/slack/slackevents"
	"github.com/slack-go/slack/socketmode"
)

var SocketClient *socketmode.Client

func InitSocketClient(client *slack.Client) {
	SocketClient = socketmode.New(
		client,
		socketmode.OptionDebug(true),
	)
}

func MsgListener(ctx context.Context, socketClient *socketmode.Client, channelTokens map[string]string) {
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
					if (strings.HasPrefix(s.Text, "!")){
						commandListener(strings.Split(s.Text, "!")[1], s.Channel, s.TimeStamp)
					} else { sender := utils.GetSlackUserInfo(s.User)
					msg := models.Message{Text: s.Text, Sender: sender.Profile.DisplayName, ImageUrl: sender.Profile.ImageOriginal, Timestamp: string(s.TimeStamp)}
					db.AddMsgToDB(msg, s.Channel, s.ThreadTimeStamp)
					utils.SendMsgToFrontend(msg, s.Channel, s.ThreadTimeStamp)}
				}
			}
		}
	}
}

// TODO: store users in such a way that we can access their websocket object from their user id
// for commands like `!users`
func commandListener(command, channelToken, msgTS string) {
	if (command == "users"){
		userNames := db.GetActiveUsers()
		names := ""
		for _, name := range(userNames) {
			names += name + ", "
		}
		if (names == ""){
			utils.SendMsgAsBot(channelToken, "No active users as of now", "")
			return
		}
		names = names[:len(names) - 2]
		utils.SendMsgAsBot(channelToken, names, "")
	} else if (strings.HasPrefix(command, "info")){
		// send request to frontend for information
		// receive information
		// send information to slack
		username := strings.Split(command, " ")[1]
		reqInfo := utils.RequestUserInfo(username)
		if (reqInfo["Status"] == "Fail"){
			utils.SendMsgAsBot(channelToken, "Request for user info failed\nError msg: " + reqInfo["Error"], msgTS)
		}
	} else if (strings.HasPrefix(command, "ban")){
		// ip based blacklisting
		username := strings.Split(command, " ")[1]
		utils.BanUser(username)
	}
}