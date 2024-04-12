// ChatContainer.js

import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'
import moment from 'moment';

export default function ChatbotContainer({ messages, messagesEndRef }) {
  console.log(1,messages);
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('hh:mm A');
  };

  var filteredMessages = messages.slice(1);
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-[85vh] p-4" >
      <ul className = "space-y-4 " >
        {filteredMessages?.map((message, index) => {
            const parsedMessage = JSON.parse(message);
            // console.log(2,parsedMessage);
            // console.log(parsedMessage.isSent)
            return(
                <li key={index} className={`flex items-start ${message.isSent ? "justify-end" : "justify-start"} mb-4 mx-6 `}>
            <div className={`relative flex ${parsedMessage.isSent ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 w-12 h-12">
                <Image src={message.avatar || Avatar} width="48" height="48" alt="" className="rounded-full" />
              </div>
              <div
                className={`rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[max-content] max-w-[60vw] px-4 py-2 m-2 ${
                  parsedMessage.isSent ? "bg-customBlue text-white " : " bg-gray-100 text-gray-800 "
                } break-words`}
              >
             <div className="text-txt-mdg-username">{message.username}</div>
                <div className="text-txt-grey pt-2">{parsedMessage.text}</div>
                <div className={`text-xs ${message.isSent == true ? "text-white" : "text-black"} mt-2`}></div>
              </div>
            </div>
          </li>

            )
          
})}
      </ul>
      <div ref={messagesEndRef} /> 
    </div>
  );
  

  
}
