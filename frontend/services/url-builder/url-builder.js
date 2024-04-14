export function buildWebSocketURL(userId, username, channel, topic) {
  const host = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT;
  const protocol =
    process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development"
      ? "ws"
      : "wss";
  const baseUrl = `${protocol}://${host}:${port}/chat`;
  const params = new URLSearchParams({
    channel: channel || "public",
    name: username,
    userID: userId || "0",
    topic: topic || null, // Use userId if it exists, otherwise set to '0'
  });
  return `${baseUrl}?${params.toString()}`;
}

export function projectURLbuildr() {
  const host = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT;
  const protocol =
    process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development"
      ? "http"
      : "https";
  const baseUrl = `${protocol}://${host}:${port}/projects`;
  return baseUrl;
}

export function leaveChatURLbuildr(userID) {
  const host = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT;
  const protocol =
    process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development"
      ? "http"
      : "https";
  const baseUrl = `${protocol}://${host}:${port}/chat/leave`;
  const params = new URLSearchParams({
    userID: userID,
  });

  return `${baseUrl}?${params.toString()}`;
}

export function subscribeURLbuildr() {
  const host = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT;
  const protocol =
    process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development"
      ? "http"
      : "https";
  const baseUrl = `${protocol}://${host}:${port}/subscribe`;
  return baseUrl;
}
