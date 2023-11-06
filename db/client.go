package db

import (
	"bot/globals"
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
func AddMsgToDB(message models.Message, channelID, threadTS, userID string) {
	marshalled, err := json.Marshal(message)
	if err != nil {
		panic(err)
	}
	_, err = redisClient.Set(ctx, fmt.Sprintf("%v:%v:%v:%v", globals.FindChannelNameIfValidToken(channelID), userID, message.Timestamp, threadTS), marshalled, 24*7*time.Hour).Result()
	if err != nil {
		panic(err)
	}
}

func RemoveMsgFromDB(channelID, timestamp string) {
	// get keys by matching pattern
	// since we will have one key only, delete it
	iter, _ := redisClient.Keys(ctx, fmt.Sprintf("%v:*%v:*", globals.FindChannelNameIfValidToken(channelID), timestamp)).Result()
	_, err := redisClient.Del(ctx, iter[0]).Result()
	if err != nil {
		fmt.Println("Error while deleting message: ", err)
		panic(err)
	}
}

/*
	To get all messages of a private user

# Will be required in case some kind of auth is integrated into the platform

Returns a string of marshalled messages
*/
func RetrieveAllMessagesPrivateUser(arrivalTimeStamp string) map[string]string {
	// iterate over all message keys and get their values
	messages := make(map[string]string)
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("private:*:%v", arrivalTimeStamp), numKeys).Iterator()
	for iter.Next(ctx) {
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
func RetrieveAllMessagesPublicChannels(channelName, userID string) (map[string]string, map[string]string) {
	// iterate over all message keys and get their values
	currUserSentMsg, otherUserSentMsg := make(map[string]string), make(map[string]string)
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, fmt.Sprintf("%v:*", channelName), numKeys).Iterator()
	for iter.Next(ctx) {
		a, _ := redisClient.MGet(ctx, iter.Val()).Result()
		str, _ := a[0].(string)
		if strings.Split(iter.Val(), ":")[1] == userID {
			currUserSentMsg[strings.Split(iter.Val(), ":")[2]] = str
		} else {
			otherUserSentMsg[strings.Split(iter.Val(), ":")[2]] = str
		}
	}
	if err := iter.Err(); err != nil {
		panic(err)
	}
	return currUserSentMsg, otherUserSentMsg
}

// function to add user to the db
func AddUserEntry(name, userID string) {
	_, err := redisClient.Set(ctx, fmt.Sprintf("active:%v", userID), name, 24*7*time.Hour).Result() // key = userID, value = name
	if err != nil {
		panic(err)
	}
}

// to set ttl of the user credentials to next 7 days
func ChangeActiveUserToInactive(userID string) {
	redisClient.Rename(ctx, fmt.Sprintf("active:%v", userID), fmt.Sprintf("inactive:%v", userID))
	_, err := redisClient.Expire(ctx, fmt.Sprintf("inactive:%v", userID), 24*7*time.Hour).Result()
	if err != nil {
		panic(err)
	}
}

// function to check if a userID is valid or not
func CheckValidUserID(userID string) bool {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	activeUserID := "active:" + userID
	inactiveUserID := "inactive:" + userID
	iter := redisClient.Scan(ctx, 0, activeUserID, numKeys).Iterator()
	// if a valid key value pair with the userID as key exists then the userID is valid
	for iter.Next(ctx) {
		currId := iter.Val()
		if currId == activeUserID {
			return true
		}
	}
	iter = redisClient.Scan(ctx, 0, inactiveUserID, numKeys).Iterator()
	for iter.Next(ctx) {
		currId := iter.Val()
		if currId == inactiveUserID {
			return true
		}
	}
	return false
}

// check if there exists some active user with given user id
func CheckValidActiveUserID(userID string) bool {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	userID = "active:" + userID
	iter := redisClient.Scan(ctx, 0, userID, numKeys).Iterator()
	// if a valid key value pair with the userID as key exists then the userID is valid
	for iter.Next(ctx) {
		if iter.Val() == userID {
			return true
		}
	}
	return false
}

// check if there exists some inactive user with given user id
func CheckValidInactiveUserID(userID string) bool {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	userID = "inactive:" + userID
	iter := redisClient.Scan(ctx, 0, userID, numKeys).Iterator()
	// if a valid key value pair with the userID as key exists then the userID is valid
	for iter.Next(ctx) {
		if iter.Val() == userID {
			return true
		}
	}
	return false
}

func CheckUserIDBanned(userID string) bool {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	userID = "banned:" + userID
	iter := redisClient.Scan(ctx, 0, userID, numKeys).Iterator()
	// if a valid key value pair with the userID as key exists then the userID is valid
	for iter.Next(ctx) {
		if iter.Val() == userID {
			return true
		}
	}
	return false
}

// remove a user from database
func RemoveUser(userID string) {
	if CheckValidUserID(userID) {
		_, err := redisClient.Del(ctx, fmt.Sprintf("active:%v", userID)).Result()
		if err != nil {
			panic(err)
		}
		_, err = redisClient.Del(ctx, fmt.Sprintf("inactive:%v", userID)).Result()
		if err != nil {
			panic(err)
		}
	}
}

// to fetch all user names
func GetAllUsers(channelName string) []string {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	unbannedUsers := getUnbannedUsers(channelName, numKeys)
	bannedUsers := getBannedUsers(channelName, numKeys)
	userNames := append(bannedUsers, unbannedUsers...)
	return userNames
}

// func to get un banned users
func getUnbannedUsers(channelName string, numKeys int64) []string {
	iter := redisClient.Scan(ctx, 0, "active:"+channelName+"*", numKeys).Iterator()
	var userNames []string
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		name += "(active)"
		userNames = append(userNames, name)
	}
	iter = redisClient.Scan(ctx, 0, "inactive:"+channelName+"*", numKeys).Iterator()
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		name += "(inactive)"
		userNames = append(userNames, name)
	}
	return userNames
}

