export default function formatChatbotUserText(message: string): string | undefined  {
    if (message.split(":")[0] === "You") {
      return message.split(":")[1];
    }
  }