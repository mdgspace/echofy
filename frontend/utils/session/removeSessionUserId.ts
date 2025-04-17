"use client";

export default function removeSessionUserId():void {
    sessionStorage.removeItem("userID");
  }