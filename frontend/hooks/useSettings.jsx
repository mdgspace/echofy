import { useEffect } from "react";
const useSettings=(soundEnabled,notificationsEnabled)=>{
    useEffect(() => {
        localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
      }, [soundEnabled]);
    
      useEffect(() => {
        localStorage.setItem(
          "notificationsEnabled",
          JSON.stringify(notificationsEnabled),
        );
      }, [notificationsEnabled]);
}

export default useSettings;