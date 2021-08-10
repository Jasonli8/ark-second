import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Suspense,
} from "react";
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
import Footer from "./components/Footer/Footer";
import ASTSNavbar from "./components/Navbar/ASTSNavbar";
import LoadingSpinner from "./components/Loading/LoadingSpinner";

import "./App.css";

const Home = React.lazy(() => import("./pages/home/Home"));
const Fund = React.lazy(() => import("./pages/fund/Fund"));
const Ticker = React.lazy(() => import("./pages/ticker/Ticker"));
const UserRecovery = React.lazy(() =>
  import("./pages/recovery/user/UserRecovery")
);
const PasswordRecovery = React.lazy(() =>
  import("./pages/recovery/password/PasswordRecovery")
);
const UpdatePassword = React.lazy(() =>
  import("./pages/recovery/password/UpdatePassword")
);

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
          <Suspense fallback={<LoadingSpinner />}>
            {token ? (
              <>
                <ASTSNavbar />
                <Switch>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                  <Route path="/update-password" exact>
                    <UpdatePassword />
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
                <Footer />
              </>
            ) : (
              <Switch>
                <Route path="/login" exact>
                  <Login />
                </Route>
                <Route path="/signup" exact>
                  <Signup />
                </Route>
                <Route path="/recovery/user" exact>
                  <UserRecovery />
                </Route>
                <Route path="/recovery/password" exact>
                  <PasswordRecovery />
                </Route>
                <Route>
                  <Redirect to="/login" />
                </Route>
              </Switch>
            )}
          </Suspense>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default App;
