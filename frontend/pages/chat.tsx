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
import { Message } from "../interface/interface";


export default function Home(){
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const router = useRouter();
  const {channel}=router.query as { channel?: string };;
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useLoadSetting({setSoundEnabled,setNotificationsEnabled});
  useSettings({soundEnabled,notificationsEnabled});
  useWebsocket({soundEnabled,channel,socketRef,setMessages,router,setUnreadCount})
  useLeaveChat(router);
  useVisibilityChange({setUnreadCount});

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