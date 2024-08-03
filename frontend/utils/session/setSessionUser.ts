"use client";

export default function setSessionUser(username: string) {
    sessionStorage.setItem("username", username);
  }