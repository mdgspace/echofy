export default function getIsSentForChatBot(message: string | null | undefined): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }
  
  const firstPart = message.split(":")[0];
  return firstPart === "You";
}