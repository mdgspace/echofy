export default function getIsSentForChatBot(message) {
    if (message.split(":")[0] === "You") {
      return true;
    } else {
      return false;
    }
  }