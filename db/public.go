package db

import (
	"bot/models"
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client
var ctx context.Context

// const listName = "publicChats"

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
func AddMsgToDB(message models.Message) {
	marshalled, err := json.Marshal(message)
	if err != nil {
		panic(err)
	}
	// res := redisClient.MSet(ctx, message.Timestamp, marshalled)
	_, err = redisClient.Set(ctx, fmt.Sprintf("message:%v", message.Timestamp), marshalled, 24*7*time.Hour).Result()
	if err != nil {
		panic(err)
	}
}

/*
	to get all messages from the db

returns a string of marshalled messages
*/
func RetrieveAllMessages() map[string]string {
	// iterate over all message keys and get their values
	messages := make(map[string]string)
	iter := redisClient.Scan(ctx, 0, "message:*", 0).Iterator()
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
