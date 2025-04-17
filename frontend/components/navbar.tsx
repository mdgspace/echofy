import Mail from "./mail";
import { useEffect, useState } from "react";
import mail from ".././assets/mail.svg";
import Image from "next/image";
import jinoraLogo from "../assets/logo.svg";
import slack from ".././assets/slack_blue.svg";
import { TopicDropdown } from "./topicDropdown";
import { NavbarProps } from "../interface/interface";



export const Navbar = ({ currentPage, currentTopic }: NavbarProps) => {
  const [isMailOpen, setIsMailOpen] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>(jinoraLogo);
  const [leftText, setLeftText] = useState<string>("");
  const [toShow, setToShow] = useState<boolean>(false);
  const [topic,setTopic]=useState<string>(currentTopic);

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
        setToShow(true);
        break;
      case "public":
        setLogo(slack);
        setLeftText("MDG PUBLIC FORUM");
        setToShow(true);
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
        {(currentPage=='chatbot')?(
      <div className="flex flex-row gap-4 items-center">
        <div className="ele1">
          <TopicDropdown login={false} setTopic={setTopic} topic={topic}/>
        </div>
      </div>
        ):(toShow &&(
            <div className="flex flex-row gap-4">  
            <div className="flex flex-row gap-2 ">
              <Image src={mail} alt="mail" width={29} height={29} />
              <p onClick={openMail} className="text-gray-600 font-lato text-base font-normal leading-7  hover:cursor-pointer hover:text-customBlue mt-1.5 mx-2 pb-2  ">
                Request a mail reply
              </p>
            </div>
          </div>
          ))}
        {isMailOpen && currentPage == "private" && <Mail onClose={closeMail} channel="private"/>
          }
    </div>
  );
};