import { MutableRefObject, useEffect, useRef} from "react";
import getSessionUser from "../utils/session/getSessionUser";
import getSessionUserId from "../utils/session/getSessionUserId";
import handleWebSocketClose from "../utils/websocket/handleWebSocketClose";
import { handleWebSocketError } from "../utils/websocket/handleWebSocketError";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";
import playSound from "../utils/playSound";
import { Message } from "../interface/interface"
import { NextRouter } from "next/router";

interface UseWebSocketProps {
  soundEnabled: boolean,
  channel: string,
  socketRef: MutableRefObject<WebSocket | null>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  router: NextRouter,
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>
}

const useWebsocket=({
  soundEnabled,
  channel,
  socketRef,
  setMessages,
  router,
  setUnreadCount,
}: UseWebSocketProps)=>{
    // Use a ref so the message handler closure always sees the latest soundEnabled
    // without needing to re-create the WebSocket connection
    const soundEnabledRef = useRef(soundEnabled);
    useEffect(() => {
      soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    useEffect(() => {
        const username = getSessionUser();
        if (!username || username === "null" || username === "undefined") {
          router.push("/");
        }
        const userId = getSessionUserId();
        const url = buildWebSocketURL(userId, username, channel);
        const handleOpen = () => {
        };

        // Single consolidated message handler — no duplicate addEventListener
        const handleMessage = (event: MessageEvent) => {
          try {
            let data: Record<string, unknown> = {};
            if (
              event.data !== "Message send successful" &&
              event.data !== "Welcome to MDG Chat!"
            ) {
              data = JSON.parse(event.data);
            }
            const allMessages: Message[] = [];
            const addMessages = (messageData: Record<string, string>, isSent: boolean) => {
              for (const timestamp in messageData) {
                const messageObj = JSON.parse(messageData[timestamp]);
                allMessages.push({
                  text: messageObj.text,
                  isSent: isSent,
                  username: messageObj.sender,
                  timestamp: parseFloat(timestamp),
                  avatar: messageObj.url,
                  userID: messageObj.userID || "",
                });
              }
            };
            let hasBulkMessages = false;
            if (data["Sent by others"]) {
              addMessages(data["Sent by others"] as Record<string, string>, false);
              hasBulkMessages = true;
            }
            if (data["Sent by you"]) {
              addMessages(data["Sent by you"] as Record<string, string>, true);
              hasBulkMessages = true;
            }
            if (hasBulkMessages) {
              allMessages.sort((a, b) => a.timestamp - b.timestamp);
              setMessages(allMessages);
            } else {
              const msg = data as { text?: string; sender?: string; timestamp?: string; url?: string; userID?: string };
              if (msg.userID && !msg.text) {
                sessionStorage.setItem("userID", msg.userID);
              } else if (msg.text && msg.sender && msg.timestamp) {
                const isSent = msg.sender === username;
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    text: msg.text,
                    isSent: isSent,
                    username: msg.sender,
                    timestamp: parseFloat(msg.timestamp),
                    avatar: msg.url,
                    userID: msg.userID,
                  },
                ]);
                // Use ref so we read the latest soundEnabled without recreating the socket
                if (soundEnabledRef.current) playSound(isSent);
                if (document.hidden) setUnreadCount((prevCount) => prevCount + 1);
              }
            }
          } catch (error) {
            //todo-> enable sentry logger here
          }
        };

        const handleClose = (event: CloseEvent) => {
          console.log("[WS] Close event — code:", event.code, "reason:", event.reason, "wasClean:", event.wasClean);
          handleWebSocketClose(event, () => router.push("/"));
        };
        const handleError = (event: Event) => {
          console.error("[WS] Error event:", event);
          handleWebSocketError(event);
        };
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

        return () => {
          socket.close();
        };
      // Empty dependency array: socket is created ONCE on mount.
      // soundEnabled changes are tracked via soundEnabledRef, not by recreating the socket.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
}
export default useWebsocket;