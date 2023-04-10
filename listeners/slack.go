package listeners

import (
	"context"

	"bot/api/utils"
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
					sender := utils.GetSlackUserInfo(s.User)
					utils.SendMsgToFrontend(models.Message{Text: s.Text, Sender: sender.Profile.DisplayName, ImageUrl: sender.Profile.ImageOriginal, Timestamp: string(s.TimeStamp)}, s.Channel, s.ThreadTimeStamp)
				}
			}
		}
	}
}
