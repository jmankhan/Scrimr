import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import API from "../api";
const AuthContext = createContext();

export function AuthProvider({ initialUser, children }) {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const value = useMemo(() => ({ user, error }), [user, error]);

  // reset error state if path changes
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  async function login(email, password) {
    try {
      setLoading(true);
      await API.login(email, password);
      const response = await API.getCurrentUser();
      setUser(response.user);
    } catch (err) {
      setError(err.response.data.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(props) {
    try {
      const { email, summonerName, password } = props;
      setLoading(true);
      const response = await API.register(email, summonerName, password);
      setUser(response.user);
      return response.message;
    } catch (err) {
      setError(err.response.data.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      setUser(null);
      await API.logout();
    } catch (err) {
      setError(err.response.data.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ value, login, logout, register, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
