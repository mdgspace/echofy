export function initializeWebSocketConnection(url, onOpen, onMessage, onClose, onError) {
    const socket = new WebSocket(url);
  
    socket.onopen = onOpen;
    socket.onmessage = onMessage;
    socket.onclose = onClose;
    socket.onerror = onError;
  
    return socket;
  }
  

  