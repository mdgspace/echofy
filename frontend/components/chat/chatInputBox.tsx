import React, { useState } from "react";
import sendLogo from "../../assets/send.svg";
import Image from "next/image";
import { ChatInputBoxProps } from "../../interface/interface";

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ socketRef, onSend }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSendClick = () => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      onSend?.(newMessage); 
      socket.send(newMessage);
      setNewMessage("");
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  return (
    <div className="flex justify-center items-center h-full px-5 py-6 border-none">
      <div className="relative w-full bg-transparent mx-1 border-none">
        <input
          type="text"
          placeholder="New Message"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="w-full p-3 pl-10 border-none rounded-lg placeholder-customBlue font-medium text-customBlue text-Lato"
        />

        <button
          onClick={handleSendClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 pr-5 bg-blue-500 text-white rounded-full p-2 cursor-pointer"
        >
          <Image
            src={sendLogo}
            alt="sendButton"
            className="w-6 h-6 hover:cursor-pointer hover:text-colour-900 text-white"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;
