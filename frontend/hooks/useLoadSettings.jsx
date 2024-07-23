import {useEffect} from 'react';

const useLoadSetting=(setSoundEnabled,setNotificationsEnabled)=>{
    useEffect(() => {
        const savedSoundEnabled = localStorage.getItem("soundEnabled");
        const savedNotificationsEnabled = localStorage.getItem(
          "notificationsEnabled",
        );
    
        if (savedSoundEnabled !== null) {
          setSoundEnabled(JSON.parse(savedSoundEnabled));
        }
        if (savedNotificationsEnabled !== null) {
          setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
        }
      }, []);
}
export default useLoadSetting;