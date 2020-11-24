import React from "react";

import "./index.scss";

const OverlayContext = React.createContext({
  show: () => {},
  hide: () => {}
});

export const Overlay2 = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);

  const show = () => setIsOverlayVisible(true);
  const hide = () => setIsOverlayVisible(false);

  return (
    <OverlayContext.Provider value={{ show, hide }}>
      {isOverlayVisible ? (
        <div className="overlay">{children}</div>
      ) : (
        <>{children}</>
      )}
    </OverlayContext.Provider>
  );
};

const Overlay = ({
  children,
  noBackground,
  activeBlockRef,
  onOverlayClick
}) => {
  return (
    <div
      className={noBackground ? "overlay overlay--no-background" : "overlay"}
      onClick={e => {
        console.log("OVLAY CLICKED");
        console.log("activeBlockRef", activeBlockRef);
        if (activeBlockRef)
          console.log("activeBlockRef.current", activeBlockRef.current);
        if (
          activeBlockRef &&
          activeBlockRef.current &&
          !activeBlockRef.current.contains(e.target)
        ) {
          onOverlayClick();
        }

        // if (!activeBlockRef.current.contains(e.target)) {
        //   onOverlayClick();
        // }
      }}
    >
      {children}
    </div>
  );
};

export default Overlay;
