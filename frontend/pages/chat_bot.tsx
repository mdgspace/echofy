"use client";

import ChatInputBox from "../components/chat/chatInputBox";
import ChatContainer from "../components/chat/chatContainer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Navbar } from "../components/navbar";
import Mail from "../components/mail";
import jinoraLogo from "../assets/logo.svg";
import useLoadSetting from "../hooks/useLoadSettings";
import useSettings from "../hooks/useSettings";
import useLeaveChat from "../hooks/useLeaveChat";
import useVisibilityChange from "../hooks/useVisibilityChange";
import useRAGWebsocket from "../hooks/useRAGWebsocket";
import { Message } from "../interface/interface";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [isMailOpen, setIsMailOpen] = useState<boolean>(false);

  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useLoadSetting({ setSoundEnabled, setNotificationsEnabled });
  useSettings({ soundEnabled, notificationsEnabled });
  useLeaveChat(router);
  useVisibilityChange({ setUnreadCount });

  const { pushUserMessage } = useRAGWebsocket({
    socketRef,
    setMessages,
    router,
  });

  const handleRetry = (index: number) => {
    let lastUserMessage = "";
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].isSent) {
        lastUserMessage = messages[i].text;
        break;
      }
    }
    
    if (lastUserMessage && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ prompt: lastUserMessage }));
    } else {
      console.error("WebSocket is not connected or no previous user message.");
    }
  };

  useEffect(() => {
    if (unreadCount > 0 && notificationsEnabled) {
      document.title = `(${unreadCount}) New Messages - MDGSpace Chat`;
    } else {
      document.title = "MDGSpace Chat";
    }
  }, [unreadCount, notificationsEnabled]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="main text-slate-950 bg-white w-full bg-contain">
      <div className="grid grid-cols-24 w-full h-[98vh] mt-2">
        <div className="col-span-24 flex flex-col justify-center bg-light-grey rounded-xl">
          <div className="flex flex-col h-[98vh] w-full gap-4 justify-between items-center">
            <div className="w-full flex flex-row items-center justify-around">
              <Navbar 
                label="ECHOFY CHAT BOT" 
                logo={jinoraLogo} 
                showMailButton={true} 
                onMailClick={() => setIsMailOpen(true)} 
              />
            </div>

            <div className="pb-[1vh] max-sm:pb-[3vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%]">
              <ChatContainer
                messages={messages}
                messagesEndRef={messagesEndRef}
                onRetry={handleRetry}
              />
            </div>

            <div className="w-full">
              <ChatInputBox socketRef={socketRef} onSend={pushUserMessage} />
            </div>
          </div>
        </div>
      </div>
      {isMailOpen && <Mail onClose={() => setIsMailOpen(false)} channel={"chatbot"} />}
    </div>
  );
}
