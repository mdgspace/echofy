package utils

import (
	"bot/db"
	"bot/globals"
	"bot/logging"
	"bot/models"
	// "bytes"
	"encoding/json"
	"fmt"

	"github.com/slack-go/slack"
)

var Client *slack.Client

func InitClient(token, appToken string) {
	Client = slack.New(token, slack.OptionDebug(true), slack.OptionAppLevelToken(appToken))
}

func SendMsgAsBot(channelToken, msg, tstamp string) (timestamp string) {
	var ts string
	var perr error
	if tstamp != "" {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionText(msg, false),
			slack.MsgOptionTS(tstamp),
		)
	} else {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionText(msg, false),
		)
	}
	if perr != nil {
		logging.LogException(perr)
		return ""
	}
	return ts
}

func SendMsg(channelToken, msg, userName, tstamp string) (timestamp string) {
	var ts string
	var perr error
	if tstamp != "" {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionUsername(userName),
			slack.MsgOptionTS(tstamp),
			slack.MsgOptionText(msg, false),
		)
	} else {
		_, ts, perr = Client.PostMessage(
			channelToken,
			slack.MsgOptionUsername(userName),
			slack.MsgOptionText(msg, false),
		)
	}
	if perr != nil {
		fmt.Println("Exception while posting message to slack as a user: ", perr)
		logging.LogException(perr)
		panic(perr)
	}
	return ts
}

func GetSlackUserInfo(userID string) *slack.User {
	user, err := Client.GetUserInfo(userID)
	if err != nil {
		fmt.Println("Error while fetching user info: ", err)
		logging.LogException(err)
		panic(err)
	}
	return user
}

func SendUserInfoToSlack(infoObj models.UserInfo) {
	Client.PostMessage(
		globals.GetChannelID(infoObj.Channel),
		slack.MsgOptionAttachments(slack.Attachment{
			Text: fmt.Sprintf("IP: %v\nLocation: %v\nAgent: %v\nOperating System: %v\n", infoObj.IP, infoObj.Location, infoObj.Agent, infoObj.OS),
		}),
		slack.MsgOptionText("Info for user "+infoObj.Username, false))
}

// Function to delete a message
/*
Can delete only those messages which are sent by frontend clients
*/
func DeleteMsg(channelToken, tstamp, triggerID string) {
	_, _, e := Client.DeleteMessage(channelToken, tstamp)
	if e != nil {
		fmt.Println("Error while deleting message: ", e)
		logging.LogException(e)
	}
}

func ShowEmailModal(triggerID, userName, timestamp, channleId string) {
	privateMetadata, err := json.Marshal(map[string]string{"userName": userName, "timestamp": timestamp, "channelId": channleId})
	if err != nil {
		fmt.Printf("Error encoding private metadata: %v\n", err)
		return
	}
	modalRequest := slack.ModalViewRequest{
		Type:       "modal",
		CallbackID: "email response",
		Title: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "My App",
		},
		Close: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Close",
		},
		Blocks: slack.Blocks{
			BlockSet: []slack.Block{
				slack.InputBlock{
					Type:    "input",
					BlockID: "email_response",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "email_response",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter message here"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Email Response"},
				},
			},
		},
		Submit: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Submit",
		},
		PrivateMetadata: string(privateMetadata),
	}
	_, err = Client.OpenView(triggerID, modalRequest)
	if err != nil {
		fmt.Printf("Error opening view: %v\n", err)
	}
}

func ShowViewProjectModal(triggerID string) {
	projects , error := db.GetAllProjects()

	if error != nil {
		logging.LogException(error)
		return
	}
	// Group projects by category
	projectMap := make(map[models.ProjectCategory][]models.Project)
	for _, project := range projects {
		projectMap[project.Category] = append(projectMap[project.Category], project)
	}

	modalRequest := slack.ModalViewRequest{
		Type:       "modal",
		CallbackID: "project_response",
		Title: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Projects",
		},
		Close: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Close",
		},
		Blocks: slack.Blocks{
			BlockSet: generateProjectBlocks(projectMap),
		},
	}
	_, err := Client.OpenView(triggerID, modalRequest)
	if err != nil {
		fmt.Printf("Error opening view: %v\n", err)
	}
}

func generateProjectBlocks(projectMap map[models.ProjectCategory][]models.Project) []slack.Block {
	var blocks []slack.Block

	for category, projects := range projectMap {
		// Add section block for each category
		blocks = append(blocks, slack.SectionBlock{
			Type: "section",
			Text: &slack.TextBlockObject{
				Type: "mrkdwn",
				Text: fmt.Sprintf("*%s*", category), // Display category name in bold
			},
		})

		// Add project list for the category
		for _, project := range projects {
            blocks = append(blocks, slack.SectionBlock{
                Type: "section",
                Text: &slack.TextBlockObject{
                    Type: "mrkdwn",
                    Text:fmt.Sprintf(
						"*Name*: %s\n"+
						"*Short Description*: %s\n"+
						"*Long Description*: %s\n"+
						"*Image Link*: %s\n"+
						"*App Store Link*: %s\n"+
						"*GitHub Link*: %s\n"+
						"*Play Store Link*: %s",
						project.Name, 
						project.ShortDesc, 
						project.LongDesc, 
						project.ImageLink, 
						project.AppStoreLink, 
						project.GithubLink, 
						project.PlayStoreLink,
					),							
                },
            })
        }
	}

	return blocks
}

func ShowAddProjectModal(triggerID string) {
	modalRequest := slack.ModalViewRequest{
		Type:       "modal",
		CallbackID: "add_project",
		Title: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Add Project",
		},
		Close: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Close",
		},
		Blocks: slack.Blocks{
			BlockSet: []slack.Block{
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_name",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_name",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project name"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project Name"},
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_category",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_category",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project category"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project Category"},
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_short_description",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_short_description",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project short description"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project Short Description"},
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_long_description",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_long_description",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project long description"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project Long Description"},
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_image_link",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_image_link",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project image link"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project image link"},
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_app_store_link",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_app_store_link",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project app store link"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project app store link"},
					Optional: true,
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_github_link",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_github_link",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project github link"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project github link"},
					Optional: true,
				},
				slack.InputBlock{
					Type:    "input",
					BlockID: "project_play_store_link",
					Element: &slack.PlainTextInputBlockElement{
						Type:        "plain_text_input",
						ActionID:    "project_play_store_link",
						Placeholder: &slack.TextBlockObject{Type: "plain_text", Text: "Enter project play store link"},
					},
					Label: &slack.TextBlockObject{Type: "plain_text", Text: "Project play store link"},
					Optional: true,
				},
			},
		},
		//on clicking submit , call the upsert db function
		Submit: &slack.TextBlockObject{
			Type: "plain_text",
			Text: "Submit",
		},
	}
	_, err := Client.OpenView(triggerID, modalRequest)
	if err != nil {
		fmt.Printf("Error opening view: %v\n", err)
	}
}

