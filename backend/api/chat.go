package api

import (
	"strings"
	"regexp"
	"fmt"

	"bot/api/utils"
	customutils "bot/customUtils"
	"bot/db"
	"bot/globals"
	"bot/models"
	profanityutils "bot/profanity_utils"

	"github.com/labstack/echo/v4"
)

func JoinChat() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		if utils.IsUserBanned(strings.Split(c.Request().RemoteAddr, ":")[0]) {
			return utils.SendBanMessage(c, "You are banned as of now , Incase you are using a public network, consider switching to mobile data")
		}
		name := c.FormValue("name")
		channel := c.FormValue("channel")
		validChannel := globals.IsChannelNameValid(channel)
		if name == "" || !validChannel {
			return utils.SendBadRequestMessage(c, "Name and/or channel missing")
			// return c.String(http.StatusBadRequest, "Name and/or channel missing")
		}
		if profanityutils.IsMsgProfane(name) {
			utils.SendMsgAsBot(globals.GetChannelID(channel), "A user tried to enter chat with a profane username: "+name+"", "")
			return utils.SendBadRequestMessage(c, "Username is profane")
		}
		userID := c.FormValue("userID")
		if db.CheckValidActiveUserID(userID) {
			// check the websocket connection
			if utils.CheckConnectionStillActive(userID) {
				return utils.SendConflictMessage(c, "Username taken")
			}
		} else if db.CheckValidInactiveUserID(userID) {
			if db.GetUserID(name) != userID {
				return utils.SendConflictMessage(c, "Username taken")
			}
			_ = db.ChangeInactiveUserToActive(userID)
		} else if db.CheckUserIDBanned(userID) {
			return utils.SendBanMessage(c, "You are banned as of now , Incase you are using a public network, consider switching to mobile data")
		} else if db.CheckIfUserIDExists(name, userID) {
			return utils.SendConflictMessage(c, "Wrong user ID")
		} else if db.GetUserID(name) != "" {
			userIDTemp := db.GetUserID(name)
			if channel == "public"{
				if(strings.Contains(userIDTemp, "public")){
					return utils.SendBadRequestMessage(c, "Username taken")
				}
			} else {
				pattern := regexp.MustCompile(`^[0-9]*\.?[0-9]+$`)
				if pattern.MatchString(userIDTemp) {
					return utils.SendBadRequestMessage(c, "Username taken")
				}
			}
		}
		utils.ChatUserHandler(c, name, channel, userID)
		return nil
	}
}

func ReceivedFrontendUserInfo() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		info := new(models.UserInfo)
		e := c.Bind(info)
		if e != nil {
			return utils.SendBadRequestMessage(c, "Wrongly formatted info")
		} else if info.UserID != db.GetUserID(info.Username) {
			return utils.SendBadRequestMessage(c, "Wrong user id and/or username")
		} else if !globals.IsChannelNameValid(info.Channel) {
			return utils.SendBadRequestMessage(c, "Wrong channel name")
		}
		//further processing
		utils.SendUserInfoToSlack(*info)
		return nil
	}
}

func LeaveChat() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		userID := c.FormValue("userID")
		if db.CheckValidInactiveUserID(userID) {
			_, err := c.Response().Write([]byte("Thank you for visiting MDG Chat. We wish to have you again soon"))
			return err
		} else if db.CheckValidActiveUserID(userID) {
			// close web socket in sync with the chatWS functions
			status := utils.CloseWebsocketAndCleanByUserID(userID)
			if !status {
				return c.String(500, "An internal server error has occurred") // TODO: Restore to SendBadRequestMessage after figuring out the websocket issue
			}
			_ = db.ChangeActiveUserToInactive(userID)
			_, err := c.Response().Write([]byte("Thank you for visiting MDG Chat. We wish to have you again soon"))
			return err
			// return utils.SendNormalCloseMessage(c, "Thank you for visiting MDG Chat. We wish to have you again soon")
		} else {
			return c.String(400, "Wrong user ID") // TODO: Restore to SendBadRequestMessage after figuring out the websocket issue
		}
	}
}

func Subscribe() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		type SubscribeRequest struct {
			Email     string      `json:"email"`
			Username  string      `json:"username"`
			Channel   string      `json:"channel"`
			Query     string      `json:"query"`
			Timestamp interface{} `json:"timestamp"`
		}
		var req SubscribeRequest
		if err := c.Bind(&req); err != nil {
			return c.JSON(400, map[string]string{"message": "Invalid JSON data"})
		}

		email := req.Email
		username := req.Username
		channel := req.Channel
		query := req.Query
		
		var ts string
		switch v := req.Timestamp.(type) {
		case float64:
			ts = fmt.Sprintf("%.0f", v)
		case string:
			ts = v
		default:
			ts = ""
		}

		if email == "" {
			return c.JSON(400, map[string]string{"message": "Email missing"})
		}
		if channel == "chatbot" {
			username = ""
		}
		
		if username == "" && channel != "chatbot" {
			return c.JSON(400, map[string]string{"message": "Username missing"})
		}
		if ts == "" {
			return c.JSON(400, map[string]string{"message": "Timestamp missing"})
		}
		if channel == "" || !globals.IsChannelNameValid(channel) {
			return c.JSON(400, map[string]string{"message": "Channel missing or wrong channel name"})
		}
		if !customutils.ValidateEmail(email) {
			return c.JSON(400, map[string]string{"message": "Invalid email"})
		}
		_ = db.AddUserEmailToDb(username, email)
		
		var msg string
		if username != "" {
			msg = "User " + username + " has asked for a response on his email " + email
		} else {
			msg = "A user has asked for a response on their email " + email
		}
		if query != "" {
			msg += "\n\nQuery:\n" + query
		}
		
		utils.SendMsgAsBot(globals.GetChannelID("admin"), msg, "")
		return c.JSON(200, map[string]string{"message": "Subscribed"})
	}
}

func GetProjects() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		projects , err := db.GetAllProjects()
		if(err != nil){
			return c.String(500, "Internal server error")
		}
		return c.JSON(200, projects)
	}
}
