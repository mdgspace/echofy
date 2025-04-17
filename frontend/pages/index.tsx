import Image from "next/image";
import Box from "../components/mdgBox";
import { useState } from "react";
import ChatBot from "../assets/chatbot.svg";
import SlackLogo from "../assets/slack.svg";
import LoginModal from "../components/chat/loginModal";
import ChatBotLoginModal from "../components/chatbot/chatbotLoginModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isChatBotModalOpen, setISChatBotModalOpen] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<string>("");

  const openModal = (redirect:string) => {
    setIsModalOpen(true);
    setRedirect(redirect);
  };

  const openChatBotModal = () => {
    setISChatBotModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeChatBotLoginModal = () => {
    setISChatBotModalOpen(false);
  };

  const goToPublicChat = () => {
    openModal("public");
  };

  const goToPrivateChat = () => {
    openModal("private");
  };

  const goToChatbot = () => {
    openChatBotModal();
  };
  return (
    <>
      <div className="main bg-white w-full bg-contain">
        <div className="grid grid-cols-24 w-full mt-2 h-[95vh]">
          <div className="flex flex-col items-center col-span-7 bg-white max-md:hidden">
            <div className="flex flex-col items-center p-2 bg-white-primary rounded-xl w-[95%]">
              <Box channel="public"/>
            </div>
          </div>
          {isModalOpen && (
            <LoginModal onClose={closeModal} redirect={redirect} />
          )}
          {isChatBotModalOpen && (
            <ChatBotLoginModal onClose={closeChatBotLoginModal} redirect={redirect} />
          )}
          <div className="col-span-17 flex flex-col justify-center items-center bg-light-grey max-md:col-span-24 rounded-xl mr-[1vw]">
            <div className="w-1/2">
              <div className="flex flex-col justify-center items-center ">
                <div className="flex flex-col justify-center items-center gap-6 ">
                  <div className="text-customBlue font-Lato font-medium text-5xl text-center">
                    Welcome to Echofy
                  </div>
                  <div className="text-txt-gray font-Lato text-center text-ato font-medium text-lg">
                    We've developed this resource to address any inquiries you
                    may have regarding the MDG Space group at IIT Roorkee,
                    including its events and projects. You can engage with our
                    chatbot or reach out to us directly on Slack. We're eager to
                    assist you.
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-4 mt-8">
                <div
                  className="flex items-center justify-center py-4 w-full  px-8 rounded-full bg-customBlue text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 hover:cursor-pointer"
                  onClick={goToChatbot}
                >
                  <p className="font-Roboto font-medium text-xl tracking-tighter flex gap-2">
                    <Image alt={"chat bot"} src={ChatBot} />
                    TALK TO OUR CHATBOT
                  </p>
                </div>
                <div
                  className="flex items-center justify-center py-4 w-full  px-8 rounded-full bg-customBlue text-white hover:bg-blue-600 hover:cursor-pointer  focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50"
                  onClick={goToPrivateChat}
                >
                  <p className="font-Roboto font-medium text-xl tracking-tighter flex gap-2">
                    <Image alt={"slack logo"} src={SlackLogo} className="text-sky-400" />
                    PRIVATE CHAT ON SLACK
                  </p>
                </div>
                <div
                  className="flex items-center justify-center py-4 w-full  px-8 rounded-full bg-customBlue text-white hover:bg-blue-600 focus:outline-none hover:cursor-pointer focus:ring-2 focus:ring-customBlue focus:ring-opacity-50"
                  onClick={goToPublicChat}
                >
                  <p className="font-Roboto font-medium text-xl tracking-tighter flex gap-2">
                    <Image alt={"slack logo"} src={SlackLogo} />
                    PUBLIC MDG CHAT FORUM
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