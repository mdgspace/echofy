"use client"

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";



export function getSessionUser() {
  const username = sessionStorage.getItem("username");
  if (!username) {
    return;
  }
  return username;
}

export function getSessionUserId() {
  const a = sessionStorage.getItem("userID");
  console.log(a)
  return a;
}

export function setSessionUser(username) {
  sessionStorage.setItem("username", username);
}

export function removeSessionUserId() {
  sessionStorage.removeItem("userID");
}

export async function checkAndPromptSessionChange(
  currentUsername,
  inputUsername,
  onConfirm
) {
  if (currentUsername && currentUsername !== inputUsername) {
    try {
      const result = await Swal.fire({
        title: "Change Username?",
        text: `You already have a running session with the username "${currentUsername}". Do you want to change your username?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      });

      if (result.isConfirmed && inputUsername.length < 20) {
        onConfirm();
        return true;
      } else {
        if(inputUsername.length > 20){
          Swal.fire({
            title: "Username too long",
            text: `Please choose a username with less than 20 characters`,
            icon: "warning",
            confirmButtonColor: "#f66151",
            confirmButtonText: "OK",
            didOpen: (popup) => {
              popup.style.borderRadius = "1rem";
            },
          });
        }
        return false;
      }
    } catch (error) {
      console.error("Error with SweetAlert2:", error);
      return false;
    }
  }
  return false;
}

export function handleWebSocketError(event) {
  console.error("WebSocket error observed:", event);
}

export function handleWebSocketClose(event, navigateToLogin) {
  if (isUserBanned(event.code)) {
    alertBannedUser(event.reason, navigateToLogin);
  }
  if (isSameUsername(event.code)) {
    alertSameUsername(event.reason, navigateToLogin);
  }
  if (isBadRequest(event.code)) {
    alertBadRequest(event.reason, navigateToLogin);
  }
  if (isServerError(event.code)) {
    alertServerError(event.reason, navigateToLogin);
  }
  if (isAbnormalClose(event.code)) {
    alertAbnormalClose(event.reason, navigateToLogin);
  }
}

function isUserBanned(code) {
  return code === 1008;
}

function alertBannedUser(reason, navigateToLogin) {
  try {
    Swal.fire({
      title: "You have been banned",
      text: `${reason}`,
      icon: "error",
      confirmButtonColor: "#f66151",
      confirmButtonText: "OK",
      didOpen: (popup) => {
        popup.style.borderRadius = "1rem";
      },
      customClass: {
        confirmButton: "border-none",
      },
    }).then((result) => {
      try {
        if (result.isConfirmed) navigateToLogin();
      } catch (error) {}
    });
  } catch (error) {}
}

function isSameUsername(code) {
  return code === 4001;
}
function alertSameUsername(reason, navigateToLogin) {
  try {
    Swal.fire({
      title: "Username already exists",
      text: "Please choose a different username",
      icon: "warning",
      imageAlt: "Username Taken",
      confirmButtonColor: "#f66151",
      confirmButtonText: "OK",
      didOpen: (popup) => {
        popup.style.borderRadius = "1rem";
      },
    }).then((result) => {
      try {
        if (result.isConfirmed) navigateToLogin();
      } catch (error) {}
    });
  } catch (error) {}
}

function isBadRequest(code) {
  return code === 1007;
}

function alertBadRequest(reason, navigateToLogin) {
  try {
    Swal.fire({
      title: "Bad request",
      text: `Please try again ${reason}`,
      icon: "warning",
      confirmButtonColor: "#f66151",
      confirmButtonText: "OK",
      didOpen: (popup) => {
        popup.style.borderRadius = "1rem";
      },
    }).then((result) => {
      try {
        if (result.isConfirmed) navigateToLogin();
      } catch (error) {}
    });
  } catch (error) {}
}

function isServerError(code) {
  return code === 1011;
}

function alertServerError(reason, navigateToLogin) {
  try {
    Swal.fire({
      title: "Server error",
      text: `Please try again ${reason}`,
      icon: "warning",
      confirmButtonColor: "#f66151",
      confirmButtonText: "OK",
      didOpen: (popup) => {
        popup.style.borderRadius = "1rem";
      },
    }).then((result) => {
      try {
        if (result.isConfirmed) navigateToLogin();
      } catch (error) {}
    });
  } catch (error) {}
}

function isAbnormalClose(code) {
  return code === 1006;
}

function alertAbnormalClose(reason, navigateToLogin) {
  try {
    Swal.fire({
      title: "Connection lost",
      text: `Please try again or with a different username ${reason}`,
      icon: "warning",
      confirmButtonColor: "#f66151",
      confirmButtonText: "OK",
      didOpen: (popup) => {
        popup.style.borderRadius = "1rem";
      },
    }).then((result) => {
      try {
        if (result.isConfirmed) navigateToLogin();
      } catch (error) {}
    });
  } catch (error) {}
}

export function processWebSocketMessage(event, setMessages, navigateToLogin , isChatbot) {
   if(isChatbot) {
    const userIdRegex = /\buserID\b/;
    if(userIdRegex.test(event.data)) {
      handleUserID(JSON.parse(event.data))
    }
   }
  try {
    if (
      event.data !== "Messsage send successful" &&
      event.data !== "Welcome to MDG Chat!"
      && !isChatbot
    ) {
      const data = JSON.parse(event.data);
      console.log(data)
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
    console.error(event.data);
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
      prevMessages.filter((message) => message.timestamp !== deleteTimestamp)
    );
  }
}




function getTimestampFromDate(dateString) {

  const date = new Date(dateString);


  const timestamp = Math.floor(date.getTime() / 1000);

  return timestamp;
}


export function getIsSentForChatBot(message)  {
  if (message.split(':')[0] === "You")
  {
    return true
  }else {
    return false
  }
}


export function formatChatbotUserText(message) { 
  if (message.split(':')[0] === "You")
  {
    return message.split(':')[1]
  }
}


export function parseMessageText(text){
  // Function to replace URLs with clickable links
  const replaceURLs = (message) => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return message.replace(urlRegex, url => `<a href="${url}">${url}</a>`);
  };

  // Function to replace **bold** text
  const replaceBoldText = (message) => {
    return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Function to replace `code` text
  const replaceCodeText = (message) => {
    return message.replace(/`(.*?)`/g, '<code className="!bg-gray-400" style="background-color:#dbdbd7 ; color:#3670F5 ; font-size:16px; padding-left:2px ; padding-right:2px" >$1</code>');
  };

  // Apply all formatting functions
  let formattedText = replaceURLs(text);
  formattedText = replaceBoldText(formattedText);
  formattedText = replaceCodeText(formattedText);

  // Return formatted text as JSX using dangerouslySetInnerHTML (be cautious with untrusted content to avoid XSS attacks)
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};
