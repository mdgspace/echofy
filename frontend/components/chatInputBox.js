import { useState, useEffect, useRef } from "react";
import { MdSend } from "react-icons/md"; 

export default function ChatInputBox({ updateMessages, socketRef }) {
    const [newMessage, setNewMessage] = useState("");
    const [isTimeout, setIsTimeout] = useState(false);
    const messageTimesRef = useRef([]);

    
    function handleInputChange(event) {
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

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            handleSendClick();
        }
    }

    const checkForTimeout = () => {
        const now = Date.now();
        messageTimesRef.current = messageTimesRef.current.filter(t => now - t < 3000);

        if (messageTimesRef.current.length >= 3) {
            setIsTimeout(true);
            setTimeout(() => {
                setIsTimeout(false);
                messageTimesRef.current = [];
            }, 5000);
        }
    };


    return (
        <div className="flex justify-center items-center h-full">
            <div className="relative w-3/4 bg-transparent">
                <input
                    type="text"
                    placeholder={isTimeout? "Timed out for 5 seconds" : "Enter your message..."}
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    disabled={isTimeout}
                    className="w-full p-3 pr-10 border rounded-lg placeholder-gray-400"
                />
                <button
                    onClick={handleSendClick}
                    disabled={isTimeout}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isTimeout ? 'bg-gray-500' : 'bg-orange-500'} text-white rounded-full p-2`}
                >
                    <MdSend className={`w-6 h-6 ${isTimeout ? 'text-gray-300' : 'text-white'}`} />
                </button>
            </div>
        </div>
    );
}
