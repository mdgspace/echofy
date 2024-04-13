// ChatContainer.js

import React, { useState } from "react";
import Avatar from "../assets/avatar.svg"
import Echofy from "../assets/logo.svg"
import Image from 'next/image'
import moment from 'moment';
import { parseMessageText } from "../services/utilities/utilities";

export default function ChatContainer({ messages, messagesEndRef }) {
  const [filteredMessage, setFilteredMessage] = useState([])

  React.useEffect(() => {
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  React.useEffect(() => {
    setFilteredMessage(messages)
    console.log(filteredMessage)
  }, [messages])

  return (
    <div className="h-[85vh]">
      <ul>
        {filteredMessage?.map((message, index) => {
          message = JSON.parse(message)
          return (
            <li key={index} className={`flex items-start ${message.isSent ? "justify-end" : "justify-start"} mb-4 mx-6 `}>
            <div className={`relative flex font-Lato text-base ${message.isSent ? "flex-row-reverse" : ""}`}>
              <div class="flex flex-col">
              <div class={`flex flex-row gap-2 items-center ${message.isSent ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 w-12 h-12">
                <Image src={message.isSent? Avatar : Echofy } width="48" height="48" alt="" className="" />
              </div>
              <div className="text-txt-mdg-username">{message.username}</div>
              </div>
              <div class="flex flex-col">
              <div
                className={`w-[max-content] min-w-[4vw] max-w-[50vw] px-4 py-2 mx-2   ${
                  message.isSent ? "bg-customBlue text-white rounded-l-[32px] rounded-br-[32px] mr-6" : " bg-white  text-semiblack rounded-r-[32px] rounded-bl-[32px] ml-12"
                } break-words`}
              >
                <div className="py-2 whitespace-pre-wrap text-Lato">{message.isSent ? message.text : parseMessageText(message.text)}</div>
              </div>
              </div>
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