// func to get banned users
func getBannedUsers(channelName string, numKeys int64) []string {
	iter := redisClient.Scan(ctx, 0, "banned:"+channelName+"*", numKeys).Iterator()
	var userNames []string
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		name += "(banned)"
		userNames = append(userNames, name)
	}
	return userNames
}

// To get user Id from user name
func GetUserID(username string) string {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, "active:*", numKeys).Iterator()
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		if name == username {
			return strings.Split(iter.Val(), ":")[1]
		}
	}
	iter = redisClient.Scan(ctx, 0, "inactive:*", numKeys).Iterator()
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		if name == username {
			return strings.Split(iter.Val(), ":")[1]
		}
	}
	iter = redisClient.Scan(ctx, 0, "banned:*", numKeys).Iterator()
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		if name == username {
			return strings.Split(iter.Val(), ":")[1]
		}
	}
	return ""
}

func GetBannedUserId(username string) string {
	numKeys, _ := redisClient.DBSize(ctx).Result()
	iter := redisClient.Scan(ctx, 0, "banned:*", numKeys).Iterator()
	for iter.Next(ctx) {
		name, _ := redisClient.Get(ctx, iter.Val()).Result()
		if name == username {
			return strings.Split(iter.Val(), ":")[1]
		}
	}
	return ""
}

func BanUserInDB(username string) {
	userID := GetUserID(username)
	RemoveUser(userID)
	// in case user is not unbanned manually after 7 days, he/she is unbanned automatically
	_, err := redisClient.Set(ctx, fmt.Sprintf("banned:%v", userID), username, 24*7*time.Hour).Result() // key = userID, value = name
	if err != nil {
		panic(err)
	}
}

func UnbanUserInDB(username string) {
	userID := GetBannedUserId(username)
	_, err := redisClient.Del(ctx, fmt.Sprintf("banned:%v", userID)).Result()
	if err != nil {
		panic(err)
	}
}

// To check if any user with same userid and different username is already in the chat room
func CheckIfUserIDExists(username, userID string) bool {
	keys_matching := redisClient.Keys(ctx, fmt.Sprintf("*:%v", userID)).Val()
	if len(keys_matching) == 0 {
		return false
	}
	if len(keys_matching) > 1 {
		return true
	}
	name := redisClient.Get(ctx, keys_matching[0]).Val()
	return name != username
}
