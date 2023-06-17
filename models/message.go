package models

type Message struct {
	Text string `json:"text"`
	Sender string `json:"sender"`
	ImageUrl string `json:"url"`
	Timestamp string `json:"timestamp"`
}