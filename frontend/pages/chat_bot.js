import Image from "next/image";
import ChatInputBox from "../components/chatInputBox";
import ChatContainer from "../components/chatContainer";
import arrow from "../assets/arrow.svg";
import Box from "../components/mdgBox";
import RightPane from "../components/rightPane";
import { useState, useEffect, useRef, useCallback, use } from "react";
import {
  formatChatbotUserText,
  getIsSentForChatBot,
  getSessionUser,
  getSessionUserId,
  handleWebSocketClose,
  handleWebSocketError,
  processWebSocketMessage,
  removeSessionUserId
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
import { leaveChat } from "../services/api/leaveChatApi";
import { useRouter } from "next/router";

import { ChatbotNavbar } from "../components/chatbotNavbar";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [topic, setTopic] = useState("Appetizer");

  const router = useRouter();

  useEffect(() => {
  setTopic(router.query.topic ?? "Appetizer");
  }, [router.query]);


function openMail() {
    setIsMailOpen(true);
  }

function closeMail() {
    setIsMailOpen(false);
  }

  function updateMessages(newMessage) {
    setMessages([
      ...messages,
        JSON.stringify({text:newMessage , isSent:true})
        
    ]);
  }


  const socketRef = useRef(null);
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
      router.push("/");
    }
    const userId = getSessionUserId();
    const channel = 'chatbot';

    const topic = router.query;
    const url = buildWebSocketURL(userId, username , channel, topic.topic ?? "Appetizer");
    console.log(url)
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
      } catch (error) {
        console.log(error)
        //todo-> enable sentry logger here
      }
    });
    return () => {
      socket.close();
    };
  }, [initializeWebSocketConnection]);

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

  useEffect(()=>{
    const leaveChatOnNavigation = () => {
      leaveChat( getSessionUserId());
      console.log("----------------------------------")
      console.log("leaving chat on navaigation")
    
    }
    const handleBeforeUnload = (e) => {
      leaveChat( getSessionUserId());
      console.log("leaving chat on beforeunload")
    }

    router.events.on("RouteChangeStart" ,leaveChatOnNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      router.events.off("routeChangeStart", leaveChatOnNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    
},[router]);

  return (
    <>
      <div className="main text-slate-950 bg-white w-full h-screen bg-contain ">
        <div className="grid grid-cols-24 w-full h-screen mt-2">
          <div className="justify-between col-span-7 bg-white rounded-r-xl max-md:hidden">
            <div className="flex flex-col items-center p-2 bg-white-primary rounded-xl w-[95%]">
              <Box channel={"chatbot"} />
            </div>
            </div>
          <div className="col-span-17 flex flex-col justify-center bg-light-grey max-md:col-span-24 rounded-xl mr-[1vw]">
          <div class="flex flex-col h-screen w-full gap-4 justify-between items-center">
              <div className="w-full flex flex-row items-center justify-around">
                <ChatbotNavbar currentPage={"chatbot"} currentTopic={topic} />
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


