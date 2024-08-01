export default function formatChatbotUserText(message) {
    if (message.split(":")[0] === "You") {
      return message.split(":")[1];
    }
  }