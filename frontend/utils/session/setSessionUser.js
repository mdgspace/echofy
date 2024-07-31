"use client";

export default function setSessionUser(username) {
    sessionStorage.setItem("username", username);
  }