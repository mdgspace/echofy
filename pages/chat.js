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
// import boxData from "../services/utilities/box-data";

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
    const handleOpen = () => console.log("Connected to WebSocket server");
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
        console.error("Error parsing or handling the message:", error);
        console.log(event.data);
      }
    });
    return () => {
      socket.close();
    };
  }, [initializeWebSocketConnection , soundEnabled]);

  useEffect(() => {
    console.log("Messages updated:", messages);
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
    <div className="main text-slate-950 bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
      <div className="grid grid-cols-24 w-full h-screen">
        <div className="col-span-2 bg-bg-orange rounded-r-xl max-md:hidden">
          <a 
          className="p-2 text-white pl-[1vw]  lg:text-2xl text-[2vw] noir-pro hover:no-underline  hover:cursor-pointer transition duration-300"
          href="https://mdgspace.org/"
          target="_blank"
          rel="noopener noreferrer" 
          >
            .mdg
          </a>
          <div className="pt-[5vh] w-full flex flex-col align-center justify-items-center  ">
          
        <Box />
   
          </div>
        </div>
        <div className="col-span-21 mx-[3vw] bg-transparent max-md:col-span-23">
          <div className="flex flex-col h-screen">
            <div className="flex flex-row h-[10vh] noir-pro-bold justify-between">
              <div className="flex flex-row">
                <div className="flex flex-col justify-end">
                  <div 
                  className="hover:shadow-[0px_0px_20px_-15px_rgba(0,0,0,1)] hover:cursor-pointer bg-bg-orange rounded-lg text-white flex flex-col justify-end mx-[1vw] p-2 w-full"
                  onClick={handleQueriesClick}>
                    <center className="lg:text-2xl">Queries</center>
                  </div>
                </div>
                {/* <div className="flex flex-col justify-end max-md:hidden">
                  <div className="flex flex-row ml-8 lg:mb-2">
                    <div className="lg:text-2xl">Templates</div>
                    <div className="mt-[1vh] ">
                      <Image
                        src={arrow}
                        alt=""
                        className="scale-[2.0] ml-[1vw] hover:cursor-pointer"
                      ></Image>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="flex flex-row">
                <a className="hover:cursor-pointer text-right flex flex-col justify-end text-bg-orange lg:text-2xl hover:no-underline hover:text-orange-600 transition duration-300 "
                href="https://bit.ly/mdgspace-slack-invite"
                target="_blank"
                >
                  Join Slack
                </a>
              </div>
            </div>
            <div className="h-[70vh] pb-[1vh] max-sm:pb-[3vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%]">
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
        <div className="col-span-1 max-md:hidden max-sm:hidden">
          <RightPane 
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}/>
        </div>
      </div>
    </div>
  );
}
