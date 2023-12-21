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
  return sessionStorage.getItem("userID");
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

      if (result.isConfirmed) {
        onConfirm();
        return true;
      } else {
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
  console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
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

export function processWebSocketMessage(event, setMessages, navigateToLogin) {
  console.log("Received message:", event.data);

  try {
    if (
      event.data !== "Messsage send successful" &&
      event.data !== "Welcome to MDG Chat!"
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
    console.error(event.data);
  }

  function handleUserID(data) {
    if (data.userID) {
      sessionStorage.setItem("userID", data.userID);
      console.log("userID set in session storage:", data.userID);
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
