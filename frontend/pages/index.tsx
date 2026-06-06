import Image from "next/image";
import { useState } from "react";
import ChatBot from "../assets/chatbot.svg";
import SlackLogo from "../assets/slack.svg";
import LoginModal from "../components/chat/loginModal";
import { useRouter } from "next/router";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<string>("");
  const router = useRouter();

  const goToChatbot = () => {
    router.push("/chat_bot");
  };

  const openModal = (redirect: string) => {
    setIsModalOpen(true);
    setRedirect(redirect);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };


  const goToPublicChat = () => {
    openModal("public");
  };

  const goToPrivateChat = () => {
    openModal("private");
  };

  return (
    <>
      <div className="main bg-white w-full bg-contain">
        <div className="flex flex-col justify-center items-center w-full mt-2 h-[95vh]">
          {isModalOpen && (
            <LoginModal onClose={closeModal} redirect={redirect} />
          )}
          <div className="flex flex-col justify-center items-center w-full h-full bg-light-grey rounded-xl">
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
                    <Image
                      alt={"slack logo"}
                      src={SlackLogo}
                      className="text-sky-400"
                    />
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
