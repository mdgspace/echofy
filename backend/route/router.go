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
	e.GET("/projects", api.GetProjects())
	e.POST("/userInfo", api.ReceivedFrontendUserInfo())
	e.POST("/chat/leave", api.LeaveChat())
	e.POST("/subscribe", api.Subscribe())
	e.Start(":1323")
}
