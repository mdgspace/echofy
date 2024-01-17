package route

import (
	"bot/api"

	sentryecho "github.com/getsentry/sentry-go/echo"
	"github.com/labstack/echo/v4"
)

func Init() {
	e := echo.New()
	e.Use(sentryecho.New(sentryecho.Options{}))
	e.GET("/chat", api.JoinChat())
	e.POST("/userInfo", api.ReceivedFrontendUserInfo())
	e.POST("/chat/leave", api.LeaveChat())
	e.Start(":1323")
}
