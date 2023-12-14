import { useRouter } from 'next/navigation';




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

export function handleWebSocketClose(event, navigateToLogin) {
  console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
  if (isUserBanned(event.code)) {
    alertBannedUser(event.reason , navigateToLogin);
  }
  if(isSameUsername(event.code)){
        alertSameUsername(event.reason , navigateToLogin);
  }
  if(isBadRequest(event.code)){
      alertBadRequest(event.reason , navigateToLogin);
  }
  if(isServerError(event.code)){
      alertServerError(event.reason , navigateToLogin);
  }
  if(isAbnormalClose(event.code)){
      alertAbnormalClose(event.reason , navigateToLogin);
  }
}

function isUserBanned(code) {
  return code === 1008;
}

function alertBannedUser(reason , navigateToLogin) {
  alert("You have been banned: " + reason);
  navigateToLogin();
}

function isSameUsername(code){
    return code === 4001;
}
function alertSameUsername(reason , navigateToLogin){
    alert("You need to change the username, " + reason);
    navigateToLogin();
}

function isBadRequest(code){
    return code === 1007;
}

function alertBadRequest(reason , navigateToLogin){
    alert("Bad request, " + reason);
    navigateToLogin();
}

function isServerError(code){
    return code === 1011;
}

function alertServerError(reason, navigateToLogin){
    alert("Server error, " + reason);
    navigateToLogin();
}

function isAbnormalClose(code){
    return code === 1006;
}

function alertAbnormalClose(reason, navigateToLogin){
    alert("Cannot connect to the server, please try after sometime or login using a different username");
    navigateToLogin();
}


export function processWebSocketMessage(event, setMessages, navigateToLogin) {
  console.log("Received message:", event.data);

  try {
    if (event.data !== "Messsage send successful" && event.data !== "Welcome to MDG Chat!") {
      const data = JSON.parse(event.data);

      handleUserID(data);

      if (handleBannedUser(data,navigateToLogin)) {
        return;
      }

      if(data.Delete){
        handleDeleteMessage(data,setMessages);
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

  function handleBannedUser(data,navigateToLogin) {
    if (data.Message && data.Message === "You are banned now") {
      alertBannedUser(data.Message);
      navigateToLogin();
      return true;
    }
    return false;
  }

  function handleDeleteMessage(data,setMessages){
    const deleteTimestamp = parseFloat(data.Delete);
    setMessages(prevMessages => prevMessages.filter(message => message.timestamp !== deleteTimestamp));
  }
}
