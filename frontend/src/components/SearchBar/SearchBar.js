import React, { useState, useEffect, useRef } from "react";
import Overlay from "../Overlay";

import search from "../../assets/search.svg";
import close from "../../assets/close.svg";

import "./index.scss";
import useWindowSize from "../../hooks/useWindowSize";
import { uuid } from "uuidv4";
import searchSuggestions from "../../data/searchSuggestions";
import { filterSuggestion } from "../../utils";
import { useDebounce } from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
import useDropdownKeyboard from "../../hooks/useDropdownKeyboard";

const SearchBar = ({ showSearchBar, setShowSearchBar }) => {
  const [input, setInput] = useState("");

  const [suggestions, setsuggestions] = useState([]);

  const searchDropdownRef = useRef(null);

  const [
    dropdownListItemIndex,
    setDropdownKeyboard,
    dropdownKeyboardEscKeyPressed,
    dropdownKeyboardReturnKeyPressed
  ] = useDropdownKeyboard(suggestions.length, searchDropdownRef);

  const [showSearchSuggestionBox, setShowSearchSuggestionBox] = useState(false);

  const debounce = useDebounce();

  const [width] = useWindowSize();

  const searchFormRef = useRef(null);
  const searchInputRef = useRef(null);

  const [clickedOutside, setClickedOutside] = useClickOutside(searchFormRef);

  const isSmallScreen = width < 768;

  // Focus search input on Mobile screens
  useEffect(() => {
    if (
      isSmallScreen &&
      showSearchBar &&
      searchInputRef &&
      searchInputRef.current
    ) {
      searchInputRef.current.focus();
    }
  }, [isSmallScreen, showSearchBar]);

  // keyboard arrow events
  useEffect(() => {
    if (suggestions.length > 0) setDropdownKeyboard(true);
    else setDropdownKeyboard(false);
  }, [suggestions]);

  useEffect(() => {
    debounce(handleDebouncedInputChange, 250);
  }, [input]);

  useEffect(() => {
    if (dropdownKeyboardReturnKeyPressed) {
      setInput(suggestions[dropdownListItemIndex]);
      setShowSearchSuggestionBox(false);
    }
  }, [dropdownKeyboardReturnKeyPressed]);

  useEffect(() => {
    if (dropdownKeyboardEscKeyPressed) {
      closeSearchBar();
      setDropdownKeyboard(false);
    }
  }, [dropdownKeyboardEscKeyPressed]);

  useEffect(() => {
    if (!isSmallScreen && clickedOutside) {
      closeSearchBar();
      setClickedOutside(false);
    }
  }, [clickedOutside]);

  const handleDebouncedInputChange = () => {
    if (!input) return;
    setsuggestions(filterSuggestion(searchSuggestions, input));
  };

  const handleSearchInputChange = e => {
    setInput(e.target.value);
    setShowSearchSuggestionBox(true);
  };

  const handleOverlayClick = () => {
    closeSearchBar();
  };

  const handleCancelClick = () => {
    closeSearchBar();
  };

  const closeSearchBar = () => {
    setShowSearchBar(false);
    setShowSearchSuggestionBox(false);
    setDropdownKeyboard(false);
  };

  const form = (
    <form ref={searchFormRef} action="" className="search-bar__form">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="What are you looking for?"
        className="search-bar__form-input"
        value={input}
        onChange={handleSearchInputChange}
      />

      <button className="search-bar__search-btn btn--flat">
        <img src={search} alt="" className=" svg-img" />
      </button>
      <button
        className="search-bar__cancel-btn btn--flat"
        onClick={handleCancelClick}
      >
        <img src={close} alt="" className="svg-img" />
      </button>
    </form>
  );

  const dropdownRowclassName = "search-bar__suggest-dropdown-row";
  const searchSuggestionBox = showSearchSuggestionBox && (
    <ul className="search-bar__suggest-dropdown" ref={searchDropdownRef}>
      {suggestions.map((suggestion, index) => {
        return (
          <li
            key={uuid()}
            className={
              dropdownListItemIndex === index
                ? `${dropdownRowclassName} ${dropdownRowclassName}--bg-gray`
                : `${dropdownRowclassName}`
            }
          >
            <a href="#" className="search-bar__suggest-dropdown-row-text">
              {suggestion}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const searchBar = (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        {form}
        {showSearchSuggestionBox && searchSuggestionBox}
      </div>
    </div>
  );

  return (
    <>
      {!isSmallScreen ? (
        searchBar
      ) : showSearchBar ? (
        <Overlay
          activeBlockRef={searchFormRef}
          onOverlayClick={handleOverlayClick}
        >
          {searchBar}
        </Overlay>
      ) : null}
    </>
  );
};

export default SearchBar;
