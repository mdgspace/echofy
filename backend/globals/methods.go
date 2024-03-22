package globals

var LocationToken string

func InitVariables(channel_names map[string]string, channel_tokens map[string]string) {
	channelNames = channel_names
	channelTokens = channel_tokens
}

func IsChannelNameValid(channelName string) bool {
	if channelName == "chatbot" {
		return true
	}
	for _, channel := range channelNames {
		if channel == channelName {
			return true
		}
	}
	return false
}

func AddChannelNameAndToken(channelName, channelID string) {
	channelNames[channelID] = channelName
	channelTokens[channelName] = channelID
}

func GetChannelID(channelName string) string {
	return channelTokens[channelName]
}

func FindChannelNameIfValidToken(channelID string) (channelName string) {
	for name, id := range channelTokens {
		if id == channelID {
			return name
		}
	}
	return ""
}

func InitLocationToken(location_token string) {
	LocationToken = location_token
}
