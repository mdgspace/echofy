import Image from "next/image";
import ChatInputBox from "../components/chatInputBox";
import ChatContainer from "../components/chatContainer";
import arrow from "../assets/arrow.svg";
import Box from "../components/mdgBox";
import RightPane from "../components/rightPane";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  getSessionUser,
  getSessionUserId,
  handleWebSocketClose,
  handleWebSocketError,
  processWebSocketMessage,
} from "../services/utilities/utilities";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";
import { useRouter } from "next/navigation";
import notif from "../assets/sounds/notif.mp3";
import notifRecieve from "../assets/sounds/notif-recieve.mp3";
import { AiFillAccountBook } from "react-icons/ai";
import { AiFillCamera } from "react-icons/ai";
// import boxData from "../services/utilities/box-data";
import { BsStarFill } from "react-icons/bs";


export default function Home() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const router = useRouter();

  function updateMessages(newMessage, username) {
    setMessages([
      ...messages,
      { text: newMessage, isSent: true, username: username },
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
      router.push("/login");
    }
    const userId = getSessionUserId();
    const url = buildWebSocketURL(userId, username);
    const handleOpen = () => {
      //todo-> toast connected to server
    }
    const handleMessage = (event) =>
      processWebSocketMessage(event, setMessages, () => router.push("/login"));
    const handleClose = (event) =>
      handleWebSocketClose(event, () => router.push("/login"));
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
        let data = "";
        if (
          event.data != "Messsage send successful" &&
          event.data != "Welcome to MDG Chat!"
        ) {
          data = JSON.parse(event.data);
        }
        const allMessages = [];
        const addMessages = (messageData, isSent) => {
          for (const timestamp in messageData) {
            const messageObj = JSON.parse(messageData[timestamp]);
            allMessages.push({
              text: messageObj.text,
              isSent: isSent,
              username: messageObj.sender,
              timestamp: parseFloat(timestamp),
              avatar: messageObj.url,
            });
          }
        };
        let hasBulkMessages = false;
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
        } else {
          if (data.text && data.sender && data.timestamp) {
            let isSent = data.sender === username;
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: data.text,
                isSent: isSent,
                username: data.sender,
                timestamp: parseFloat(data.timestamp),
                avatar: data.url,
              },
            ]);
            if(soundEnabled) playSound(isSent);
            if (document.hidden) setUnreadCount((prevCount) => prevCount + 1);
          }
        }
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

  return (
    <>

    <div>

    </div>
    
    <div className="main text-slate-950 bg- w-full h-screen bg-contain">

      <div className="grid grid-cols-24 w-full h-screen">

        <div className="justify-between col-span-7 bg-bg-orange rounded-r-xl max-md:hidden">
          <div className="flex flex-col items-center gap-4 p-5 w-562 h-1000 bg-white rounded-xl">
            <Box />
          </div>
        </div>


        <div className="col-span-17 mx-[3vw] bg-gray-100 max-md:col-span-24" mt-10>
          <div className="flex flex-col h-screen">
          <div class="flex h-14 p-3 justify-between items-center flex-shrink-0 self-stretch rounded-xl bg-white  mx-2 my-10 ">
    <div class="text-blue-500 font-roboto font-semibold text-lg leading-7">
      Jinora Chat Bot</div>
    <div className =  "flex flex-row items-center justify-between px-4">
    <div className="text-gray-600 font-lato text-base font-normal leading- mx-5" >Chat with mdg members</div>
    <div>
         <AiFillAccountBook size={24} className="text-gray-600 mr-10"/>
    </div>
    <div className="text-gray-600 font-lato text-base font-normal leading-7 mr-6">
      Request A mail reply

    </div>
    <div>
      <AiFillCamera size={24} className="text-gray-600 ml -10" />
    </div>
    </div>
    
  </div>
            <div className="h-[100vh] pb-[1vh] max-sm:pb-[3vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%] bg-gray-100" >
              <ChatContainer
                messages={messages}
                messagesEndRef={messagesEndRef}
              />
            </div>
            <div className="h-[20vh]">
              <ChatInputBox
                updateMessages={updateMessages}
                socketRef={socketRef}
              />
            </div>
          </div>
        </div>
        {/*<div className="col-span-1 max-md:hidden max-sm:hidden">
          <RightPane
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
        </div>*/}
      
      </div>
    </div>
    </>
  );
}
