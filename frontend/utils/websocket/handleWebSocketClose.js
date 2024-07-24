"use client";
import {
    isUserBanned,
    isSameUsername,
    isBadRequest,
    isServerError,
    isAbnormalClose,
  } from "./websocketHelpers";
import alertBannedUser from "../swal/alertBannedUser";
import alertSameUsername from "../swal/alertSameUsername";
import alertBadRequest from "../swal/alertBadRequest";
import alertServerError from "../swal/alertServerError";
import alertAbnormalClose from "../swal/alertAbnormalClose";

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