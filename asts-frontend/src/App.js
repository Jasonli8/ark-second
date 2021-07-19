import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

///////////////////////////////////////////////////////////////////////////////////

import { AuthContext } from "./contexts/auth-context";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Fund from './pages/fund/Fund'
import Ticker from "./pages/ticker/Ticker";
import Test from './pages/test/test'
import ASTSNavbar from "./components/Navbar/ASTSNavbar";

///////////////////////////////////////////////////////////////////////////////////

import "./App.css";

///////////////////////////////////////////////////////////////////////////////////

let logoutTimer;

///////////////////////////////////////////////////////////////////////////////////

function App() {
  let validated = useRef(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [token, setToken] = useState(false);
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
      validated.current = token ? true : false;
      console.log(validated);
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
    validated.current = false;
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////

  const loadUserData = () => {
    console.log("loading user data");
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
  };

  // keep signed in while session is valid and not logged out
  useEffect(() => {
    loadUserData();
    setIsLoadingUser(false);
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
  console.log(validated);

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
        {!isLoadingUser && (
          <>
            {token ? (
              <>
                <ASTSNavbar />
                <Switch>
                  <Route path="/" exact>
                    <Test />
                  </Route>
                  <Route path="/history/:ticker" exact>
                    <Ticker />
                  </Route>
                  <Route path="/fund/:fundName" exact>
                    <Fund />
                  </Route>
                  <Route>
                    <Redirect to="/" />
                  </Route>
                </Switch>
                <button onClick={logout}>Logout</button>
                <footer>
                  This is placeholder text for what goes inside the footer
                </footer>
              </>
            ) : (
              <Switch>
                <Route path="/login" exact>
                  <Login />
                </Route>
                <Route path="/signup" exact>
                  <Signup />
                </Route>
                <Route>
                  <Redirect to="/login" />
                </Route>
              </Switch>
            )}
          </>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default App;
