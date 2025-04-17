import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getSessionUser from "../../utils/session/getSessionUser";
import getSessionUserId from "../../utils/session/getSessionUserId";
import setSessionUser from "../../utils/session/setSessionUser";
import removeSessionUserId from "../../utils/session/removeSessionUserId";
import checkAndPromptSessionChange from "../../utils/alerts/checkAndPromptSessionChange";
import { TopicDropdown } from "../topicDropdown";

interface ChatBotLoginModalProps {
  onClose: () => void;
  redirect;
}

interface DropdownProps {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  login?: boolean;
}

const ChatBotLoginModal: React.FC<ChatBotLoginModalProps> = ({ onClose , redirect}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState<string>("");
  const [topic, setTopic] = useState<string>("SELECT A TOPIC");
  const router = useRouter();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEnterClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChatWithUsClick();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChatWithUsClick = async () => {
    const currentUser = getSessionUser();
    const currentUserId = getSessionUserId();
    
    if (currentUser && currentUserId) {
      if (currentUser === username) {
        router.push(`/chat_bot?topic=${encodeURIComponent(topic)}`);
      } else {
        const hasChanged = await checkAndPromptSessionChange({
          currentUser,
          username,
          onConfirm: () => {
            removeSessionUserId();
            setSessionUser(username);
          },
        });
        if (hasChanged) {
          router.push(`/chat_bot?topic=${encodeURIComponent(topic)}`);
        }
      }
    } else {
      setSessionUser(username);
      router.push(`/chat_bot?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-bg-gray flex justify-center items-center backdrop-blur">
      <div
        ref={popupRef}
        className="p-6 rounded-xl shadow-2xl text-Lato relative w-96 h-96 bg-light-grey flex flex-col justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="w-60 text-center text-md">
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
          <TopicDropdown topic={topic} setTopic={setTopic} login={true} />
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
