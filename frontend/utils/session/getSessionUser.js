"use client";

export default function getSessionUser() {
    const username = sessionStorage.getItem("username");
    if (!username) {
      return;
    }
    return username;
  }