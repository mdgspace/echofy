package db

import (
	"bot/models"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

var redisClient *redis.Client
var ctx context.Context

var channelNames = make(map[string]string)

func InitChannelTokens() {
	godotenv.Load("../.env")
	channelNames[os.Getenv("SLACK_PUBLIC_CHANNEL_ID")] = "public"
	channelNames[os.Getenv("SLACK_PRIVATE_CHANNEL_ID")] = "private"
}

func Init() {
	redisInit(6379, 3, "")
}

func redisInit(portNumber, dbNumber int, password string) {
	ctx = context.Background()
	redisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("localhost:%v", portNumber), //port number can be changed as per our wish
		Password: password,
		DB:       dbNumber,
	})
}

/*
to add a new message to the database
*/
func AddMsgToDB(message models.Message, channelID string, threadTS string) {
	marshalled, err := json.Marshal(message)
	if err != nil {
		panic(err)
	}
	_, err = redisClient.Set(ctx, fmt.Sprintf("%v:%v:%v", channelNames[channelID], message.Timestamp, threadTS), marshalled, 24*7*time.Hour).Result()
	if err != nil {
		panic(err)
	}
}

/*
	To get all messages of a private user
Will be required in case some kind of auth is integrated into the platform

Returns a string of marshalled messages
*/
func RetrieveAllMessagesPrivateUser(userName, arrivalTimeStamp string) map[string]string {
	// iterate over all message keys and get their values
	messages := make(map[string]string)
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("private:%v:*", arrivalTimeStamp), 0).Iterator()
	for iter.Next(ctx) {
		fmt.Println("keys", iter.Val())
		a, _ := redisClient.MGet(ctx, iter.Val()).Result()
		str, _ := a[0].(string)
		messages[strings.Split(iter.Val(), ":")[2]] = str
	}
	if err := iter.Err(); err != nil {
		panic(err)
	}
	return messages
}

/*
	to get all messages from the db

returns a string of marshalled messages
*/
func RetrieveAllMessagesPublicChannels(channelName string) map[string]string {
	// iterate over all message keys and get their values
	messages := make(map[string]string)
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("%v:*", channelName), 0).Iterator()
	for iter.Next(ctx) {
		fmt.Println("keys", iter.Val())
		a, _ := redisClient.MGet(ctx, iter.Val()).Result()
		str, _ := a[0].(string)
		messages[strings.Split(iter.Val(), ":")[1]] = str
	}
	if err := iter.Err(); err != nil {
		panic(err)
	}
	return messages
}