package customutils

import (
	"bot/logging"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"os"
)

func SendEmail(username,recieverEmail,response string) string {
	sender := mail.NewEmail(os.Getenv("SENDER_NAME"), os.Getenv("SENDER_EMAIL"))
	subject := "We have responded to your query!"
	reciever := mail.NewEmail(username, recieverEmail)
	plainTextContent := response
	htmlContent := response
	message := mail.NewSingleEmail(sender, subject, reciever, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	_, err := client.Send(message)
	if err != nil {
		logging.LogException(err)
		return "error sending mail"
	} else {
		return "mail sent successfully"
	}
}
