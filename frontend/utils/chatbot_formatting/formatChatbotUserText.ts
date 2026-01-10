export default function formatChatbotUserText(message: string | null | undefined): string {
  if (!message || typeof message !== 'string') {
    return '';
  }
  
  const parts = message.split(":");
  if (parts.length < 2 || parts[0] !== "You") {
    return message;
  }
  
  return parts.slice(1).join(":").trim();
}