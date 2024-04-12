import Mail from "../components/mail";
import { useEffect, useState } from "react";
import mail from ".././assets/mail.svg";
import Image from "next/image";
import jinoraLogo from "../assets/logo.svg";
import slack from ".././assets/slack_blue.svg";




export const ChatNavbar = ({currentPage}) => {
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
        switch(currentPage){
            case "private":
                setLogo(slack);
                setLeftText("MDG SLACK MEMBERS")
                break;
            case "public":
                setLogo(slack);
                setLeftText("MDG PUBLIC FORUM")
                break;
            case "chatbot":
                setLogo(jinoraLogo);
                setLeftText("ECHOFY CHAT BOT")
                break;
          }
        }
        , [currentPage])


     

    return (
        <div class="flex flex-row justify-between w-[95%] px-6 py-4 rounded-lg h-[3.5rem] bg-white items-center">
            <div class="flex flex-row items-center justify-center py-4">
                <Image src={logo} className="text-customBlue" alt="logo" width={40} height={40} />
                <div class="text-customBlue font-roboto font-semibold text-lg leading-7 ml-5" >
                    {leftText}
                </div>
            </div>
            <div class="flex flex-row gap-4">
                <div class="ele1">
                    {/* ele 1 */} 
                    {/* todo -> implement leave chat here with login modal   */}
                </div>
                <div class="flex flex-row gap-2">
                <Image src={mail} alt="mail" width={29} height={29} />
                <p onClick={openMail} className="text-gray-600 font-lato text-base font-normal leading-7">
                      Request a mail reply
                    </p>

                </div>
            </div>
            {isMailOpen && <Mail onClose={closeMail} />}
        </div>
    )
}