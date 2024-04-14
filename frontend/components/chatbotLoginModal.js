import React, { useEffect, useRef , useState } from "react";
import { useRouter } from "next/navigation";
import {
    getSessionUser,
    getSessionUserId,
    setSessionUser,
    removeSessionUserId,
    checkAndPromptSessionChange,
  } from "../services/utilities/utilities";
import { TopicDropdownForLogin } from "./topicDropdownforLogin";

const ChatBotLoginModal = ({ onClose  }) => {
  const popupRef = useRef();
  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("SELECT A TOPIC");
  const router = useRouter();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEnterClick(event) {
    if (event.key === "Enter") {
      handleChatWithUsClick();
    }
  }

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef, onClose]);


  async function handleChatWithUsClick() {
    const currentUser = getSessionUser();
    const currentUserId = getSessionUserId();
      if (currentUser && currentUserId) {
        if (currentUser === username) {
          router.push(`/chat_bot?topic=${encodeURIComponent(topic)}`);
        } else {
          const hasChanged = await checkAndPromptSessionChange(
            currentUser,
            username,
            () => {
              removeSessionUserId();
              setSessionUser(username);
            }
          );
          if (hasChanged) {
            router.push(`/chat_bot?topic=${encodeURIComponent(topic)}`);
          }
        }
      } else {
        setSessionUser(username);
        router.push(`/chat_bot?topic=${encodeURIComponent(topic)}`);
      }
    
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-bg-gray flex justify-center items-center backdrop-blur">
        <div ref={popupRef} className="p-6 rounded-xl shadow-2xl text-Lato relative w-96 h-96 bg-light-grey flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center items-center gap-8">
            <div class="w-60 text-center text-md">
            Pick your username and login

            </div>
      
      <div className="rounded-xl text-[#49454F] w-60 flex justify-center items-center">
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-md text-[#49454F] text-center text-Lato placeholder-[#49454F] text-sm"
              value={username}
              onChange={handleUsernameChange}
              onKeyDown={handleEnterClick}
            />
      </div>

      <TopicDropdownForLogin topic={topic} setTopic={setTopic} />

          
            <div
              className="rounded-full bg-customBlue text-white text-Lato p-2 max-sm:text-xs text-center w-60 rounded-[12.5rem] text-md"
              onClick={handleChatWithUsClick}
            >
              START ASKING
            </div>  
        </div>
     
          </div>
          </div>
  );
};

export default ChatBotLoginModal;