"use client";
import alertBannedUser from "../swal/alertBannedUser";

export default function processWebSocketMessage(
    event,
    setMessages,
    navigateToLogin,
    isChatbot,
  ) {
    if (isChatbot) {
      const userIdRegex = /\buserID\b/;
      if (userIdRegex.test(event.data)) {
        handleUserID(JSON.parse(event.data));
      }
    }
    try {
      if (
        event.data !== "Message send successful" &&
        event.data !== "Welcome to MDG Chat!" &&
        event.data !== "Message send successful" &&
        !isChatbot
      ) {
        const data = JSON.parse(event.data);
  
        handleUserID(data);
  
        if (handleBannedUser(data, navigateToLogin)) {
          return;
        }
  
        if (data.Delete) {
          handleDeleteMessage(data, setMessages);
        }
      }
    } catch (error) {
      console.error("Error parsing or handling the message:", error);
    }
  
    function handleUserID(data) {
      if (data.userID) {
        sessionStorage.setItem("userID", data.userID);
      }
    }
  
    function handleBannedUser(data, navigateToLogin) {
      if (data.Message && data.Message === "You are banned now") {
        alertBannedUser(data.Message);
        navigateToLogin();
        return true;
      }
      return false;
    }
  
    function handleDeleteMessage(data, setMessages) {
      const deleteTimestamp = parseFloat(data.Delete);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.timestamp !== deleteTimestamp),
      );
    }
  }