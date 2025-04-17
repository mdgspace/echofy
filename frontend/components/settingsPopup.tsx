import React, { useEffect, useRef } from "react";
import Switch from "react-switch";
import Image from "next/image";
import Settings from "../assets/Settings.svg";
import {
  MdNotifications,
  MdClose,
  MdAudiotrack,
} from "react-icons/md";
import { SettingsPopupProps } from "../interface/interface";


const SettingsPopup = ({
  onClose,
  soundEnabled,
  setSoundEnabled,
  notificationsEnabled,
  setNotificationsEnabled,
}: SettingsPopupProps) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef, onClose]);
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center backdrop-blur">
      <div className="p-6 rounded-2xl shadow-2xl relative w-96 h-96 bg-[#F95131AB] bg-opacity-40">
        <div className="flex justify-between items-center mb-[4vh]">
          <div className="flex items-center">
            <Image
              src={Settings}
              alt="Settings"
              className="h-10 w-10 object-contain"
            />
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-red-600 bg-red-200 rounded-xl aspect-square p-3"
          >
            <MdClose></MdClose>
          </button>
        </div>
        <div className="mt-8 flex flex-col  h-[10vh]">
          <div className="flex items-center justify-between mb-[2vh]">
            <div className="flex flex-row gap-2">
              <MdAudiotrack className="text-3xl" />
              <div className="noir-pro-bold text-2xl">Sound</div>
            </div>
            <Switch onChange={setSoundEnabled} checked={soundEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-2">
              <MdNotifications className="text-3xl" />
              <div className="noir-pro-bold text-2xl">Notifications</div>
            </div>
            <Switch
              onChange={setNotificationsEnabled}
              checked={notificationsEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPopup;