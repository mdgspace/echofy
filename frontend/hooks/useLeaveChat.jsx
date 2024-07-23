import { useEffect } from "react";
import {
  getSessionUserId,
  removeSessionUserId,
} from "../services/utilities/utilities";
import { leaveChat } from "../services/api/leaveChatApi";

const useLeaveChat=(router)=>{
    useEffect(() => {
        const leaveChatOnNavigation = () => {
          leaveChat(getSessionUserId());
          removeSessionUserId();
        };
        const handleBeforeUnload = (e) => {
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