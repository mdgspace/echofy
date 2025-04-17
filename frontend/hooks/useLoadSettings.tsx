import { useEffect } from 'react';
import { UseLoadSettingProps } from '../interface/interface';

const useLoadSetting = ({ setSoundEnabled, setNotificationsEnabled }: UseLoadSettingProps) => {
  useEffect(() => {
    const savedSoundEnabled = localStorage.getItem("soundEnabled");
    const savedNotificationsEnabled = localStorage.getItem("notificationsEnabled");

    if (savedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }

    if (savedNotificationsEnabled !== null) {
      setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
    }
  }, [setSoundEnabled, setNotificationsEnabled]); 
};

export default useLoadSetting;

