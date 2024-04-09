import React, { useEffect, useRef , useState } from "react";
import { useRouter } from "next/navigation";
import {
    getSessionUser,
    getSessionUserId,
    setSessionUser,
    removeSessionUserId,
    checkAndPromptSessionChange,
  } from "../services/utilities/utilities";

const LoginModal = ({ onClose  , redirect }) => {
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
    console.log(redirect);
    const chatType = redirect;
    const currentUser = getSessionUser();
    const currentUserId = getSessionUserId();
    console.log(chatType);
    if(chatType == "public"){
      if (currentUser && currentUserId) {
        if (currentUser === username) {
          router.push("/chat");
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
            router.push("/chat");
          }
        }
      } else {
        setSessionUser(username);
        router.push("/chat");
      }
    }
    else if(chatType == "private"){
      if (currentUser && currentUserId) {
        if (currentUser === username) {
          router.push("/private_chat");
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
            router.push("/private_chat");
          }
        }
      } else {
        setSessionUser(username);
        router.push("/private_chat");
      }
    }

    else if(chatType == "chatbot"){
      if (currentUser && currentUserId) {
        if (currentUser === username) {
          router.push("/chat_bot");
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
            router.push("/chat_bot");
          }
        }
      } else {
        setSessionUser(username);
        router.push("/chat_bot");
      }

    }
    
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center backdrop-blur">
      <div ref={popupRef} className="p-6 rounded-2xl shadow-2xl relative w-96 h-96 bg-bg-grey bg-opacity-40">
        Pick your username and login
      
      <div className="shadow-md rounded-md my-4 mx-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-md text-gray-700"
              value={username}
              onChange={handleUsernameChange}
              onKeyDown={handleEnterClick}
            />
          </div>

          <div className="flex flex-row sm:flex-row justify-center items-center gap-4 mt-6 ">
            <button
              className="rounded-xl bg-customBlue py-3 px-6 text-white  noir-pro-small font-medium max-sm:text-xs"
              onClick={handleChatWithUsClick}
            >
              Chat with Us
            </button>
          </div>
          </div>
    </div>
  );
};

export default LoginModal;
