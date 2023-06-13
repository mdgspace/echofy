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
	if os.Getenv("SLACK_"+strings.ToUpper(channelName)+"_CHANNEL_ID") != "" {
		return "Channel token exists already"
	}
	os.Setenv("SLACK_"+strings.ToUpper(channelName)+"_CHANNEL_ID", token)
	f, err := os.OpenFile(".env", os.O_APPEND, 0644)
	if err != nil {
		return "Error while writing new channel token to env file with error message: "+ err.Error() +"\n Please try again"
	}
	f.WriteString("SLACK_" + strings.ToUpper(channelName) + "_CHANNEL_ID = " + token+"\n")
	f.Close()
	globals.AddChannelNameAndToken(strings.ToLower(channelName), token)
	channelIDs[channelName] = token
	return "Channel token added successfully. Please add the app to the new channel"
}
