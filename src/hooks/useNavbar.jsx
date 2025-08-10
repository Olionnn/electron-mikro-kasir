// src/contexts/navbar.js
import React, { createContext, useContext, useEffect, useState } from "react";

const defaultConfig = {
  variant: "page",   // 'page' | 'admin' | 'pos'
  title: "",
  backTo: null,
  actions: [],
  rightExtra: null,
};

const NavbarContext = createContext({
  config: defaultConfig,
  setConfig: (_c) => {},
  reset: () => {},
});

export function NavbarProvider({ children }) {
  const [config, setConfigState] = useState(defaultConfig);

  const setConfig = (partial) => {
    setConfigState((prev) =>
      typeof partial === "function" ? partial(prev) : { ...prev, ...partial }
    );
  };

  const reset = () => setConfigState(defaultConfig);

  return (
    <NavbarContext.Provider value={{ config, setConfig, reset }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext() {
  return useContext(NavbarContext);
}

/**
 * useNavbar:
 * - panggil di dalam komponen halaman
 * - otomatis apply saat mount & reset saat unmount
 * - deps opsional untuk re-apply saat berubah (mis. handler)
 */
export function useNavbar(newConfig, deps = []) {
  const { setConfig, reset } = useNavbarContext();

  useEffect(() => {
    if (newConfig) setConfig(newConfig);
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // sengaja: user kontrol deps sendiri
}