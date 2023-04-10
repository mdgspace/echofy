package api

import (
	"net/http"
	"time"

	"bot/api/utils"
	
	"github.com/labstack/echo/v4"
)

var channels = []string{"public", "private"}

func JoinChat() echo.HandlerFunc {
	return func(c echo.Context) (err error) {
		name := c.FormValue("name")
		channel := c.FormValue("channel")
		var validChannel bool = false
		for _, ch := range channels {
			print(ch)
			if channel == ch {
				validChannel = true
				break
			}
		}
		if name == "" || !validChannel {
			return c.String(http.StatusBadRequest, "Name and/or channel missing")
		}
		if channel != "private" {
			go utils.PublicChatsHandler(c, c.FormValue("name"), channel) //this is done like this because there will be many public chat rooms in future
		}
		if channel == "private" {
			go utils.PrivateChatsHandler(c, c.FormValue("name"))
		}
		time.Sleep(time.Second)
		return nil
	}
}
