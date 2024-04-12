import Image from "next/image";
import ChatInputBox from "../components/chatInputBox";
import ChatContainer from "../components/chatContainer";
import arrow from "../assets/arrow.svg";
import Box from "../components/mdgBox";
import RightPane from "../components/rightPane";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  formatChatbotUserText,
  getIsSentForChatBot,
  getSessionUser,
  getSessionUserId,
  handleWebSocketClose,
  handleWebSocketError,
  processWebSocketMessage,
} from "../services/utilities/utilities";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";

import notif from "../assets/sounds/notif.mp3";
import notifRecieve from "../assets/sounds/notif-recieve.mp3";
import { AiFillAccountBook } from "react-icons/ai";
import { AiFillCamera } from "react-icons/ai";
// import boxData from "../services/utilities/box-data";
import { BsStarFill } from "react-icons/bs";
import slack from ".././assets/slack.svg";
import mail from ".././assets/mail.svg";
import logo from "../assets/logo.svg";
import Mail from "../components/mail";
import ChatbotContainer from "../components/chatbotContainer";
import { useRouter } from "next/router";
import { ChatNavbar } from "../components/chatNavbar";


export default function Home() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMailOpen, setIsMailOpen] = useState(false);

  const router = useRouter();
  const {topic} = router.query;
  const  newTopic = {topic}
  const socketTopic = newTopic.topic??"Appetizer";


  function openMail() {
    setIsMailOpen(true);
  }

function closeMail() {
    setIsMailOpen(false);
    console.log(isMailOpen)
  }

  function updateMessages(newMessage) {
    console.log("-------------------------------")
    setMessages([
      ...messages,
        JSON.stringify({text:newMessage , isSent:true})
        
    ]);
    console.log( JSON.stringify({text:newMessage , isSent:true}))
    console.log("----------------------------------")
  }


  const socketRef = useRef(null);topic
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Access localStorage only when in the browser environment
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedNotificationsEnabled = localStorage.getItem('notificationsEnabled');

    // If we have settings saved, update our state
    if (savedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
    if (savedNotificationsEnabled !== null) {
      setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage when soundEnabled changes
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    // Save to localStorage when notificationsEnabled changes
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // ... the rest of your component

  const playSound = useCallback((isSent) => {
    const sound = isSent ? new Audio(notif) : new Audio(notifRecieve);
    sound.play();
  }, [soundEnabled]); 


  useEffect(() => {
    const username = getSessionUser();
    if (!username || username === "null" || username === "undefined") {
      router.push("/login");
    }
    const userId = getSessionUserId();
    console.log(userId)
    console.log(username);
    const channel = 'chatbot';

    const url = buildWebSocketURL(userId, username , channel, socketTopic);
    console.log(url);
    const handleOpen = () => {
      //todo-> toast connected to server
    }
    const handleMessage = (event) =>
      processWebSocketMessage(event, setMessages, () => router.push("/") , true);
    const handleClose = (event) =>
      handleWebSocketClose(event, () => router.push("/"));
    const handleError = handleWebSocketError;
    const socket = initializeWebSocketConnection(
      url,
      handleOpen,
      handleMessage,
      handleClose,
      handleError
    );
    socketRef.current = socket;
    

     

    socket.addEventListener("message", (event) => {
      try {
        const username = getSessionUser()
        let data = event.data;
        const isSent = getIsSentForChatBot(event.data)
        const allMessages = [];
        var jsonResponse = JSON.stringify({ text: isSent? formatChatbotUserText(data) : data, isSent: isSent , username : isSent? username : "Echofy"})
        allMessages.push({ text: data, isSent: getIsSentForChatBot(event.data) });
        setMessages((prevMessages) => [...prevMessages, jsonResponse]);
        



        // const addMessages = (messageData, isSent) => {
        //   for (const timestamp in messageData) {
        //     const messageObj = JSON.parse(messageData[timestamp]);
        //     allMessages.push({
        //       text: messageObj.text,
        //       isSent: isSent,
        //       username: messageObj.sender,
        //       timestamp: parseFloat(timestamp),
        //       avatar: messageObj.url,
        //     });
        //   }
        // };
        // let hasBulkMessages = false;
        // if (data["Sent by others"]) {
        //   addMessages(data["Sent by others"], false);
        //   hasBulkMessages = true;
        // }
        // if (data["Sent by you"]) {
        //   addMessages(data["Sent by you"], true);
        //   hasBulkMessages = true;
        // }
        // if (hasBulkMessages) {
        //   allMessages.sort((a, b) => a.timestamp - b.timestamp);
        //   setMessages(allMessages);
        // } else {
        //   if (data.text && data.sender && data.timestamp) {
        //     let isSent = data.sender === username;
        //     setMessages((prevMessages) => [
        //       ...prevMessages,
        //       {
        //         // text: data.text,
        //         // isSent: isSent,
        //         // username: data.sender,
        //         // timestamp: parseFloat(data.timestamp),
        //         // avatar: data.url,
        //         messageObj
        //       },
        //     ]);
        //     if(soundEnabled) playSound(isSent);
        //     if (document.hidden) setUnreadCount((prevCount) => prevCount + 1);
        //   }
        // }
      } catch (error) {
        console.log(error)
        //todo-> enable sentry logger here
      }
    });
    return () => {
      socket.close();
    };
  }, [initializeWebSocketConnection , soundEnabled]);

  useEffect(() => {
    
  }, [messages]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setUnreadCount(0);
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

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

  const handleQueriesClick = () => { 
    // write logic to display faq popup
  }

  const handleChatWithMDGClick = () => {
    router.push("/chat");
    localStorage.setItem("chatType", "public");
  }

  return (
    <>
      <div className="main text-slate-950 bg-white w-full h-screen bg-contain ">
        <div className="grid grid-cols-24 w-full h-screen mt-2">
          <div className="justify-between col-span-7 bg-white rounded-r-xl max-md:hidden">
            <div className="flex flex-col items-center p-2 bg-white-primary rounded-xl w-[95%]">
              <Box />
            </div>
            </div>
          <div className="col-span-17 flex flex-col justify-center bg-light-grey max-md:col-span-24 rounded-xl mr-[1vw]">
          <div class="flex flex-col h-screen w-full gap-4 justify-around items-center">
              <div className="w-full flex flex-row items-center justify-around">
                <ChatNavbar currentPage={"chatbot"} />
              </div>
            <div className="pb-[1vh] max-sm:pb-[3vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%]" >
              <ChatbotContainer
                messages={messages}
                messagesEndRef={messagesEndRef}
              />
            </div>
            <div className="w-full">
              <ChatInputBox
                updateMessages={updateMessages}
                socketRef={socketRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
    </>
  );
}
