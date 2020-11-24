import { useLayoutEffect, useState } from "react";

export default function useWindowPosition(element) {
  const [scrollPosition, setPosition] = useState(undefined);

  useLayoutEffect(() => {
    let isScrolling;

    function updatePosition() {
      clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        if (element && element.current) {
          const top = element.current.getBoundingClientRect().top;
          setPosition(top);
        }
      });
    }

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    updatePosition();
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [element]);
  return [scrollPosition, setPosition];
}
