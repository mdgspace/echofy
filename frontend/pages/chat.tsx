"use client";
import ChatInputBox from "../components/chat/chatInputBox";
import ChatContainer from "../components/chat/chatContainer";
import Box from "../components/mdgBox";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Navbar } from "../components/navbar";
import useLoadSetting from "../hooks/useLoadSettings";
import useSettings from "../hooks/useSettings";
import useWebsocket from "../hooks/useWebsocket";
import useLeaveChat from "../hooks/useLeaveChat";
import useVisibilityChange from "../hooks/useVisibilityChange";
interface Message {
  text: string;
  sender: 'user' | 'chatbot';
  timestamp?: Date;
  isSent?: boolean;  // Optional for messages not yet sent
  username?: string; // Optional if not all messages have usernames
  // ... other properties as needed (e.g., message ID, attachments)
}
interface UseLoadSettingHook {
  (setSoundEnabled: (enabled: boolean) => void, setNotificationsEnabled: (enabled: boolean) => void): void;
}

interface UseSettingsHook {
  (soundEnabled: boolean, notificationsEnabled: boolean): void;
}

interface UseWebsocketHook {
  (
    soundEnabled: boolean,
    channel: string,
    socketRef: React.MutableRefObject<WebSocket | null>, 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    router: typeof useRouter,
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>
  ): void;
}

interface UseVisibilityChangeHook {
  (setUnreadCount: React.Dispatch<React.SetStateAction<number>>): void;
}

interface UseLeaveChatHook {
  (router: typeof useRouter, socketRef: React.MutableRefObject<WebSocket | null>): void;
}

// For ChatbotContainer (from a previous response)
interface ChatbotContainerProps {
  messages: Message[];
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
}

// For ChatInputBox (implied)
interface ChatInputBoxProps {
  socketRef: React.MutableRefObject<WebSocket | null>;
}

// For Box (implied)
interface BoxProps {
  channel: string;
}

// For Navbar (implied)
interface NavbarProps {
  currentPage: string;
  currentTopic?: string; 
}

export default function Home(){
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter()
  const {channel}=router.query;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useLoadSetting(setSoundEnabled,setNotificationsEnabled);
  useSettings(soundEnabled,notificationsEnabled);
  useWebsocket(soundEnabled,channel,socketRef,setMessages,router,setUnreadCount)
  useLeaveChat(router);
  useVisibilityChange(setUnreadCount);

  useEffect(() => {}, [messages]);

  useEffect(() => {
    if (unreadCount > 0 && notificationsEnabled) {
      document.title = `(${unreadCount}) New Messages - MDGSpace Chat`;
    } else {
      document.title = "MDGSpace Chat";
    }
  }, [unreadCount]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
    {(channel=="public")?(
      <div className="main text-slate-950 bg-white w-full bg-contain">
        <div className="grid grid-cols-24 w-full h-[98vh] mt-2">
          <div className="flex flex-col items-center col-span-7 bg-white max-md:hidden">
            <div className="flex flex-col items-center p-2 bg-white-primary rounded-xl w-[95%]">
              <Box channel={channel} />
            </div>
          </div>
          <div className="col-span-17 flex flex-col justify-center bg-light-grey max-md:col-span-24 rounded-xl mr-[1vw]">
            <div className="flex flex-col h-[98vh] w-full gap-4 justify-between items-center">
              <div className="w-full flex flex-row items-center justify-around">
                <Navbar currentPage={channel} currentTopic={''} />
              </div>
              <div className="pb-[1vh] max-sm:pb-[3vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%]">
                <ChatContainer
                  messages={messages}
                  messagesEndRef={messagesEndRef}
                />
              </div>
              <div className="w-full">
                <ChatInputBox
                  socketRef={socketRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
):(channel=="private")?(
<div className="main text-slate-950 bg- w-full h-screen bg-contain">
  <div className="grid grid-cols-24 w-full h-[98vh] mt-2">
    <div className="justify-between flex flex-col items-center col-span-7 bg-white max-md:hidden">
      <div className="flex flex-col items-center p-2 bg-white-primary rounded-xl w-[95%]">
        <Box channel={channel} />
      </div>
    </div>
    <div className="col-span-17 flex flex-col justify-center bg-light-grey max-md:col-span-24 rounded-xl mr-[1vw]">
      <div className="flex flex-col h-[98vh] w-full gap-4 justify-between items-center">
        <div className="w-full flex flex-row items-center justify-around">
          <Navbar currentPage={channel} currentTopic={''}/>
        </div>
        <div className="pb-[1vh] max-sm:pb-[3vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%]">
          <ChatContainer
            messages={messages}
            messagesEndRef={messagesEndRef}
          />
        </div>
        <div className="w-full">
          <ChatInputBox
            socketRef={socketRef}
          />
        </div>
      </div>
    </div>
  </div>
</div>):(<div></div>)}
    </>
  );
}