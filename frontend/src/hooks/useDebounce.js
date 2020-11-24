import { useState } from "react";

export const useDebounce = () => {
  const [timerId, setTimerId] = useState(undefined);

  const debounce = (callback, delay) => {
    if (timerId) clearTimeout(timerId);

    const id = setTimeout(() => {
      callback();
      setTimerId(undefined);
    }, delay);

    setTimerId(id);
  };

  return debounce;
};
