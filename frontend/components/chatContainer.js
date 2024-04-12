// ChatContainer.js

import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'
import moment from 'moment';

export default function ChatContainer({ messages, messagesEndRef }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('hh:mm A');
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-[85vh]">
      <ul>
        {messages?.map((message, index) => (
          <li key={index} className={`flex items-start ${message.isSent ? "justify-end" : "justify-start"} mb-4 mx-6 `}>
            <div className={`relative flex font-Lato text-base ${message.isSent ? "flex-row-reverse" : ""}`}>
              <div class="flex flex-col">
              <div class={`flex flex-row gap-2 items-center ${message.isSent ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 w-12 h-12">
                <Image src={message.avatar || Avatar} width="48" height="48" alt="" className="rounded-full" />
              </div>
              <div className="text-txt-mdg-username">{message.username}</div>
              </div>
              <div class="flex flex-col">
              <div
                className={`w-[max-content] min-w-[4vw] max-w-[50vw] px-4 py-2 mx-2   ${
                  message.isSent ? "bg-customBlue text-white rounded-l-[32px] rounded-br-[32px] mr-6" : " bg-white  text-semiblack rounded-r-[32px] rounded-bl-[32px] ml-12"
                } break-words`}
              >
                <div className="py-2">{message.text}</div>
              </div>
              <div className={`text-xs text-bg-gray w-[95%] mt-2 flex ${message.isSent ? "justify-start ml-6":"justify-end"}`}>
                {formatTime(message.timestamp)}

              </div>
             
              </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div ref={messagesEndRef} /> 
    </div>
  );

  
  

  
}
