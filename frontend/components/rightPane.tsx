import userIcon from "../assets/user-icon.svg";
import settingIcon from "../assets/Settings.svg";
import helpIcon from "../assets/help.svg";
import chatIcon from "../assets/chat.svg";
import homeIcon from "../assets/home.svg";
import Image from "next/image";
import SettingsPopup from "./settingsPopup";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { SettingsPopupProps } from "../interface/interface";

export default function RightPane({
  onClose,
  soundEnabled,
  setSoundEnabled,
  notificationsEnabled,
  setNotificationsEnabled,
}:SettingsPopupProps) {
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();
  const hoverEffectClasses ="hover:scale-125 hover:cursor-pointer transition-transform duration-300 ease-in-out";

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleChatClick = () => {
    router.reload();
  };

  const handleHomeClick = () => {
    router.push("/");
  };
  return (
    <div className="grid grid-rows-6 h-screen flex flex-row bg-bg-orange rounded-l-md shadow-[0px_0px_20px_-5px_rgba(0,0,0,1)]">
      <div className="row-span-1 flex justify-center items-center">
        <Image src={userIcon} alt="user" className={""}></Image>
      </div>
      <div className="row-span-4 flex flex-col justify-center items-center space-y-[4vh]">
        <div onClick={handleHomeClick}>
          <Image src={homeIcon} alt="home" className={hoverEffectClasses} />
        </div>
        <div onClick={handleChatClick}>
          <Image src={chatIcon} alt="chat" className={hoverEffectClasses} />
        </div>
        <Image src={helpIcon} alt="help" className={hoverEffectClasses} />
        <div onClick={handleSettingsClick}>
          <Image
            src={settingIcon}
            alt="settings"
            className={hoverEffectClasses}
          />
        </div>
      </div>
      <div className="row-span-1"></div>
      {showSettings && (
        <SettingsPopup
          onClose={() => setShowSettings(false)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
        />
      )}
    </div>
  );
}