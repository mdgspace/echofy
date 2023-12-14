import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'


export default function ChatContainer({ messages }) {
  return (
    <div className="">
      <ul>
      {messages.map((message, index) => (
  <li key={index} className={` ${message.isSent ? "sent" : "received"} ${message.isSent ? "flex flex-row items-center justify-end py-[3vh] max-md:py-[2vh] max-sm:py-[1vh]" : "flex flex-row items-center justify-start py-[3vh] max-md:py-[2vh] max-sm:py-[1vh]"}`}>
    {message.isSent ? (
      <>
        <div className="pr-[1vw] w-[70%] max-sm:w-[60%] flex flex-col translate-y-[3vh]">
          <div className="username justify-end text-right noir-pro max-sm:text-sm text-txt-mdg-username">{message.username}</div>
          <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white rounded-lg flex align-items-center justify-items-center py-[2vh]  break-all flex flex-col">
            <div className="mx-[1vw] text-txt-grey noir-pro max-sm:text-sm">{message.text}</div>
          </div>
        </div>
        <div className="w-[6vw] max-md:w-[10vw] max-sm:w-[15vw]">
      <Image src={Avatar} alt="" className="ml-2 max-w-[70%] max-h-full" />
      </div>
      </>
    ) : (
      <>
      <div className="w-[3vw]  max-md:w-[10vw] max-sm:w-[15vw]">
      <Image src={message.avatar || Avatar} width ="70" height="70" alt="" className="rounded-full mr-2 max-w-[100%] max-h-full" />
      </div>
        
        <div className="pl-[1vw] w-[70%] max-sm:w-[60%] flex flex-col translate-y-[3vh]">
          <div className="noir-pro max-sm:text-sm text-txt-mdg-username">{message.username}</div>
          <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white rounded-lg flex align-items-center justify-items-center py-[2vh]  break-all">
            <div className="mx-[1vw] text-txt-grey noir-pro max-sm:text-sm">{message.text}</div>
          </div>
        </div>
      </>
    )}
  </li>
))}

      </ul>
    </div>
  );
}
