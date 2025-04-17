export default function getIsSentForChatBot(message: string): boolean {
    if (message.split(":")[0] === "You") {
      return true;
    } else {
      return false;
    }
  }