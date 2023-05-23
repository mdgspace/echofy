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
						commandListener(strings.Split(s.Text, "!")[1], s.Channel)
					} else { sender := utils.GetSlackUserInfo(s.User)
					msg := models.Message{Text: s.Text, Sender: sender.Profile.DisplayName, ImageUrl: sender.Profile.ImageOriginal, Timestamp: string(s.TimeStamp)}
					db.AddMsgToDB(msg, s.Channel, s.ThreadTimeStamp)
					utils.SendMsgToFrontend(msg, s.Channel, s.ThreadTimeStamp)}
				}
			}
		}
	}
}

// for commands like `!users`
func commandListener(command, channelToken string) {
	if (command == "users"){
		userNames := db.GetActiveUsers()
		names := ""
		for _, name := range(userNames) {
			names += name + ", "
		}
		names = names[:len(names) - 2]
		utils.SendMsgAsBot(channelToken, names, "")
	} 
}