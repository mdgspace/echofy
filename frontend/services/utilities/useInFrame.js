import { useEffect, useState } from 'react';

const useIsInIframe = () => {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window !== window.parent);
  }, []);

  return isInIframe;
};

export default useIsInIframe;