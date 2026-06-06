import Mail from "./mail";
import { useEffect, useState } from "react";
import mail from ".././assets/mail.svg";
import Image from "next/image";
import jinoraLogo from "../assets/logo.svg";
import slack from ".././assets/slack_blue.svg";
import { NavbarProps } from "../interface/interface";

export const Navbar = ({ label, logo, showMailButton, onMailClick }: NavbarProps) => {
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
          {label}
        </div>
      </div>
      
      {showMailButton && (
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-2 ">
            <Image src={mail} alt="mail" width={29} height={29} />
            <p
              onClick={onMailClick}
              className="text-gray-600 font-lato text-base font-normal leading-7  hover:cursor-pointer hover:text-customBlue mt-1.5 mx-2 pb-2  "
            >
              Request a mail reply
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
