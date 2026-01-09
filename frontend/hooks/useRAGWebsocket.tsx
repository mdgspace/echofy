"use client";

import { useEffect } from "react";
import { Message } from "../interface/interface";
import { NextRouter } from "next/router";

interface Props {
  socketRef: React.MutableRefObject<WebSocket | null>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  router: NextRouter;
}

export default function useRAGWebsocket({
  socketRef,
  setMessages,
  router,
}: Props) {
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/query");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("RAG WebSocket connected");
    };

    ws.onmessage = (event) => {
      let data: any;

      try {
        data = JSON.parse(event.data);
      } catch {
        notifyAndRedirect(
          "Received invalid response from server.",
          router
        );
        ws.close();
        return;
      }

      if (data.status !== 200) {
        notifyAndRedirect(
          data.detail || "Server error occurred.",
          router
        );
        ws.close();
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          isSent: false,
          username: "Echofy",
          text: data.response,
          timestamp: Date.now(),
          userID: "bot",
        },
      ]);
    };

    ws.onerror = () => {
      notifyAndRedirect(
        "Lost connection to server.",
        router
      );
      ws.close();alert
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
        notifyAndRedirect(
          "Connection closed unexpectedly.",
          router
        );
      }
    };

    return () => {
      ws.close();
    };
  }, [router, setMessages, socketRef]);

  const pushUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        isSent: true,
        username: "You",
        text,
        timestamp: Date.now(),
        userID: "user",
      },
    ]);
  };

  return { pushUserMessage };
}

function notifyAndRedirect(message: string, router: NextRouter) {
  alert(message);
  router.push("/");
}
