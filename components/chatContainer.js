import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'


export default function ChatContainer({ messages }) {
  return (
    <div className="flex justify-end">
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={` ${message.isSent ? "sent" : "received"} ${message.isSent ? "flex flex-row items-center justify-end mt-[3vh]" : "flex flex-row items-cente justify-start mt-[3vh]"}`}>
             <div className="pr-[2vw]">
                 <div className="bg-slate-400  rounded-lg flex align-items-center justify-items-center">
                           <div className="mx-[1vw]">
                           {message.text}
                           </div>
                           
                         </div>
             </div>
        <Image src={Avatar} alt="" className="ml-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
