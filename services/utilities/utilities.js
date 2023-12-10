export function getSessionUser() {
  return sessionStorage.getItem("username");
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

export function checkAndPromptSessionChange(
  currentUsername,
  inputUsername,
  onConfirm
) {
  if (currentUsername && currentUsername !== inputUsername) {
    const confirmChange = window.confirm(
      `You already have a running session with the username "${currentUsername}". Do you want to change your username?`
    );
    if (confirmChange) {
      onConfirm();
    }
    return confirmChange;
  }
  return false;
}

export function handleWebSocketError(event) {
  console.error("WebSocket error observed:", event);
}

export function handleWebSocketClose(event) {
  console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
  if (isUserBanned(event.code)) {
    alertBannedUser(event.reason);
  }
  if(isSameUsername(event.code)){
        alertSameUsername(event.reason);
    }
}

function isUserBanned(code) {
  return code === 1008;
}

function alertBannedUser(reason) {
  alert("You have been banned: " + reason);
}

function isSameUsername(code){
    return code === 4001;
}

function alertSameUsername(reason){
    alert("You need to change the username, " + reason);
}

export function processWebSocketMessage(event, setMessages, username) {
  console.log("Received message:", event.data);

  try {
    if (event.data !== "Message send successful") {
      const data = JSON.parse(event.data);

      handleUserID(data);

      if (handleBannedUser(data)) {
        return;
      }
    }
  } catch (error) {
    console.error("Error parsing or handling the message:", error);
  }

  function handleUserID(data) {
    if (data.userID) {
      sessionStorage.setItem("userID", data.userID);
      console.log("userID set in session storage:", data.userID);
    }
  }

  function handleBannedUser(data) {
    if (data.Message && data.Message === "You are banned now") {
      alertBannedUser(data.Message);
      return true;
    }
    return false;
  }
}
