import { useState, useRef } from "react";
import sendLogo from "../../assets/send.svg";
import Image from "next/image";

interface ChatInputBoxProps {
  socketRef: React.MutableRefObject<WebSocket | null>;
}

export default function ChatInputBox({ socketRef }:ChatInputBoxProps) {
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const messageTimesRef = useRef<number[]>([]);

  function handleInputChange(event:any) {
    setNewMessage(event.target.value);  
  }

  function handleSendClick() {
    if (isTimeout) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(newMessage);
      setNewMessage("");
      messageTimesRef.current.push(Date.now());
      checkForTimeout();
    } else {
      //todo : add an alert in case of websocket is not connected, redirect user to login screen
    }
  }

  function handleKeyPress(event: any) {
    if (event.key === "Enter") {
      handleSendClick();
    }
  }

  const checkForTimeout = () => {
    const now = Date.now();
    messageTimesRef.current = messageTimesRef.current.filter(
      (t) => now - t < 3000,
    );

    if (messageTimesRef.current.length >= 3) {
      setIsTimeout(true);
      setTimeout(() => {
        setIsTimeout(false);
        messageTimesRef.current = [];
      }, 5000);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-full px-5 py-6 border-none">
        <div className="relative w-full bg-transparent  mx-1 border-none">
          <input
            type="text"
            placeholder={isTimeout ? "Timed out for 5 seconds" : "New Message"}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isTimeout}
            className="w-full p-3 pl-10 border-none rounded-lg placeholder-customBlue font-medium text-customBlue text-Lato"
          />
           <div
          onClick={handleSendClick}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 pr-5 ${
            isTimeout ? "" : "bg-blue-500"
          } text-white rounded-full p-2 cursor-pointer`}
        >
            <Image
              src={sendLogo}
              alt="sendButton"
              className={`w-6 h-6 hover:cursor-pointer hover:text-colour-900 ${isTimeout ? "text-gray-100" : "text-white"}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}