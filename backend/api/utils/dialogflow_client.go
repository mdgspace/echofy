package utils

import (
	"context"
	"fmt"
	"strings"

	dialogflow "cloud.google.com/go/dialogflow/apiv2beta1"
	"cloud.google.com/go/dialogflow/apiv2beta1/dialogflowpb"
)

var gcpProjectID string

// string to dialogflow session client map
var sessionClients = make(map[string]*dialogflow.SessionsClient)

// Topic name to dialogflow knowledge base name
// Format: projects/<project-id>/knowledgeBases/<knowledge-base-id>
var knowledgeBaseDisplayNameToActualName = make(map[string]string)

func getKnowledgeBases() error {
	ctx := context.Background()
	getKnowledgeBaseRequest := dialogflowpb.ListKnowledgeBasesRequest{Parent: fmt.Sprintf("projects/%s/locations/global", gcpProjectID)}
	kb, err := dialogflow.NewKnowledgeBasesClient(ctx)
	if err != nil {
		return fmt.Errorf("error creating dialogflow knowledge base client: %v", err)
	}
	defer kb.Close()
	kbList := kb.ListKnowledgeBases(ctx, &getKnowledgeBaseRequest)
	for {
		kb, err := kbList.Next()
		if err != nil {
			if err.Error() == "no more items in iterator" {
				break
			}
			return fmt.Errorf("error iterating through knowledge bases: %v", err)
		}
		knowLedgeBaseID := strings.Split(kb.GetName(), "/")[5]
		knowledgeBaseDisplayNameToActualName[kb.DisplayName] = fmt.Sprintf("projects/%s/knowledgeBases/%s\n", gcpProjectID, knowLedgeBaseID)
	}
	return nil
}
func InitDialogflowConfig(projectID string) {
	gcpProjectID = projectID
	getKnowledgeBases()
}

// initiate a new session client by providing a session id
// it is the caller's duty to close this session client
func InitNewSessionClient(sessionID string) (sesID string, err error) {
	ctx := context.Background()
	sessionClient, err := dialogflow.NewSessionsClient(ctx)
	if err != nil {
		return "", fmt.Errorf("error creating dialogflow session client: %v", err)
	}
	sessionClients[sessionID] = sessionClient
	return sessionID, nil
}

// terminate an active session
func CloseSessionClient(sessionID string) (sesID string, err error) {
	if sessionClient, ok := sessionClients[sessionID]; ok {
		sessionClient.Close()
		delete(sessionClients, sessionID)
		return sessionID, nil
	}
	return "", fmt.Errorf("session client not found for session id: %s", sessionID)
}

// send a text query to dialogflow, retrieve response using knowledge connectors
func SendTextQuery(sessionID, query, topic string) (answer string, err error) {
	sessionClient, ok := sessionClients[sessionID]
	if !ok {
		return "Looks like you asked something outside my knowledge. Please proceed to Slack chat for further help", fmt.Errorf("bad session id: %s", sessionID)
	}
	knowledgeBaseName, ok := knowledgeBaseDisplayNameToActualName[topic]
	if !ok {
		return "", fmt.Errorf("bad topic: %s", topic)
	}
	ctx := context.Background()
	sessionPath := fmt.Sprintf("projects/%s/agent/sessions/%s", gcpProjectID, sessionID)
	textInput := dialogflowpb.TextInput{Text: query, LanguageCode: "en"}
	queryTextInput := dialogflowpb.QueryInput_Text{Text: &textInput}
	queryInput := dialogflowpb.QueryInput{Input: &queryTextInput}
	queryParams := dialogflowpb.QueryParameters{KnowledgeBaseNames: []string{knowledgeBaseName}}
	request := dialogflowpb.DetectIntentRequest{Session: sessionPath, QueryInput: &queryInput, QueryParams: &queryParams}
	responseMsg, err := sessionClient.DetectIntent(ctx, &request)
	if err != nil {
		return "", fmt.Errorf("error sending query to dialogflow: %v", err)
	}
	queryResult := responseMsg.GetQueryResult()
	if queryResult.GetKnowledgeAnswers() != nil {
		answers := queryResult.GetKnowledgeAnswers().GetAnswers()
		// possible enhancements:
		// 1. if there are multiple answers, return all of them
		// 2. put a minimum confidence threshold and/or pass confidence score to the caller
		return answers[0].GetAnswer(), nil
	}
	return "", nil
}
