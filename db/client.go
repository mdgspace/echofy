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
func RetrieveAllMessagesPrivateUser(arrivalTimeStamp string) map[string]string {
	// iterate over all message keys and get their values
	messages := make(map[string]string)
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("private:*:%v", arrivalTimeStamp), numKeys).Iterator()
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

/*
	to get all messages from the db

returns a string of marshalled messages
*/
func RetrieveAllMessagesPublicChannels(channelName string) map[string]string {
	// iterate over all message keys and get their values
	messages := make(map[string]string)
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("%v:*", channelName), numKeys).Iterator()
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

// function to add user to the db
func AddPublicUser(name, userID string) {
	_, err := redisClient.Set(ctx, fmt.Sprintf("user:%v",userID), name, 24*7*time.Hour).Result() // key = userID, value = name
	if err != nil {
		panic(err)
	}
}

// function to check if a userID is valid or not
func CheckValidUserID(userID string) bool {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("user:%v",userID), numKeys).Iterator()
	// if a valid key value pair with the userID as key exists then the userID is valid
	for iter.Next(ctx) {
		if (iter.Val() == userID){
			return true;
		}
	}
	return false;
}

// remove a public user from database; to be done when user exits public chat
func RemovePublicUser(userID string) {
	if (CheckValidUserID(userID)) {
		_, err := redisClient.Del(ctx, fmt.Sprintf("user:%v",userID)).Result()
		if (err != nil){
			panic(err)
		}
	}
}

// to fetch all user names
func GetActiveUsers() []string{
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, "user:*", numKeys).Iterator()
	var userNames[] string
	for iter.Next(ctx){
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		fmt.Println("New name: ", name)
		userNames = append(userNames, name)
	}
	return userNames
}