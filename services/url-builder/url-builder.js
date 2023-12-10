export function buildWebSocketURL(userId, username) {
    const baseUrl = 'ws://127.0.0.1:1323/chat';
    const params = new URLSearchParams({
      channel: 'public',
      name: username,
      ...(userId && { userID: userId })
    });
    return `${baseUrl}?${params.toString()}`;
  }
  