import { useEffect } from 'react';
import { UseVisibilityChangeProps } from '../interface/interface';



const useVisibilityChange = ({ setUnreadCount }: UseVisibilityChangeProps) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                setUnreadCount(0);
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleVisibilityChange);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
        };
    }, [setUnreadCount]);
};

export default useVisibilityChange;
