import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../app/App";
import "./index.scss";
import { LOGIN_URL, ACCESS_TOKEN_KEY } from "../../constants";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nonFieldErrors, setNonFieldErrors] = useState([]);
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const handleFormSubmit = e => {
    e.preventDefault();

    setIsLoading(true);
    setNonFieldErrors([]);

    axios
      .post(LOGIN_URL, { username, password })
      .then(res => {
        setIsLoading(false);

        console.log(res.data);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.data.key);
        authContext.setCurrentUser(res.data.user);

        history.push("/");
      })
      .catch(error => {
        setIsLoading(false);
        if (error.response) {
          console.log("Something went wrong:", error.response.data);
          if (error.response.data && error.response.data.non_field_errors) {
            setNonFieldErrors(error.response.data.non_field_errors);
          }
        }
      });
  };

  return (
    <div className="container">
      <div className="container__row">
        <div className="login-form-wrapper">
          <form className="login-form" onSubmit={handleFormSubmit}>
            <h3 className="login-form__title">Login</h3>

            {nonFieldErrors.length === 1 ? (
              <div className="login-form__non-field-errors-container">
                {nonFieldErrors[0]}
              </div>
            ) : nonFieldErrors.length > 0 ? (
              <div className="login-form__non-field-errors-container">
                <ul>
                  {nonFieldErrors.map(error => (
                    <li>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="login-form__group">
              <label htmlFor="username" className="login-form__label">
                Username<span className="login-form__label-asterisk">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="login-form__input"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="password" className="login-form__label">
                Password<span className="login-form__label-asterisk">*</span>
              </label>
              <input
                type="password"
                className="login-form__input"
                name="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="login-form__action-bar">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={
                  username.trim().length === 0 && password.trim().length === 0
                    ? true
                    : false
                }
              >
                Login
                {isLoading ? (
                  <span className="login-form__btn-loader"></span>
                ) : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
