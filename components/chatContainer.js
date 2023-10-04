import React from "react";
import Avatar from "../assets/avatar.svg"
import Image from 'next/image'


export default function ChatContainer({ messages }) {
  return (
    <div className="flex justify-end">
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={` ${message.isSent ? "sent" : "received"} ${"flex flex-row justify-items-center align-items-center"}`}>
            {message.text} <Image src={Avatar} alt=""></Image>
          </li>
        ))}
      </ul>
    </div>
  );
}
