import userIcon from "../assets/user-icon.svg";
import settingIcon from "../assets/Settings.svg";
import helpIcon from "../assets/help.svg";
import chatIcon from "../assets/chat.svg";
import homeIcon from "../assets/home.svg";
import Image from "next/image";

export default function RightPane() {

    const hoverEffectClasses =
    "hover:scale-125 hover:cursor-pointer transition-transform duration-300 ease-in-out";


    return (
        <div className="grid grid-rows-6 h-screen">
          <div className="row-span-1 flex justify-center items-center">
            <Image src={userIcon} alt="user" className={""}></Image>
          </div>
          <div className="row-span-4 flex flex-col justify-center items-center space-y-[4vh]">
            <Image src={homeIcon} alt="home" className={hoverEffectClasses} />
            <Image src={chatIcon} alt="chat" className={hoverEffectClasses} />
            <Image src={helpIcon} alt="help" className={hoverEffectClasses} />
            <Image src={settingIcon} alt="settings" className={hoverEffectClasses} />
          </div>
          <div className="row-span-1"></div>
        </div>
      );
    }