# /backend
Made in GoLang using Echo micro framework

## Project Structure
```bash
backend/
├── api/             # API request handling
|   └──chat.go       # Handlers for specific routes                     
|   └──utils/        # Helpers for request handling
|      ├──chatWS.go  # utilities specific to websocket connections
|      └──slack.go   # using the Slack-Go SDK
├── customUtils/     # General purpose helpers for data types
├── db/              # Interacting with database
├── globals/         # Data and methods used frequently in the code
├── listeners/       # Listen to and act on basis of Slack Workspace users' actions 
|  ├── slackAdmin.go # methods for handling some slash commands
|  └── slackChat.go  # listen to events happening on Slack in public and admin channels
├── models/          # Custom structs
├── profanity_utils/ # Profanity filter
├── route/           # Contains API Router 
├── Dockerfile       # Backend specific dockerfile             
├── go.mod                          
├── go.sum
├── main.go          # <3 of the app
├── README.md        # Backend specific documentation
```

