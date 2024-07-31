import { useEffect } from "react";

const useVisibilityChange=(setUnreadCount)=>{
    useEffect(() => {
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            setUnreadCount(0);
          }
        };
        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleVisibilityChange);
        return () => {
          window.removeEventListener("visibilitychange", handleVisibilityChange);
          window.removeEventListener("focus", handleVisibilityChange);
        };
      }, []);   
}
export default useVisibilityChange;