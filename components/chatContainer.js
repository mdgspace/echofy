import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'


export default function ChatContainer({ messages }) {
  return (
    <div className="">
      <ul>
      {messages.map((message, index) => (
  <li key={index} className={` ${message.isSent ? "sent" : "received"} ${message.isSent ? "flex flex-row items-center justify-end py-[3vh]" : "flex flex-row items-center justify-start py-[3vh]"}`}>
    {message.isSent ? (
      <>
        <div className="pr-[1vw] w-[70%]">
          <div className="bg-white rounded-lg flex align-items-center justify-items-center py-[2vh] translate-y-[3vh] break-all">
            <div className="mx-[1vw] text-txt-grey noir-pro ">{message.text}</div>
          </div>
        </div>
        <div className="w-[6vw]">
      <Image src={Avatar} alt="" className="ml-2 max-w-full max-h-full" />
      </div>
      </>
    ) : (
      <>
      <div className="w-[6vw]">
      <Image src={Avatar} alt="" className="mr-2 max-w-full max-h-full" />
      </div>
        
        <div className="pl-[1vw] w-[70%]">
          <div className="bg-white rounded-lg flex align-items-center justify-items-center py-[2vh] translate-y-[3vh] break-all">
            <div className="mx-[1vw] text-txt-grey">{message.text}</div>
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
