package main

import (
	"context"
	"os"

	"bot/api/utils"
	"bot/listeners"
	"bot/route"
	"bot/db"

	"github.com/joho/godotenv"
)

var channelTokens = make(map[string]string)
var channelNames = make(map[string]string)
var token, appToken string

func initializeEnv() {
	godotenv.Load(".env")
	token = os.Getenv("SLACK_AUTH_TOKEN")
	channelTokens["public"] = os.Getenv("SLACK_PUBLIC_CHANNEL_ID")
	channelTokens["private"] = os.Getenv("SLACK_PRIVATE_CHANNEL_ID")
	channelNames[os.Getenv("SLACK_PUBLIC_CHANNEL_ID")] = "public"
	channelNames[os.Getenv("SLACK_PRIVATE_CHANNEL_ID")] = "private"
	appToken = os.Getenv("SLACK_APP_TOKEN")
}

func main() {
	initializeEnv()
	utils.InitClient(token, appToken)
	utils.InitChannelTokens()
	listeners.InitSocketClient(utils.Client)
	db.InitChannelTokens()
	db.Init()

	// context used for the goroutine that listens to events on Slack and broadcasts to frontend clients
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go listeners.SocketClient.Run()
	go listeners.MsgListener(ctx, listeners.SocketClient, channelTokens)
	route.Init()
}