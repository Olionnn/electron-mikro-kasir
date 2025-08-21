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
  const [error, setError]   = useState(null);

  // TERIMA SATU OBJEK { email, password }
  const login = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authIpc.login(payload);

      if (!res?.success) throw new Error(res?.error || "Login failed");

      // Backend kamu mengirim: createSuccessResponse("Login successful", { data: {...}, pagination: {} })
      const out = res?.data?.data ?? res?.data ?? null;
      if (!out?.accesstoken) throw new Error("Token tidak ditemukan pada respons login");

      localStorage.setItem("au", JSON.stringify(out));
      setItems(out);
      return out;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);        // <- string, supaya Alert tampil
      throw new Error(msg); // <- biar onSubmit catch dan setLocalError jalan
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
      const out = res?.data?.data ?? res?.data ?? null;

      localStorage.setItem("au", JSON.stringify(out));

      setItems(out);
      return out;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw new Error(msg);
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