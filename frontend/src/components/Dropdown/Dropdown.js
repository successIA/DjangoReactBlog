import React, { useState, useEffect, useRef } from "react";
import { uuid } from "uuidv4";

import "./index.scss";
import Overlay from "../Overlay";
import useWindowSize from "../../hooks/useWindowSize";
import useClickOutside from "../../hooks/useClickOutside";
import useWindowPosition from "../../hooks/useWindowPosition";
import useDropdownKeyboard from "../../hooks/useDropdownKeyboard";

const BOTTOM = "BOTTOM";
const TOP = "TOP";

export const DropdownWrapper = ({ children }) => (
  <div style={{ position: "relative" }}>{children}</div>
);

const Dropdown = ({
  toggleElement,
  data,
  // ownerId,
  onHideDropDown,
  onDropdownRowClick,
  leftAligned
}) => {
  const dropdownRef = useRef(null);

  const [clickedOutside, setClickedOutside] = useClickOutside(dropdownRef);

  const [scrollPosition] = useWindowPosition(dropdownRef);

  const [width, height] = useWindowSize();

  const [
    dropdownListItemIndex,
    setDropdownKeyboard,
    dropdownKeyboardEscKeyPressed
  ] = useDropdownKeyboard(data.length, dropdownRef);

  const [dropdownPos, setDropdownPos] = useState(BOTTOM);

  const isSmallScreen = width < 768;

  const toggleElementHeight =
    toggleElement && toggleElement.current
      ? toggleElement.current.getBoundingClientRect().height
      : 0;

  const dropdownHeight = dropdownRef.current
    ? dropdownRef.current.getBoundingClientRect().height
    : 0;

  const verticalSpacing = 12;

  const initialDropdownStyle = isSmallScreen
    ? {
        position: "absolute",
        bottom: 0,
        left: 0
      }
    : {
        position: "absolute",
        top: toggleElementHeight,
        right: leftAligned ? "auto" : 0,
        left: leftAligned ? 0 : "auto",
        bottom: "auto",
        left: "auto"
      };

  const desktopTopDropdownStyle = {
    position: "absolute",
    right: leftAligned ? "auto" : 0,
    left: leftAligned ? 0 : "auto",
    transform: `translateY(calc(-100% - ${toggleElementHeight}px - ${verticalSpacing}px))`
  };

  const [dropdownStyle, setDropdownStyle] = useState(initialDropdownStyle);

  useEffect(() => setDropdownKeyboard(true), []);

  useEffect(() => {
    if (clickedOutside || dropdownKeyboardEscKeyPressed) closeDropdown();
  }, [clickedOutside, dropdownKeyboardEscKeyPressed]);

  useEffect(() => {
    if (dropdownHeight > 0 && !isSmallScreen) {
      if (
        dropdownPos === BOTTOM &&
        height - scrollPosition < dropdownHeight + verticalSpacing
      ) {
        setDropdownPos(TOP);
        setDropdownStyle(desktopTopDropdownStyle);
      } else if (
        dropdownPos === TOP &&
        height - scrollPosition >
          2 * (dropdownHeight + toggleElementHeight + verticalSpacing)
      ) {
        setDropdownPos(BOTTOM);
        setDropdownStyle(initialDropdownStyle);
      }
    }
  }, [width, height, scrollPosition]);

  const closeDropdown = () => {
    setDropdownKeyboard(false);
    setClickedOutside(false);
    onHideDropDown();
  };

  const visibility = isSmallScreen
    ? "visible"
    : dropdownHeight !== 0 && scrollPosition !== undefined
    ? "visible"
    : "hidden";

  const dropdown = (
    <div
      ref={dropdownRef}
      className="dropdown"
      style={{ ...dropdownStyle, visibility }}
    >
      {data.map((dropdownRowData, index) => {
        return (
          <div
            key={uuid()}
            className={
              dropdownListItemIndex === index
                ? "dropdown__row dropdown__row--bg-gray"
                : "dropdown__row"
            }
            onClick={() =>
              onDropdownRowClick(dropdownRowData.key /*, ownerId */)
            }
          >
            {dropdownRowData.icon ? (
              <div className="dropdown__row-item">
                <div className="dropdown__row-icon">
                  <img src={dropdownRowData.icon} alt="" />
                </div>
              </div>
            ) : null}

            <div className="dropdown__row-item">
              <div className="dropdown__row-text">{dropdownRowData.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return isSmallScreen ? (
    <Overlay activeBlockRef={dropdownRef} onOverlayClick={onHideDropDown}>
      {dropdown}
    </Overlay>
  ) : (
    dropdown
  );
};

export default Dropdown;
