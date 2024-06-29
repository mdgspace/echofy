import Mail from "../mail";
import { useEffect, useState } from "react";
import mail from ".././assets/mail.svg";
import Image from "next/image";
import jinoraLogo from "../assets/logo.svg";
import slack from ".././assets/slack_blue.svg";

import { TopicDropdown } from "../topicDropdown";

export const ChatbotNavbar = ({ currentPage, currentTopic }) => {
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [logo, setLogo] = useState(jinoraLogo);
  const [leftText, setLeftText] = useState("");

  function openMail() {
    setIsMailOpen(true);
  }

  function closeMail() {
    setIsMailOpen(false);
  }

  useEffect(() => {
    switch (currentPage) {
      case "private":
        setLogo(slack);
        setLeftText("MDG SLACK MEMBERS");
        break;
      case "public":
        setLogo(slack);
        setLeftText("MDG PUBLIC FORUM");
        break;
      case "chatbot":
        setLogo(jinoraLogo);
        setLeftText("ECHOFY CHAT BOT");
        break;
    }
  }, [currentPage]);

  return (
    <div className="flex  flex-row justify-between w-[95%] px-4 py-4 mt-3 rounded-lg h-[3.5rem] bg-white items-center">
      <div className="flex flex-row items-center justify-center py-4">
        <Image
          src={logo}
          className="text-customBlue"
          alt="logo"
          width={40}
          height={40}
        />
        <div className="text-customBlue font-roboto font-semibold text-lg leading-7 ml-5">
          {leftText}
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="ele1">
          <TopicDropdown currentTopic={currentTopic} />
        </div>
       
      </div>

    </div>
  );
};
