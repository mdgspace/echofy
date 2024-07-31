"use client";
import {
    isUserBanned,
    isSameUsername,
    isBadRequest,
    isServerError,
    isAbnormalClose,
  } from "./websocketHelpers";
import alertBannedUser from "../alerts/alertBannedUser";
import alertSameUsername from "../alerts/alertSameUsername";
import alertBadRequest from "../alerts/alertBadRequest";
import alertServerError from "../alerts/alertServerError";
import alertAbnormalClose from "../alerts/alertAbnormalClose";

export default function handleWebSocketClose(event, navigateToLogin) {
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