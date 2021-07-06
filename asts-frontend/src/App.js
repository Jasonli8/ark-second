import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

///////////////////////////////////////////////////////////////////////////////////

import { AuthContext } from "./contexts/auth-context";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Test from "./pages/test/test";
import ASTSNavbar from "./components/Navbar/ASTSNavbar";

///////////////////////////////////////////////////////////////////////////////////

import "./App.css";

///////////////////////////////////////////////////////////////////////////////////

let logoutTimer;

///////////////////////////////////////////////////////////////////////////////////

function App() {
  const [token, setToken] = useState(false); // set to false later
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userName, setUserName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  ///////////////////////////////////////////////////////////////////////////////////

  // stores authentication data and logs in
  const login = useCallback(
    (userName, firstName, lastName, token, expirationDate) => {
      setToken(token);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userName: userName,
          firstName: firstName,
          lastName: lastName,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
      setUserName(userName);
      setFirstName(firstName);
      setLastName(lastName);
    },
    []
  );

  // clears authentication data and logs out
  const logout = useCallback(() => {
    setUserName(null);
    setFirstName(null);
    setLastName(null);
    localStorage.removeItem("userData");
    setToken(false);
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////

  // keep signed in while session is valid and not logged out
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userName,
        storedData.firstName,
        storedData.lastName,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  // auto log out once token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {
      logoutTimer = setTimeout(
        logout,
        tokenExpirationDate.getTime() - new Date().getTime()
      );
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  ///////////////////////////////////////////////////////////////////////////////////

  // allowed and disallowed paths
  let routes;
  if (!token) { // !token
    routes = (
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  } else {
    routes = (
      <>
        <ASTSNavbar />
        <Switch>
          <Route path="/" exact>
            <Test />
          </Route>
          <Redirect to="/" />
        </Switch>
        <button onClick={logout}>Logout</button>
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <main>{routes}</main>
        <footer>
          This is placeholder text for what goes inside the footer
        </footer>
      </Router>
    </AuthContext.Provider>
  );

}

///////////////////////////////////////////////////////////////////////////////////

export default App;
