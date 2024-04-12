import Image from "next/image";
import ChatInputBox from "../components/chatInputBox";
import ChatContainer from "../components/chatContainer";
import arrow from "../assets/arrow.svg";
import Box from "../components/mdgBox";
import RightPane from "../components/rightPane";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  getSessionUser,
  getSessionUserId,
  handleWebSocketClose,
  handleWebSocketError,
  processWebSocketMessage,
} from "../services/utilities/utilities";
import { buildWebSocketURL } from "../services/url-builder/url-builder";
import { initializeWebSocketConnection } from "../services/api/api";
import { useRouter } from "next/navigation";
import ChatBot from "../assets/chatbot.svg"
import SlackLogo from "../assets/slack.svg"
import Modal from "../components/modal";
import LoginModal from "../components/loginModal";
export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redirect, setRedirect] = useState("");

  const openModal = (redirect) => {
    setIsModalOpen(true);
    setRedirect(redirect)
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const goToPublicChat = () => {
    openModal("public");
    // Open the modal after navigating
  };

  const goToPrivateChat = () => {
    openModal("private");

  };

  const goToChatbot = () => {
    openModal("chatbot");
  }



  return (
    <>
      <div className="main bg-white w-full bg-contain h-[98vh]">
        <div className="grid grid-cols-24 w-full mt-2 h-[98vh]">
          <div className="flex flex-col items-center col-span-7 bg-white max-md:hidden">
            <div className="flex flex-col items-center p-2 bg-white-primary rounded-xl w-[95%]">
              <Box />
            </div>
          </div>
          {isModalOpen && <LoginModal onClose={closeModal} redirect={redirect} />}

          <div className="col-span-17 flex flex-col justify-center items-center bg-light-grey max-md:col-span-24 rounded-xl mr-[1vw]">
            <div className="w-1/2">
              <div class="flex flex-col justify-center items-center ">
                <div className="flex flex-col justify-center items-center gap-6 ">
                  <div class="text-customBlue font-Lato font-medium text-5xl text-center">
                    Welcocme to Echofy
                  </div>
                  <div class="text-txt-gray font-Lato text-center font-lato font-medium text-lg">
                    We've developed this resource to address any inquiries you may have regarding the MDG Space group at IIT Roorkee, including its events and projects. You can engage with our chatbot or reach out to us directly on Slack. We're eager to assist you.
                  </div>
                </div>

              </div >
              <div className="flex flex-col justify-center items-center gap-4 mt-8">
                <div
                  className="flex items-center justify-center py-4 w-full  px-8 rounded-full bg-customBlue text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50"
                  onClick={goToChatbot}
                >
                  <p className="font-Roboto font-medium text-xl tracking-tighter flex gap-2">
                    <Image src={ChatBot}/>
                    TALK TO OUR CHATBOT
                  </p>
                </div>

                <div className="flex items-center justify-center py-4 w-full  px-8 rounded-full bg-customBlue text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50" onClick={goToPrivateChat}>
                  <p className="font-Roboto font-medium text-xl tracking-tighter flex gap-2">
                  <Image src={SlackLogo} className="text-sky-400"/>PRIVATE CHAT ON SLACK
                  </p>
                </div>
                <div className="flex items-center justify-center py-4 w-full  px-8 rounded-full bg-customBlue text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50" onClick={goToPublicChat}>
                  <p className="font-Roboto font-medium text-xl tracking-tighter flex gap-2">
                  <Image src={SlackLogo}/>PUBLIC MDG CHAT FORUM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





