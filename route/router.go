package route

import (
	"bot/api"
	
	"github.com/labstack/echo/v4"
)

func Init() {
	e := echo.New()
	e.GET("/chat", api.JoinChat())
	e.POST("/userInfo", api.ReceivedFrontendUserInfo())
	e.Start(":1323")
}