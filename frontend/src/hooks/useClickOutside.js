import { useState, useEffect } from "react";

const useClickOutside = activeBlockRef => {
  const [clickedOutside, setClickedOutside] = useState(false);

  useEffect(() => {
    // console.log("OUT ADDED");
    const clickOutsideHandler = e => {
      // console.log("CLICKED");
      // console.log("activeBlockRef", activeBlockRef);
      // console.log("activeBlockRef.current", activeBlockRef.current);

      if (
        activeBlockRef &&
        activeBlockRef.current &&
        !activeBlockRef.current.contains(e.target)
      ) {
        setClickedOutside(true);
      }
    };

    document.addEventListener("click", clickOutsideHandler);

    return () => document.removeEventListener("click", clickOutsideHandler);
  }, [activeBlockRef]);

  return [clickedOutside, setClickedOutside];
};

export default useClickOutside;
