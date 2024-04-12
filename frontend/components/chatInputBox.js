import { useState, useEffect, useRef } from "react";
import { MdSend } from "react-icons/md"; 
import { FaPlus } from "react-icons/fa";
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
            console.log("message sent");
            console.log(newMessage)
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
        <>
        
         <div className="flex justify-center items-center h-full px-5" >
            <div className="relative w-full bg-transparent  mx-1">
                {/* to be done after attachment support is added */}
                {/* <div className="">
                    <FaPlus className="absolute left-2 top-1/2 transform -translate-y-1/2 text--500" />
                </div> */}
                <input
                    type="text"
                    placeholder={isTimeout? "Timed out for 5 seconds" : "New Message"}
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    disabled={isTimeout}
                    className="w-full p-3 pl-10 border rounded-lg placeholder-customBlue text-customBlue"
                />
                <button
                    onClick={handleSendClick}
                    disabled={isTimeout}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 pr-5${isTimeout ? '' : 'bg--500'} text-white rounded-full p-2`}
                >
                    <MdSend className={`w-6 h-6 ${isTimeout ? 'text-gray-100' : 'text-white'}`} />
                </button>
            </div>
        </div>
        </>
       
    );
}
