"use client";

export default function getSessionUserId() {
    const a = sessionStorage.getItem("userID");
    return a;
  }