import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { setLogoutHandler } from "../../axios";

export const AuthContext = createContext();

export const DEFAULT_PROFILE_PICTURE =
  "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.webp";
export const DEFAULT_COVER_PICTURE =
  "https://img.freepik.com/free-vector/gradient-blue-background_23-2149354574.jpg?semt=ais_hybrid";

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const loginUrl = `${import.meta.env.VITE_API_URL}/auth/login`;

  const login = async (inputs) => {
    const res = await axios.post(loginUrl, inputs, {
      withCredentials: true,
    });

    // Update the currentUser state with the response data
    setCurrentUser(res.data);
  };

  // Update localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Function to update current user data
  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // Function to log out user
  const logoutUrl = `${import.meta.env.VITE_API_URL}/auth/logout`;
  const logout = async () => {
    try {
      await axios.post(logoutUrl, {}, { withCredentials: true });
    } catch (err) {
      // Ignore errors, just clear local state
    }
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Register logout as the global handler for axios 401/403
  setLogoutHandler(logout);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        updateCurrentUser,
        DEFAULT_PROFILE_PICTURE,
        DEFAULT_COVER_PICTURE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
