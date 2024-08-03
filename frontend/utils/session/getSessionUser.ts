"use client";

export default function getSessionUser() : string | undefined {
    const username = sessionStorage.getItem("username");
    if (!username) {
      return undefined;
    }
    return username;
  }