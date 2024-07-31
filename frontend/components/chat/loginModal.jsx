import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getSessionUser from "../../utils/session/getSessionUser";
import getSessionUserId from "../../utils/session/getSessionUserId";
import setSessionUser from "../../utils/session/setSessionUser";
import removeSessionUserId from "../../utils/session/removeSessionUserId";
import checkAndPromptSessionChange from "../../utils/alerts/checkAndPromptSessionChange";

const LoginModal = ({ onClose, redirect }) => {
  const popupRef = useRef();
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEnterClick(event) {
    if (event.key === "Enter") {
      handleChatWithUsClick();
    }
  }

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
    const chatType = redirect;
    const currentUser = getSessionUser();
    const currentUserId = getSessionUserId();
    const query={channel:chatType};
      if (currentUser && currentUserId) {
        if (currentUser === username) {
          router.push({pathname:'/chat',query});
        } else {
          const hasChanged = await checkAndPromptSessionChange(
            currentUser,
            username,
            () => {
              removeSessionUserId();
              setSessionUser(username);
            },
          );
          if (hasChanged) {
            router.push({pathname:'/chat',query});
          }
        }
      } else {
        setSessionUser(username);
        router.push({pathname:'/chat',query});
      }
  }
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
          <div
            className="rounded-full bg-customBlue text-white text-Lato p-2 max-sm:text-xs text-center w-60 rounded-[12.5rem] text-md"
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