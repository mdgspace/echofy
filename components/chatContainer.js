import React from "react";

export default function ChatContainer({ messages }) {
  return (
    <div className="row-span-10 bg-slate-300">
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={message.isSent ? "sent" : "received"}>
            {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
