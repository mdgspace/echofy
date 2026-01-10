"use client";

import { useEffect, useRef } from "react";
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
  const hasErroredRef = useRef(false);

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    console.log(WS_URL)

    if (!WS_URL) {
      notifyAndRedirect("WebSocket URL is not configured.", router);
      return;
    }

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("RAG WebSocket connected");
    };

    ws.onmessage = (event) => {
      if (hasErroredRef.current) return;

      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        handleFatalError("Invalid response from server.");
        return;
      }

      if (data.status !== 200) {
        handleFatalError(data.detail || "Server error occurred.");
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
      handleFatalError("Lost connection to server.");
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
        handleFatalError("Connection closed unexpectedly.");
      }
    };

    function handleFatalError(message: string) {
      if (hasErroredRef.current) return;
      hasErroredRef.current = true;
      ws.close();
      notifyAndRedirect(message, router);
    }

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
  router.replace("/");
}
