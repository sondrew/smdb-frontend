import React, { useState, useEffect, RefObject } from 'react';

const useKeyPress = (targetKey: string, ref: RefObject<HTMLDivElement>) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: { key: string }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: { key: string }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [ref]);

  return keyPressed;
};

export default useKeyPress;
