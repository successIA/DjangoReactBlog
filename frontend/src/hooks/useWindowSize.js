import React, { useLayoutEffect } from "react";

const useWindowSize = () => {
  const [size, setSize] = React.useState([
    window.innerWidth,
    window.innerHeight
  ]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export default useWindowSize;
