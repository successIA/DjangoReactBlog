import React, { createContext, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from "../components/Navigation";
import Home from "../components/Home";
import "./App.scss";
import Post from "../components/Post";
import { Userprofile } from "../components/UserProfile/Userprofile";
import { Overlay2 } from "../components/Overlay";
import Login from "../components/Login";
import { useEffect } from "react";
import { CURRENT_USER_URL, ACCESS_TOKEN_KEY } from "../constants";

export const AuthContext = createContext();

export const authConfig = {};

export const getTokenConfig = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  let config = {};

  if (token) {
    config.headers = {
      Authorization: `Token ${token}`
    };
  }

  return config;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) return;

    axios
      .get(CURRENT_USER_URL, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then(res => {
        console.log(res.data);
        setCurrentUser(res.data);
      })
      .catch(err => {
        console.log(err.response);
        if (err.response && err.response.status === 401) {
          setCurrentUser(null);
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
      });
  }, []);

  return (
    <Router>
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        <Overlay2>
          <div>
            <Navigation />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/:slug" component={Post} />
              <Route exact path="/u/:username" component={Userprofile} />
            </Switch>
          </div>
        </Overlay2>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
