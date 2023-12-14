export function buildWebSocketURL(userId, username) {
  const baseUrl = 'ws://127.0.0.1:1323/chat';
  const params = new URLSearchParams({
    channel: 'public',
    name: username,
    userID: userId || '0', // Use userId if it exists, otherwise set to '0'
  });
  return `${baseUrl}?${params.toString()}`;
}
