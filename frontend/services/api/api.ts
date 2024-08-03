export function initializeWebSocketConnection(
  url: string,
  onOpen: (event: Event) => void,
  onMessage: (event: MessageEvent<any>) => void,
  onClose: (event: CloseEvent) => void,
  onError: (event: Event) => void
) :  WebSocket{
  const socket = new WebSocket(url);
  socket.onopen = onOpen;
  socket.onmessage = onMessage;
  socket.onclose = onClose;
  socket.onerror = onError;
  return socket;
}