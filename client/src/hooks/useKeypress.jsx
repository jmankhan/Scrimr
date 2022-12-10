import { useEffect, useState } from 'react';

const useKeyPress = (targetKey, andCtrl = false) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e) => {
      if (e.key === targetKey && (andCtrl ? e.ctrlKey || e.metaKey : true)) {
        e.preventDefault();
        setKeyPressed(true);
      }
    };

    const upHandler = (e) => {
      if (e.key === targetKey) {
        e.preventDefault();
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

export default useKeyPress;