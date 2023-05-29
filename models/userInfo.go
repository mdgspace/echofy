package models

type UserInfo struct {
	UserID string `json:"userID" form:"userID"`
	Username string `json:"name" form:"name"`
	IP string `json:"ip" form:"ip"`
	Location string `json:"location" form:"location"`
	OS string `json:"os" form:"os"`
	Agent string `json:"agent" form:"agent"`
	Channel string `json:"chatChannel" form:"chatChannel"`
}