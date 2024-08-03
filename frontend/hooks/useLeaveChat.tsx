import { useEffect } from "react";
import getSessionUserId from "../utils/session/getSessionUserId";
import removeSessionUserId from "../utils/session/removeSessionUserId";
import { leaveChat } from "../services/api/leaveChatApi";
import { NextRouter } from "next/router";

const useLeaveChat=(router:NextRouter)=>{
    useEffect(() => {
        const leaveChatOnNavigation = () => {
          leaveChat(getSessionUserId());
          removeSessionUserId();
        };
        const handleBeforeUnload = (e:BeforeUnloadEvent) => {
          leaveChat(getSessionUserId());
        };
    
        router.events.on("routeChangeStart", leaveChatOnNavigation);
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
          router.events.off("routeChangeStart", leaveChatOnNavigation);
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, [router]);
}
export default useLeaveChat;