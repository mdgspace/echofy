import React, { useEffect, useRef } from "react";
import { useState } from "react";
import subscribe from "../services/api/subscribeApi";
import getSessionUser from "../utils/session/getSessionUser";
import getSessionUserId from "../utils/session/getSessionUserId";
import { MailProps } from "../interface/interface";



export default function Mail({
  isOpen,
  onClose,
  channel,
} : MailProps) {
  const [email, setEmail] = useState<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    let userId = getSessionUserId();
    let username = getSessionUser();
    let timestamp =  Date.now();
    e.preventDefault();
    try {
      await subscribe({email, username, userId, channel, timestamp});
      onClose();
    } catch (error) {
       //todo -> enable sentry logger here
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-gray bg-opacity-60 ">
      <div
        ref={popupRef}
        className="flex flex-col justify-center items-center gap-4 w-80 md:w-96 h-fit p-8 border border-gray-200 rounded-lg shadow-md bg-gray-100 px-10 py-20"
      >
        <p className="text-black font-Lato text-Lato font-medium text-lg ">
          Enter your email to get a reply
        </p>
        <div className="flex flex-col justify-center items-center py-7  w-full">
          <input
            type="email"
            placeholder="Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-none rounded-lg placeholder-center text-center font-medium text-black "
          />
        </div>
        <div
          onClick={handleSubmit}
          className="bg-customBlue hover:bg-blue-700 hover:cursor-pointer text-white font-Roboto font-semibold py-3 px-4 rounded-lg w-full text-center "
        >
          Submit
        </div>
      </div>
    </div>
  );
}