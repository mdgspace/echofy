package globals

func InitVariables(channel_names map[string]string, channel_tokens map[string]string) {
	channelNames = channel_names
	channelTokens = channel_tokens
}

func IsChannelNameValid(channelName string) bool {
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
	for name, id := range(channelTokens){
		if (id == channelID){
			return name
		}
	}
	return ""
}
