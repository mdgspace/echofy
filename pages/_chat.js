import Image from "next/image";
import ChatInputBox from "../components/chatInputBox";
import ChatContainer from "../components/chatContainer";
import arrow from "../assets/arrow.svg";
import Box from "../components/mdgBox";
import RightPane from "../components/rightPane";

import { io } from "socket.io-client";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]); 

  // Create a function to update messages in the Home component
  function updateMessages(newMessage, username) {
    setMessages([
      ...messages,
      { text: newMessage, isSent: true, username: username },
    ]);
  }

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userID");
    let socket = "";
    if (userId) {
      socket = new WebSocket(
        `ws://127.0.0.1:1323/chat?userID=${userId}&name=${username}&channel=public`
      );
    } else {
      socket = new WebSocket(
        `ws://127.0.0.1:1323/chat?name=${username}&channel=public`
      );
    }

    socket.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
    });

    socket.addEventListener("message", (event) => {
      console.log("Received message:", event.data);

      try {
        const data = JSON.parse(event.data);

        if (data["Sent by others"]) {
          const allMessages = [];
          for (const timestamp in data["Sent by others"]) {
            const messageObj = JSON.parse(data["Sent by others"][timestamp]);
            allMessages.push({
              text: messageObj.text,
              isSent: false,
              username: messageObj.sender,
              timestamp: parseFloat(timestamp),
            });
          }
          allMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(allMessages);
        } else {
          let isSent = data.sender === username;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: data.text,
              isSent: isSent,
              username: data.sender,
              timestamp: parseFloat(data.timestamp),
            },
          ]);
        }
      } catch (error) {
        console.error("Error parsing or handling the message:", error);
      }
    });

    // socket.on('chat message', (msg) => {
    //     console.log('Received message:', msg);
    //     // Handle the incoming message as needed
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="main text-slate-950 bg-[url('../assets/bg.svg')] bg-auto w-full h-screen bg-contain">
      <div className="grid grid-cols-24 w-full h-screen">
        <div className="col-span-2 bg-bg-orange rounded-r-xl max-md:hidden">
          <div className="p-2 text-white outfit lg:text-2xl text-[2vw]">
            .mdg
          </div>
          <div className="pt-[5vh] w-full flex flex-col align-center justify-items-center">
            {Array(5)
              .fill()
              .map((_, index) => (
                <Box key={index} />
              ))}
          </div>
        </div>
        <div className="col-span-21 mx-[3vw] bg-transparent max-md:col-span-23">
          <div className="flex flex-col h-screen">
            <div className="flex flex-row h-[10vh] noir-pro-bold justify-between">
              <div className="flex flex-row">
                <div className="flex flex-col justify-end">
                  <div className="hover:shadow-[0px_0px_20px_-15px_rgba(0,0,0,1)] hover:cursor-pointer bg-bg-orange rounded-lg text-white flex flex-col justify-end mx-[1vw] p-2 w-full">
                    <center className="lg:text-2xl">Queries</center>
                  </div>
                </div>
                <div className="flex flex-col justify-end max-md:hidden">
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
                </div>
              </div>
              <div className="flex flex-row">
                <div className="hover:cursor-pointer text-right flex flex-col justify-end text-bg-orange lg:text-2xl">
                  Join Slack
                </div>
              </div>
            </div>
            <div className="h-[70vh] overflow-y-auto noir-pro w-[100%] max-sm:w-[105%] max-md:w-[106%]">
              <ChatContainer messages={messages} />
            </div>
            <div className="h-[20vh]">
              <ChatInputBox updateMessages={updateMessages} />
            </div>
          </div>
        </div>
        <div className="col-span-1 max-md:hidden max-sm:hidden">
          <RightPane />
        </div>
      </div>
    </div>
  );
}
