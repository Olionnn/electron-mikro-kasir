import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Default konfigurasi navbar.
 * uiPreset baru: 'solid' | 'translucent' | 'compact'
 */
const defaultConfig = {
  variant: "page",   // 'page' | 'admin' | 'pos'
  uiPreset: "solid", // gaya bar default
  title: "",
  backTo: null,      // string | (() => void) | null
  actions: [],       // array tombol kanan
  rightExtra: null,  // node tambahan kanan
};

const NavbarContext = createContext({
  config: defaultConfig,
  // setConfig: terima partial object / updater function
  setConfig: (_c) => {},
  // reset: kembalikan ke defaultConfig
  reset: () => {},
});

/**
 * NavbarProvider
 * - Membungkus App agar halaman dapat mendaftarkan konfigurasi navbar.
 */
export function NavbarProvider({ children }) {
  const [config, setConfigState] = useState(defaultConfig);

  /** setConfig
   * - Terima object partial atau function(prev)=>newState.
   * - Memudahkan halaman update sebagian properti saja.
   */
  const setConfig = (partial) => {
    setConfigState((prev) =>
      typeof partial === "function" ? partial(prev) : { ...prev, ...partial }
    );
  };

  /** reset
   * - Mengembalikan konfigurasi navbar ke default (dipanggil saat unmount).
   */
  const reset = () => setConfigState(defaultConfig);

  return (
    <NavbarContext.Provider value={{ config, setConfig, reset }}>
      {children}
    </NavbarContext.Provider>
  );
}

/** useNavbarContext
 * - Akses context raw (jarang dibutuhkan di page biasa).
 */
export function useNavbarContext() {
  return useContext(NavbarContext);
}

/**
 * useNavbar
 * - Dipanggil di dalam komponen halaman.
 * - Auto-apply config ketika mount, dan auto-reset saat unmount.
 * - deps opsional: re-apply saat handler/props berubah.
 *
 * Contoh:
 * useNavbar({ title:"Dashboard", actions:[...] }, [actions])
 */
export function useNavbar(newConfig, deps = []) {
  const { setConfig, reset } = useNavbarContext();

  useEffect(() => {
    if (newConfig) setConfig(newConfig);
    return () => reset();
    // deps dikontrol caller, disable exhaustive-deps by design
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
