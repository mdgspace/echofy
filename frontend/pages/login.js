import Image from "next/image";
import bg from "../assets/bg.svg";
// import { get, set } from './session-store';
import {BsStarFill} from "react-icons/bs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSessionUser,
  getSessionUserId,
  setSessionUser,
  removeSessionUserId,
  checkAndPromptSessionChange,
} from "../services/utilities/utilities";

import {useHistory} from "react-router-dom";

/**export const UserContext = React.createContext()
 */
export default function login() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEnterClick(event) {
    if (event.key === "Enter") {
      handleChatWithUsClick();
    }
  }

  function handleFAQsClick() {
    setUsername("");
    console.log("Login cancelled.");
  }

  async function handleChatWithUsClick() {
    const chatType = localStorage.getItem("chatType");
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
    <div className="flex flex-col justify-between items-center bg-[url('../assets/bg.svg')] bg-cover w-full h-screen">
      <div className="flex flex-col justify-center flex-grow text-center max-sm:w-[80vw] max-md:w-[70vw] max-lg:w-[60vw] max-xl:w-[50vw] 2xl:w-[25vw]">
        <div className="opacity-80 shadow-xl backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl noir-pro-bold text-orange-600 mb-4">
            LOGIN
          </h1>
          <p className="text-orange-600 text-opacity-60 noir-pro text-sm sm:text-base md:text-lg mb-4">
            .mdg
          </p>

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
              className="rounded-xl bg-white py-3 px-6 text-orange-600 noir-pro-small font-medium max-sm:text-xs"
              onClick={handleChatWithUsClick}
            >
              Chat with Us
            </button>
            <button
              className="rounded-xl bg-orange-600 py-3 px-6 text-white font-medium max-sm:text-xs"
              onClick={handleFAQsClick}
            >
              FAQs
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full justify-between px-2">
        <div className="flex flex-row gap-2 mt-5">
          <div className="text-center font-medium noir-pro text-base sm:text-xl">
            Made with ❤️ by
          </div>
          <a
            href="https://mdgspace.org"
            target="_blank"
            rel="noopener noreferrer"
            className="noir-pro-bold text-base sm:text-xl text-orange-600"
          >
            MDGSpace
          </a>
        </div>
        <div className="mt-5 flex flex-row gap-2">
          <div>
            <a
              href="https://github.com/mdgspace/Echofy"
              target="_blank"
              rel="noopener noreferrer"
              className="noir-pro-bold text-xl text-yellow-400"
            >
              <BsStarFill />
            </a>
          </div>
          <div className="hidden sm:block noir-pro">Echofy on Github</div>
        </div>
      </div>
    </div>
  );
}
