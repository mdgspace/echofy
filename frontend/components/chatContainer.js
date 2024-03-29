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
    <div className="">
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={`flex items-start ${message.isSent ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`relative flex ${message.isSent ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 w-12 h-12">
                <Image src={message.avatar || Avatar} width="48" height="48" alt="" className="rounded-full" />
              </div>
              <div
                className={`bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-sm:w-[60vw] max-md:w-[50vw] max-lg:w-[40vw] max-2xl:w-[40vw] 2xl:max-w-[40vw] 2xl:min-w-[5vw] px-4 py-2 m-2 ${
                  message.isSent ? "order-1" : "order-2"
                } break-words`}
              >
                <div className="text-txt-mdg-username">{message.username}</div>
                <div className="text-txt-grey pt-2">{message.text}</div>
                <div className={`text-xs text-gray-500 ${message.isSent ? "text-right" : "text-right"} mt-2`}>{formatTime(message.timestamp)}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div ref={messagesEndRef} /> 
    </div>
  );
}
