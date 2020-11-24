import React from "react";
import logo from "../../assets/logo.svg";
import "./index.scss";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import search from "../../assets/search.svg";
import person from "../../assets/person.svg";
import person_rounded from "../../assets/person_rounded.svg";
import key from "../../assets/key.svg";

import SearchBar from "../SearchBar";
import useWindowSize from "../../hooks/useWindowSize";
import { LOGOUT_URL, ACCESS_TOKEN_KEY } from "../../constants";
import { useContext } from "react";
import { AuthContext } from "../../app/App";

const Navigation = () => {
  const [showSearchBar, setShowSearchBar] = React.useState(false);

  const [showNavbarCollapse, setShowNavbarCollapse] = React.useState(false);

  const [width] = useWindowSize();

  const navbarCollapseToggleButton = React.useRef(null);

  const isSmallScreen = width < 768;

  const authContext = useContext(AuthContext);
  const history = useHistory();

  React.useEffect(() => {
    const navbarCollapseHandler = e => {
      if (
        navbarCollapseToggleButton &&
        !navbarCollapseToggleButton.current.contains(e.target)
      ) {
        setShowNavbarCollapse(false);
      }
    };
    document.addEventListener("click", navbarCollapseHandler);
    return () => document.removeEventListener("click", navbarCollapseHandler);
  }, []);

  const handleLogoutLinkClick = () => {
    if (authContext.currentUser) {
      axios
        .post(LOGOUT_URL)
        .then(() => {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          authContext.setCurrentUser(null);
          history.push("/");
        })
        .catch(err => {
          if (err.response) console.log(err.response);
        });
    }
  };

  return (
    <div className="nav-wrapper">
      <nav className="nav">
        <div className="nav__item">
          <Link to="/">
            <img src={logo} alt="" className="svg-img" />
          </Link>
        </div>
        <div className="nav__item">
          <SearchBar
            showSearchBar={showSearchBar}
            setShowSearchBar={setShowSearchBar}
          />
        </div>
        <div className="nav__item">
          {isSmallScreen && (
            <button
              className="nav__icon-btn btn--flat"
              onClick={() => setShowSearchBar(true)}
              tabIndex="0"
            >
              <img src={search} alt="" className="svg-img" />
            </button>
          )}

          <button
            className="nav__icon-btn btn--flat"
            tabIndex="0"
            ref={navbarCollapseToggleButton}
            onClick={() => setShowNavbarCollapse(!showNavbarCollapse)}
          >
            <img src={person} alt="" className="svg-img" />
          </button>
        </div>
      </nav>

      {showNavbarCollapse ? (
        <div className="navbar-collapse">
          <ul className="navbar-collapse__list">
            {authContext.currentUser ? (
              <>
                <li className="navbar-collapse__list-item">
                  <img
                    src={person_rounded}
                    alt=""
                    className="navbar-collapse__icon"
                  />
                  <div className="navbar-collapse__text">View Profile</div>
                </li>
                <li className="navbar-collapse__list-item">
                  <img src={key} alt="" className="navbar-collapse__icon" />
                  <div className="navbar-collapse__text">Change Password</div>
                </li>
                <Link to="#">
                  <li
                    className="navbar-collapse__list-item navbar-collapse__list-item--divider"
                    onClick={handleLogoutLinkClick}
                  >
                    <div className="navbar-collapse__text">Logout</div>
                  </li>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <li className="navbar-collapse__list-item">
                  <img src={key} alt="" className="navbar-collapse__icon" />
                  <div className="navbar-collapse__text">Login</div>
                </li>
              </Link>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Navigation;
