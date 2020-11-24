import { useState, useEffect } from "react";
import useKeyboard, { KeyboardKeys } from "./useKeyboard";
import useWindowSize from "./useWindowSize";

const useDropdownKeyboard = (itemCount, dropdownRef = undefined) => {
  const [index, setIndex] = useState(-1);
  const [shouldListen, setShouldListen] = useState(false);

  const [_, height] = useWindowSize();

  const downKeyPressed = useKeyboard(
    KeyboardKeys.DOWN_ARROW_KEY,
    !shouldListen
  );
  const upKeyPressed = useKeyboard(KeyboardKeys.UP_ARROW_KEY, !shouldListen);
  const returnKeyPressed = useKeyboard(KeyboardKeys.RETURN_KEY, !shouldListen);
  const escKeyPressed = useKeyboard(KeyboardKeys.ESC_KEY, !shouldListen);

  const reset = shouldSet => {
    setIndex(-1);
    setShouldListen(shouldSet);
  };

  useEffect(() => {
    if (!shouldListen) return;

    if (downKeyPressed) {
      const newIndex = index >= itemCount - 1 ? 0 : index + 1;
      setIndex(newIndex);
    } else if (upKeyPressed) {
      const newIndex = index <= 0 ? itemCount - 1 : index - 1;
      setIndex(newIndex);
    }
  }, [downKeyPressed, upKeyPressed]);

  useEffect(() => {
    if (dropdownRef && dropdownRef.current && index > -1) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      if (dropdownRect.top < 0 || dropdownRect.bottom > height) {
        dropdownRef.current.scrollIntoView(true);
      }
    }
  }, [index]);

  return [index, reset, escKeyPressed, returnKeyPressed];
};

export default useDropdownKeyboard;
