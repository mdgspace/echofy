package api

import (
	"net/http"
	"strings"
	"time"

	"bot/api/utils"
	"bot/db"
	"bot/globals"
	"bot/models"

	"github.com/labstack/echo/v4"
)

func JoinChat() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		if (utils.IsUserBanned(strings.Split(c.Request().RemoteAddr, ":")[0])){
			return c.String(http.StatusForbidden, "You are banned as of now")
		}
		name := c.FormValue("name")
		channel := c.FormValue("channel")
		validChannel := globals.IsChannelNameValid(channel)
		if name == "" || !validChannel {
			return c.String(http.StatusBadRequest, "Name and/or channel missing")
		}
		userID := c.FormValue("userID")
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
		if (e != nil){
			return c.String(http.StatusBadRequest, "Wrongly formatted info")
		} else if (info.UserID != db.GetUserID(info.Username)){
			return c.String(http.StatusBadRequest, "Wrong user id and/or username")
		} else if (info.Channel != "public" && info.Channel != "private"){
			return c.String(http.StatusBadRequest, "Wrong channel name")
		}
		//further processing
		utils.SendUserInfoToSlack(*info)
		return nil
	}
}

func LeaveChat() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		userID := c.FormValue("userID")
		if (db.CheckValidUserID(userID)){
			// close web socket in sync with the chatWS functions
			status := utils.CloseWebsocketAndCleanByUserID(userID)
			if (!status) {
				return c.String(http.StatusInternalServerError, "An internal server error has occurred")
			}
			return c.String(http.StatusOK, "Thank you for visiting MDG Chat. We wish to have you again soon");
		} else { 
			return c.String(http.StatusBadRequest, "Wrong user ID")
		}
	}
}