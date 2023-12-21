import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'
import moment from 'moment';




export default function ChatContainer({ messages , messagesEndRef }) {
  
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
  <li key={index} className={` ${message.isSent ? "sent" : "received"} ${message.isSent ? "flex flex-row items-center justify-end py-[3vh] max-md:py-[2vh] max-sm:py-[1vh]" : "flex flex-row items-center justify-start py-[3vh] max-md:py-[2vh] max-sm:py-[1vh]"}`}>
    {message.isSent ? (
      <>
        <div className="pr-[1vw] w-[70%] max-sm:w-[60%] flex flex-col translate-y-[3vh]">
          <div className="username justify-end text-right noir-pro max-sm:text-sm text-txt-mdg-username">{message.username}</div>
          <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white rounded-lg flex align-items-center justify-items-center py-[2vh]  break-all flex flex-col">
            <div className="mx-[1vw] text-txt-grey noir-pro max-sm:text-sm">{message.text}</div>
            <div className="text-right absolute bottom-5 right-2 text-xs text-gray-500 pr-[1vw] pb-1 h-[0]">{formatTime(message.timestamp)}</div>
          </div>
        </div>
        <div className="w-[6vw] max-md:w-[10vw] max-sm:w-[15vw]">
      <Image src={Avatar} width ="80" height="80" alt="" className="ml-2 max-sm:w-[10vw] max-w-[5 0%] max-h-full" />
      </div>
      </>
    ) : (
      <>
      <div className="w-[3vw]  max-md:w-[10vw] max-sm:w-[15vw]">
      <Image src={message.avatar || Avatar} width ="70" height="70" alt="" className="rounded-full mr-2 max-sm:w-[10vw] max-w-[100%] max-h-full" />
      </div>
        
        <div className="pl-[1vw] w-[70%] max-sm:w-[60%] flex flex-col translate-y-[3vh]">
          <div className="noir-pro max-sm:text-sm text-txt-mdg-username">{message.username}</div>
          <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white rounded-lg flex align-items-center justify-items-center py-[2vh]  break-all">
            <div className="mx-[1vw] text-txt-grey noir-pro max-sm:text-sm">{message.text}</div>
            <div className="text-right absolute bottom-5 right-2 text-xs text-gray-500 pb-1 h-[0]">{formatTime(message.timestamp)}</div>
          </div>
        </div>
      </>
    )}
  </li>
))}

      </ul>
      <div ref={messagesEndRef} /> 
    </div>
  );
}
