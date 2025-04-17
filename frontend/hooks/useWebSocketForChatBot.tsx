import { useEffect } from "react";
import formatChatbotUserText from "../utils/chatbot_formatting/formatChatbotUserText";
import getIsSentForChatBot from "../utils/chatbot_formatting/getIsSentForChatBot";
import getSessionUser from "../utils/session/getSessionUser";
import getSessionUserId from "../utils/session/getSessionUserId";
import handleWebSocketClose from "../utils/websocket/handleWebSocketClose";
import { handleWebSocketError } from "../utils/websocket/handleWebSocketError";
import processWebSocketMessage from "../utils/websocket/processWebSocketMessage";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";
import { useWebsocketForChatbotProps } from "../interface/interface";

const useWebsocketForChatbot=({socketRef,setMessages,router}:useWebsocketForChatbotProps)=>{
    useEffect(() => {
        const username = getSessionUser();
        if (!username || username === "null" || username === "undefined") {
          router.push("/");
        }
        const userId = getSessionUserId();
    
        const channel = "chatbot";
    
        const topic = router.query;
        const url = buildWebSocketURL(
          userId,
          username,
          channel,
          topic.topic ?? "Appetizer",
        );
    
        const handleOpen = () => {
          //todo-> toast connected to server
        };
        const handleMessage = (event) =>
          processWebSocketMessage({event, setMessages, navigateToLogin:() => router.push("/"), isChatbot:true});
        const handleClose = (event) =>
          handleWebSocketClose(event, () => router.push("/"));
        const handleError = handleWebSocketError;
        const socket = initializeWebSocketConnection(
          url,
          {
          handleOpen,
          handleMessage,
          handleClose,
          handleError,
          }
        );
        socketRef.current = socket;
    
        socket.addEventListener("message", (event) => {
          try {
            const username = getSessionUser();
            let data = event.data;
            const isSent = getIsSentForChatBot(event.data);
            const allMessages = [];
            var jsonResponse = JSON.stringify({
              text: isSent ? formatChatbotUserText(data) : data,
              isSent: isSent,
              username: isSent ? username : "Echofy",
            });
            allMessages.push({
              text: data,
              isSent: getIsSentForChatBot(event.data),
            });
            setMessages((prevMessages) => [...prevMessages, jsonResponse]);
          } catch (error) {
            //todo-> enable sentry logger here
          }
        });
        return () => {
          socket.close();
        };
      }, [initializeWebSocketConnection]);
}
export default useWebsocketForChatbot;