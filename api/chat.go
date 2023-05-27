package api

import (
	"net/http"
	"strings"
	"time"

	"bot/api/utils"

	"github.com/labstack/echo/v4"
)

var channels = []string{"public", "private"}

func JoinChat() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		if (utils.IsUserBanned(strings.Split(c.Request().RemoteAddr, ":")[0])){
			return c.String(http.StatusForbidden, "You are banned as of now")
		}
		name := c.FormValue("name")
		channel := c.FormValue("channel")
		var validChannel bool = false
		for _, ch := range channels {
			if channel == ch {
				validChannel = true
				break
			}
		}
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
