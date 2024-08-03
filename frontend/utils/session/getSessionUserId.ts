"use client";

export default function getSessionUserId(): string | null {
    const a = sessionStorage.getItem("userID");
    return a;
  }