// useLeaveChat.ts
import { useEffect } from "react";
import getSessionUserId from "../utils/session/getSessionUserId";
import removeSessionUserId from "../utils/session/removeSessionUserId";
import { leaveChat } from "../services/api/leaveChatApi";
import { NextRouter } from "next/router";

const useLeaveChat = (router: NextRouter) => {
  useEffect(() => {
    const leaveChatOnNavigation = () => {
      const userId = getSessionUserId();
      if (userId) {
        leaveChat(userId);
        removeSessionUserId();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const userId = getSessionUserId();
      if (userId) {
        leaveChat(userId);
      }
    };

    router.events.on("routeChangeStart", leaveChatOnNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      router.events.off("routeChangeStart", leaveChatOnNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);
};

export default useLeaveChat;
