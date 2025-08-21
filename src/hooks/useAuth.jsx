import { useEffect, useRef, useState, useMemo, useCallback, useContext, createContext } from "react";
import { normalizeRow } from "../utils/utils";
import { getAuth, setAuth, clearAuth, isAuthenticated, getAccessToken } from "../utils/jwt";


const authIpc = {
  login: (data) => window.electronAPI.login(data),
  register: (data) => window.electronAPI.register(data),
};

export function useAuth() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {

      const res = await authIpc.login(email, password);
      
      if (!res?.success) throw new Error(res?.error || "Login failed");

      const data = res.data?.data || res.data?.items || null;
      console.log("Login response:", res);
      setItems(data);
      localStorage.setItem("au", JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
        
      const res = await authIpc.register(userData);
      if (!res?.success) throw new Error(res?.error || "Registration failed");

      const data = res.data?.data || res.data?.items || null;
      setItems(data);
      return data;
    } catch (err) {
      setError(err?.message || "Registration failed");
      throw err; // lempar lagi untuk flash/alert di caller
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, login, register };
}


const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(() => getAuth());
  const [ready, setReady] = useState(false);

  // Hydrate dari storage saat mount
  useEffect(() => { setAuthState(getAuth()); setReady(true); }, []);

  const loginOk = useCallback((payload) => {
    setAuth(payload);
    setAuthState(payload);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuthState(null);
  }, []);

  const value = useMemo(() => ({
    auth,
    ready,
    isAuthed: !!auth?.accesstoken && !isAuthenticated() ? false : !!auth?.accesstoken,
    token: getAccessToken(),
    loginOk,
    logout,
  }), [auth, ready]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuthController() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthController must be used inside <AuthProvider>");
  return ctx;
}