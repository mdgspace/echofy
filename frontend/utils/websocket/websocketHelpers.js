"use client";

export function isUserBanned(code) {
  return code === 1008;
}

export function isSameUsername(code) {
  return code === 4001;
}

export function isBadRequest(code) {
  return code === 1007;
}

export function isServerError(code) {
  return code === 1011;
}

export function isAbnormalClose(code) {
  return code === 1006;
}
