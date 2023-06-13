package listeners

import (
	"bot/globals"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/slack-go/slack"
)

func addChannelTokenHandler(channelName, token string) (remarks string) {
	info, err := socketClient.GetConversationInfo(&slack.GetConversationInfoInput{ChannelID: token})
	if err != nil || !(info.IsChannel) {
		return "Invalid channel token"
	}
	godotenv.Load("../.env")
	if os.Getenv(channelName) != "" {
		return "Channel token exists already"
	}
	channelName = strings.ToUpper(channelName)
	os.Setenv("SLACK_"+channelName+"_CHANNEL_ID", token)
	globals.AddChannelNameAndToken(channelName, token)
	channelIDs[channelName] = token
	return "Channel token added successfully"
}
