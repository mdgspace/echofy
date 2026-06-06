package main

import (
	"context"
	"log"
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

func initializeSlackEnv() (string, string) {
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
	return token, appToken
}

func main() {
	godotenv.Load(".env")
	utils.InitDialogflowConfig(os.Getenv("GCP_PROJECT_ID"))
	sentryDSN := os.Getenv("SENTRY_DSN")
	if sentryDSN != "" {
		logging.Init(sentryDSN)
		defer sentry.Flush(2 * time.Second)
	}
	globals.InitLocationToken(os.Getenv("IPINFO_TOKEN"))
	token, appToken := initializeSlackEnv()
	if token == "" || appToken == "" {
		log.Println("[WARN] Slack tokens not configured — Slack integration disabled. HTTP/WS server will still run.")
	} else {
		utils.InitClient(token, appToken)
		listeners.InitAndRunSocketClient(utils.Client, channelTokens)
		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()
		go listeners.MsgListener(ctx)
	}
	db.Init()
	if !db.Ping() {
		log.Println("[WARN] Redis not reachable — chat persistence disabled. Server will still start.")
	}
	profanityutils.InitProfanityDetector()

	route.Init()
}
