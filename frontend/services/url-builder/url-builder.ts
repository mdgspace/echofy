
import { BackendEnvironment , Topic } from "../../interface/interface";
// Function to build WebSocket URL
export function buildWebSocketURL(
  userId: string,
  username: string,
  channel: string,
  topic?: Topic
): string {
  const env: BackendEnvironment = {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost',
    NEXT_PUBLIC_BACKEND_PORT: process.env.NEXT_PUBLIC_BACKEND_PORT || '1323',
    NEXT_PUBLIC_BACKEND_ENVIRONMENT: process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT as 'development' | 'production',
  };

  const protocol = env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development" ? "ws" : "wss";
  const baseUrl = `${protocol}://${env.NEXT_PUBLIC_BACKEND_HOST}/chat`;

  const params = new URLSearchParams({
    channel: channel || "public",
    name: username,
    userID: userId || "0",
    topic: topic || '',
  });

  return `${baseUrl}?${params.toString()}`;
}


// Function to build project URL
export function projectURLbuildr(): string {
  const env: BackendEnvironment = {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost',
    NEXT_PUBLIC_BACKEND_PORT: process.env.NEXT_PUBLIC_BACKEND_PORT || '1323',
    NEXT_PUBLIC_BACKEND_ENVIRONMENT: process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT as 'development' | 'production',
  };

  const protocol = env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${env.NEXT_PUBLIC_BACKEND_HOST}/projects`;
  
  return baseUrl;
}

// Function to build leave chat URL
export function leaveChatURLbuildr(userID: string): string {
  const env: BackendEnvironment = {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost',
    NEXT_PUBLIC_BACKEND_PORT: process.env.NEXT_PUBLIC_BACKEND_PORT || '1323',
    NEXT_PUBLIC_BACKEND_ENVIRONMENT: process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT as 'development' | 'production',
  };

  const protocol = env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${env.NEXT_PUBLIC_BACKEND_HOST}/chat/leave`;
  
  const params = new URLSearchParams({
    userID: userID,
  });

  return `${baseUrl}?${params.toString()}`;
}


// Function to build subscribe URL
export function subscribeURLbuildr(): string {
  const env: BackendEnvironment = {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost',
    NEXT_PUBLIC_BACKEND_PORT: process.env.NEXT_PUBLIC_BACKEND_PORT || '1323',
    NEXT_PUBLIC_BACKEND_ENVIRONMENT: process.env.NEXT_PUBLIC_BACKEND_ENVIRONMENT as 'development' | 'production',
  };

  const protocol = env.NEXT_PUBLIC_BACKEND_ENVIRONMENT === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${env.NEXT_PUBLIC_BACKEND_HOST}/subscribe`;
  return baseUrl;
}
