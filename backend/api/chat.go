package api

import (
	"strings"
	"time"

	"bot/api/utils"
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
			utils.SendMsgAsBot(globals.GetChannelID(channel), "A user tried to enter chat with a profane username: "+name+"" , "")
			return utils.SendBadRequestMessage(c, "Username is profane")
		}
		userID := c.FormValue("userID")
		if db.CheckValidActiveUserID(userID) {
			// check the websocket connection
			if utils.CheckConnectionStillActive(userID) {
				return utils.SendConflictMessage(c, "Username taken");
			}
		} else if db.CheckValidInactiveUserID(userID) {
			if db.GetUserID(name) != userID {
				return utils.SendConflictMessage(c, "Username taken");
			}
		} else if db.CheckUserIDBanned(userID) {
			return utils.SendBanMessage(c, "You are banned as of now , Incase you are using a public network, consider switching to mobile data")
		} else if db.CheckIfUserIDExists(name, userID) {
			return utils.SendConflictMessage(c, "Wrong user ID");
		} else if db.GetUserID(name) != "" {
			return utils.SendConflictMessage(c, "Username taken");
		}
		if channel != "private" {
			go utils.PublicChatsHandler(c, c.FormValue("name"), channel, userID) //this is done like this because there will be many public chat rooms in future
		}
		if channel == "private" {
			go utils.PrivateChatsHandler(c, c.FormValue("name"), userID)
		}
		time.Sleep(time.Second)
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
		if db.CheckValidUserID(userID) {
			// close web socket in sync with the chatWS functions
			status := utils.CloseWebsocketAndCleanByUserID(userID)
			if !status {
				return utils.SendInternalServerErrorCloseMessage(c, "An internal server error has occurred")
			}
			db.ChangeActiveUserToInactive(userID)
			return utils.SendNormalCloseMessage(c, "Thank you for visiting MDG Chat. We wish to have you again soon")
		} else {
			return utils.SendBadRequestMessage(c, "Wrong user ID")
		}
	}
}
