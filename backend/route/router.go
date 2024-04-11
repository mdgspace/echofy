package route

import (
	"bot/api"

	sentryecho "github.com/getsentry/sentry-go/echo"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Init() {
	e := echo.New()
	e.Use(sentryecho.New(sentryecho.Options{}))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000" , "https://mdgspace.org"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Content-Type"},
	}))
	e.GET("/chat", api.JoinChat())
	e.GET("/projects", api.GetProjects())
	e.POST("/userInfo", api.ReceivedFrontendUserInfo())
	e.POST("/chat/leave", api.LeaveChat())
	e.POST("/subscribe", api.Subscribe())
	e.Start(":1323")
}
