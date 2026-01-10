import { MutableRefObject, useEffect } from "react";
import getSessionUser from "../utils/session/getSessionUser";
import getSessionUserId from "../utils/session/getSessionUserId";
import handleWebSocketClose from "../utils/websocket/handleWebSocketClose";
import { handleWebSocketError } from "../utils/websocket/handleWebSocketError";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";
import playSound from "../utils/playSound";
import { Message } from "../interface/interface";
import { NextRouter } from "next/router";

interface UseWebSocketProps {
  soundEnabled: boolean;
  channel: string;
  socketRef: MutableRefObject<WebSocket | null>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  router: NextRouter;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const useWebsocket = ({
  soundEnabled,
  channel,
  socketRef,
  setMessages,
  router,
  setUnreadCount,
}: UseWebSocketProps) => {
  useEffect(() => {
    const username = getSessionUser();
    if (!username || username === "null" || username === "undefined") {
      router.push("/");
      return;
    }

    const userId = getSessionUserId();
    const url = buildWebSocketURL(userId, username, channel);

    const handleOpen = () => {
      console.log("WebSocket connected to:", url);
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        // Skip welcome messages
        if (
          event.data === "Message send successful" ||
          event.data === "Welcome to MDG Chat!"
        ) {
          return;
        }

        const data = JSON.parse(event.data);
        const allMessages: Message[] = [];

        const addMessages = (messageData: any, isSent: boolean) => {
          for (const timestamp in messageData) {
            const messageObj = JSON.parse(messageData[timestamp]);
            allMessages.push({
              text: messageObj.text,
              isSent: isSent,
              username: messageObj.sender,
              timestamp: parseFloat(timestamp),
              avatar: messageObj.url,
              userID: messageObj.userID,
            });
          }
        };

        let hasBulkMessages = false;

        // Handle bulk messages (initial load)
        if (data["Sent by others"]) {
          addMessages(data["Sent by others"], false);
          hasBulkMessages = true;
        }
        if (data["Sent by you"]) {
          addMessages(data["Sent by you"], true);
          hasBulkMessages = true;
        }

        if (hasBulkMessages) {
          allMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(allMessages);
        } else if (data.text && data.sender && data.timestamp) {
          // Handle single new message
          const isSent = data.sender === username;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: data.text,
              isSent: isSent,
              username: data.sender,
              timestamp: parseFloat(data.timestamp),
              avatar: data.url,
              userID: data.userID,
            },
          ]);

          if (soundEnabled) playSound(isSent);
          if (document.hidden) setUnreadCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        // TODO: enable sentry logger here
      }
    };

    const handleClose = (event: CloseEvent) => {
      console.log("WebSocket closed:", event.code, event.reason);
      handleWebSocketClose(event, () => router.push("/"));
    };

    const handleError = (event: Event) => {
      console.error("WebSocket error:", event);
      handleWebSocketError(event);
    };

    const socket = initializeWebSocketConnection(url, {
      handleOpen,
      handleMessage,
      handleClose,
      handleError,
    });

    socketRef.current = socket;

    return () => {
      console.log("Cleaning up WebSocket connection");
      socket.close();
    };
  }, [channel, soundEnabled, setMessages, setUnreadCount, router, socketRef]);
};

export default useWebsocket;

