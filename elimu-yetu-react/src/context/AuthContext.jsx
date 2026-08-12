import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";
// create context
const AuthContext = createContext();

// provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token,     setToken]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // load user from localStorage on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // verify the token is still valid by calling /api/auth/me
      getMe(savedToken)
        .then((data) => {
          setUser(data.user);
          setToken(savedToken);
        })
        .catch(() => {
          // if token is invalid, remove it from localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => {
          setIsLoading(false)
        });
    }else {
      setIsLoading(false);
    }
  }, []);

  // login function
  // called after successful login or OTP verification
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // called by ProfileSettings to update user details
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};