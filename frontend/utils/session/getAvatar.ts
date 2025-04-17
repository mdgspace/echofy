"use client";

export default async function getAvatar() {

  let avatarIdString = sessionStorage.getItem("avatarId");
  let avatarId: number;

  if (avatarIdString === null || isNaN(Number(avatarIdString)) || Number(avatarIdString) < 0 || Number(avatarIdString) > 14) {
    avatarId = Math.floor(Math.random() * 15);
    sessionStorage.setItem("avatarId", avatarId.toString());
  } else {
    avatarId = Number(avatarIdString);
  }
    return avatarId;
  }