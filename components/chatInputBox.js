import { useState } from "react";

export default function ChatInputBox({ updateMessages }) {
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState("zcross.mdg"); //take username from backend and after login

    function handleInputChange(event) {
        setNewMessage(event.target.value);
    }

    function handleSendClick() {
        updateMessages(newMessage , username , true);
        setNewMessage("");
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
          handleSendClick();
        }
      }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="relative w-3/4 bg-transparent">
                <input
                    type="text"
                    placeholder="Enter your message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="w-full p-3 pr-10 border rounded-lg placeholder-gray-400"
                />
                <button
                    onClick={handleSendClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3.293 4.293a1 1 0 011.414 0L10 10.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}