import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getSessionUser from "../../utils/session/getSessionUser";
import getSessionUserId from "../../utils/session/getSessionUserId";
import setSessionUser from "../../utils/session/setSessionUser";
import setSessionUserId from "../../utils/session/setSessionUserId";
import removeSessionUserId from "../../utils/session/removeSessionUserId";
import checkAndPromptSessionChange from "../../utils/alerts/checkAndPromptSessionChange";
import { toast } from "react-toastify";
import { LoginModalProps } from "../../interface/interface";

const LoginModal: React.FC<LoginModalProps> = ({ onClose, redirect }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEnterClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChatWithUsClick();
    }
  };

  const generateUserId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleChatWithUsClick = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username.");
      return;
    }

    const chatType = redirect;
    const currentUser = getSessionUser();
    let currentUserId = getSessionUserId();
    const queryParams = new URLSearchParams({ channel: chatType });

    if (currentUser && currentUserId) {
      if (currentUser === username) {
        setTimeout(() => {
          router.push(`/chat?${queryParams.toString()}`);
        }, 0);
      } else {
        const hasChanged = await checkAndPromptSessionChange({
          currentUser: currentUser,
          username: username,
          onConfirm: () => {
            removeSessionUserId();
            setSessionUser(username);
            const newUserId = generateUserId();
            setSessionUserId(newUserId);
          },
        });
        if (hasChanged) {
          setTimeout(() => {
            router.push(`/chat?${queryParams.toString()}`);
          }, 0);
        }
      }
    } else {
      setSessionUser(username);
      const newUserId = generateUserId();
      setSessionUserId(newUserId);
      
      console.log("Session set - Username:", username, "UserID:", newUserId);
      
      setTimeout(() => {
        router.push(`/chat?${queryParams.toString()}`);
      }, 0);
    }
  };

  const closeModal = () => {
    onClose();
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
              ref={inputRef}
              type="text"
              placeholder="Username"
              className="w-full rounded-md text-[#49454F] text-center text-Lato placeholder-[#49454F] text-sm"
              value={username}
              onChange={handleUsernameChange}
              onKeyDown={handleEnterClick}
            />
          </div>
          <div
            className="rounded-full bg-customBlue text-white text-Lato p-2 max-sm:text-xs text-center w-60 text-md cursor-pointer hover:opacity-90"
            onClick={handleChatWithUsClick}
          >
            CHAT WITH US
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;