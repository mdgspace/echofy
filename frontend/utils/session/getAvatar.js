"use client";

export default async function getAvatar() {
    let avatarId = sessionStorage.getItem("avatarId");
    if (avatarId == null || isNaN(avatarId) || avatarId < 0 || avatarId > 14) {
      avatarId = Math.floor(Math.random() * 15);
      sessionStorage.setItem("avatarId", avatarId);
    }
    return avatarId;
  }