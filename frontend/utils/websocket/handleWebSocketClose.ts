"use client";
import {
  isUserBanned,
  isSameUsername,
  isBadRequest,
  isServerError,
  isAbnormalClose,
} from "./websocketHelpers";
import alertBannedUser from "../alerts/alertBannedUser";
import alertSameUsername from "../alerts/alertSameUsername"; // Ensure all alert imports are correctly defined
import alertBadRequest from "../alerts/alertBadRequest";
import alertServerError from "../alerts/alertServerError";
import alertAbnormalClose from "../alerts/alertAbnormalClose";
import {useNavigate} from "react-router-dom";
// Define the type for the WebSocket close event
interface WebSocketCloseEvent {
  code: number;
  reason: string;
}


export function navigateToLogin(): void {
  const navigate = useNavigate(); // Import the useNavigate hook from react-router-dom
  navigate("/"); // Adjust the path as needed
}

// Define the type for the navigate function
type NavigateFunction = (path: string) => void;

export default function handleWebSocketClose(
  event: WebSocketCloseEvent,
  navigateToLogin: NavigateFunction
): void {
  if (isUserBanned(event.code)) {
    alertBannedUser(event.reason, navigateToLogin);
  }
  if (isSameUsername(event.code)) {
    alertSameUsername(event.reason, navigateToLogin);
  }
  if (isBadRequest(event.code)) {
    alertBadRequest(event.reason, navigateToLogin);
  }
  if (isServerError(event.code)) {
    alertServerError(event.reason, navigateToLogin);
  }
  if (isAbnormalClose(event.code)) {
    alertAbnormalClose(event.reason, navigateToLogin);
  }
}
