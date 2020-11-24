import { useState, useEffect } from "react";

export const KeyboardKeys = Object.freeze({
  RETURN_KEY: 13,
  ESC_KEY: 27,
  UP_ARROW_KEY: 38,
  DOWN_ARROW_KEY: 40
});

const useKeyboard = (key, preventDefault = true) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const onKeyDown = event => {
    const keyCode = event.keyCode || event.which;

    if (key === keyCode) {
      if (preventDefault) event.preventDefault();
      setKeyPressed(true);
    }
  };

  const onKeyUp = event => {
    const keyCode = event.keyCode || event.which;
    if (key === keyCode) {
      if (preventDefault) event.preventDefault();
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  return keyPressed;
};

export default useKeyboard;
