export function buildWebSocketURL(userId, username) {
  const host = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT;
  const protocol = process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === 'development' ? 'ws' : 'wss';
  const baseUrl = `${protocol}://${host}:${port}/chat`;
  const params = new URLSearchParams({
    channel: 'public',
    name: username,
    userID: userId || '0', // Use userId if it exists, otherwise set to '0'
  });
  return `${baseUrl}?${params.toString()}`;
}
