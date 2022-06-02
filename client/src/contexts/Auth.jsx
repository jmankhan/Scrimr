import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // reset error state if path changes
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  // check if user is logged in initially
  useEffect(() => {
    const user = API.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({ user, error }), [user, error]);

  async function login(email, password) {
    try {
      const { user } = await API.login(email, password);
      setUser(user);
    } catch (err) {
      setError(err.response.data.message);
      throw err;
    }
  }

  async function register(email, name, password) {
    try {
      const { user } = await API.register(email, name, password);
      setUser(user);
    } catch (err) {
      setError(err.response.data.message);
      throw err;
    }
  }

  function logout() {
    setUser(null);
    API.logout();
  }

  return (
    <AuthContext.Provider value={{ value, login, logout, register, error, loading }}>{children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
