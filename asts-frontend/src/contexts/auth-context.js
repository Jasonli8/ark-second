import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userName: null,
  firstName: null,
  lastName: null,
  token: null,
  login: () => {},
  logout: () => {},
});
