// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../utilities/axiosConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const res = await axiosClient.post("/login", { email, password });
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await axiosClient.post("/logout");
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const data = await axiosClient.get("/user");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
