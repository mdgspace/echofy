// ChatContainer.js

import React from "react";
import Image from 'next/image'
import moment from 'moment';
import { useState } from "react"; 

import Avatar1 from "../assets/avatars/avatar_1.svg"
import Avatar2 from "../assets/avatars/avatar_2.svg"
import Avatar3 from "../assets/avatars/avatar_3.svg"
import Avatar4 from "../assets/avatars/avatar_4.svg"
import Avatar5 from "../assets/avatars/avatar_5.svg"
import Avatar6 from "../assets/avatars/avatar_6.svg"
import Avatar7 from "../assets/avatars/avatar_7.svg"
import Avatar8 from "../assets/avatars/avatar_8.svg"
import Avatar9 from "../assets/avatars/avatar_9.svg"
import Avatar10 from "../assets/avatars/avatar_10.svg"
import Avatar11 from "../assets/avatars/avatar_11.svg"
import Avatar12 from "../assets/avatars/avatar_12.svg"
import Avatar13 from "../assets/avatars/avatar_13.svg"
import Avatar14 from "../assets/avatars/avatar_14.svg"
import Avatar15 from "../assets/avatars/avatar_15.svg"


import {  getAvatar } from "../services/utilities/utilities";

export default function ChatContainer({ messages, messagesEndRef }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return moment(date).format('hh:mm A');
  };

  const AvatarList = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8, Avatar9, Avatar10, Avatar11, Avatar12, Avatar13, Avatar14, Avatar15] 
  const [Avatar, setAvatar] = useState(Avatar1)

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    async function loadAvatar() {
      const AvatarId = await getAvatar()
      const Avatar = AvatarList[AvatarId]
      setAvatar(Avatar)
    }
    loadAvatar();


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
