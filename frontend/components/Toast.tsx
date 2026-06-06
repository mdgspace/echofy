import React, { useEffect, useState } from "react";
import { ToastType } from "../context/ToastContext";

interface ToastProps {
  type: ToastType;
  label: string;
  description: string;
  onClose: () => void;
}

export default function Toast({ type, label, description, onClose }: ToastProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Small delay to trigger the slide-in transition
    const t = setTimeout(() => setIsShowing(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300); // Wait for fade-out animation to finish before unmounting
  };

  const borderColor = type === "success" ? "border-green-500" : "border-red-500";
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";
  
  return (
    <div
      className={`relative flex items-start p-4 bg-white border-2 ${borderColor} rounded-lg shadow-lg w-80 transform transition-all duration-300 ease-in-out ${
        isShowing ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }`}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {type === "success" ? (
          <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>
      <div className="flex-1 pr-6">
        <h3 className="text-gray-900 font-semibold text-sm">{label}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors bg-transparent !p-1 !m-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
