package main

import (
	"context"
	"os"
	"strings"
	"time"

	"bot/api/utils"
	"bot/db"
	"bot/logging"
	"bot/globals"
	"bot/listeners"
	"bot/profanity_utils"
	"bot/route"

	"github.com/getsentry/sentry-go"
	"github.com/joho/godotenv"
)

var channelTokens = make(map[string]string)
var channelNames = make(map[string]string)
var token, appToken string

func initializeSlackEnv() {
	envVar := os.Environ()
	for _, element := range(envVar) {
		pair := strings.Split(element,"=")
		key := pair[0]
		if key == "SLACK_AUTH_TOKEN" {
			token = pair[1]
		} else if key == "SLACK_APP_TOKEN" {
			appToken = pair[1]
		} else if strings.HasSuffix(key, "_CHANNEL_ID") && strings.HasPrefix(key, "SLACK_") {
			channelName := strings.ToLower(key[6:len(key)-11])
			channelTokens[channelName] = pair[1]
			channelNames[pair[1]] = channelName
		}
	}
	globals.InitVariables(channelNames, channelTokens)
}

func main() {
	godotenv.Load(".env")
	sentryDSN := os.Getenv("SENTRY_DSN")
	if sentryDSN != "" {
		logging.Init(sentryDSN)
		defer sentry.Flush(2 * time.Second)
	}
	globals.InitLocationToken(os.Getenv("LOCATION_TOKEN"))
	initializeSlackEnv()
	utils.InitClient(token, appToken)
	listeners.InitAndRunSocketClient(utils.Client, channelTokens)
	db.Init()
	profanityutils.InitProfanityDetector()
	utils.InitDialogflowConfig(os.Getenv("GCP_PROJECT_ID"))

	// context used for the goroutine that listens to events on Slack and broadcasts to frontend clients
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go listeners.MsgListener(ctx)
	route.Init()
}