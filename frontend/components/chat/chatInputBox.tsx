import React, { useState, useRef } from "react";
import sendLogo from "../../assets/send.svg";
import Image from "next/image";
import { ChatInputBoxProps } from "../../interface/interface";


const ChatInputBox: React.FC<ChatInputBoxProps> = ({ socketRef }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);
  const messageTimesRef = useRef<number[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSendClick = () => {
    if (isTimeout) return;

    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(newMessage);
      setNewMessage("");
      messageTimesRef.current.push(Date.now());
      checkForTimeout();
    } else {
      // Handle websocket not connected (e.g., alert, redirect)
      console.error("WebSocket is not connected.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  const checkForTimeout = () => {
    const now = Date.now();
    messageTimesRef.current = messageTimesRef.current.filter(
      (t) => now - t < 3000
    );

    if (messageTimesRef.current.length >= 3) {
      setIsTimeout(true);
      setTimeout(() => {
        setIsTimeout(false);
        messageTimesRef.current = [];
      }, 5000); // Timeout for 5 seconds
    }
  };

  return (
    <div className="flex justify-center items-center h-full px-5 py-6 border-none">
      <div className="relative w-full bg-transparent mx-1 border-none">
        <input
          type="text"
          placeholder={
            isTimeout ? "Timed out for 5 seconds" : "New Message"
          }
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={isTimeout}
          className="w-full p-3 pl-10 border-none rounded-lg placeholder-customBlue font-medium text-customBlue text-Lato"
        />

        <button
          onClick={handleSendClick}
          disabled={isTimeout}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 pr-5 ${
            isTimeout ? "" : "bg-blue-500"
          } text-white rounded-full p-2 cursor-pointer`}
        >
          <Image
            src={sendLogo}
            alt="sendButton"
            className={`w-6 h-6 hover:cursor-pointer hover:text-colour-900 ${
              isTimeout ? "text-gray-100" : "text-white"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;
