import React, { useEffect, useRef } from "react";
import { useState } from "react";
import subscribe from "../services/api/subscribeApi";
import { useToast } from "../context/ToastContext";
import getSessionUser from "../utils/session/getSessionUser";
import getSessionUserId from "../utils/session/getSessionUserId";
import { MailProps } from "../interface/interface";



export default function Mail({
  isOpen,
  onClose,
  channel,
} : MailProps) {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailStr)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length > 0) {
      validateEmail(val);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    let userId = getSessionUserId();
    let username = getSessionUser();
    let timestamp =  Date.now();
    e.preventDefault();
    if (emailError || email.trim() === "" || query.trim() === "") {
      return;
    }
    
    onClose();

    try {
      await subscribe({email, username: username || "", userId: "", channel, timestamp, query});
      showToast("success", "Email Sent Successfully", "We have received your query. Our admin team will get back to you shortly.");
    } catch (error) {
      showToast("failure", "Subscription Failed", error instanceof Error ? error.message : "Unexpected error occurred. Please try again.");
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
        <div className="flex flex-col justify-center items-start py-2 w-full">
          <label className="text-black font-medium mb-1 text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. user@example.com"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-4 py-3 border rounded-lg font-medium text-black focus:outline-none ${emailError ? "border-red-500" : "border-gray-300"}`}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
        <div className="flex flex-col justify-center items-start py-2 w-full">
          <label className="text-black font-medium mb-1 text-sm">
            Query <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter your question or query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black font-medium focus:outline-none resize-none"
            rows={4}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={emailError !== "" || email.trim() === "" || query.trim() === ""}
          className={`font-Roboto font-semibold py-3 px-4 rounded-lg w-full text-center text-white transition-colors mt-2 ${
            emailError !== "" || email.trim() === "" || query.trim() === ""
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-customBlue hover:bg-blue-700 hover:cursor-pointer"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}