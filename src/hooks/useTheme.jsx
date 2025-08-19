// src/theme/ThemeProvider.js
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { PALETTES, BRAND_PALETTE, PALETTE_ORDER } from "../themes/palettes";

// Kunci localStorage agar konsisten di seluruh app
const LS_KEY = "app_theme_state_v1";

// Utility: apply semua token palette jadi CSS variables di :root
function applyPaletteToElement(el, palette) {
  Object.entries(palette).forEach(([key, val]) => {
    el.style.setProperty(`--${key}`, `#${val}`);
  });
}

// Context untuk state tema
const ThemeContext = createContext(null);

/**
 * ThemeProvider
 * - Inject CSS variables ke <html> berdasarkan palette terpilih
 * - Simpan preferensi (palette, mode) di localStorage
 * - Sediakan API setPalette, setMode, token
 */
export function ThemeProvider({
  children,
  defaultPalette = "brand", // opsi awal
  defaultMode = "light",    // 'light' | 'dark'
}) {
  // Restore preferensi dari localStorage (jika ada)
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { palette: defaultPalette, mode: defaultMode };
  });

  // Sinkronkan state → DOM + localStorage
  useEffect(() => {
    const root = document.documentElement;
    const paletteObj = PALETTES[state.palette] ?? BRAND_PALETTE;
    applyPaletteToElement(root, paletteObj);
    root.setAttribute("data-theme", state.mode);
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  /** setPalette(name)
   * - Ganti palet aktif
   */
  const setPalette = useCallback((name) => {
    setState((s) => ({ ...s, palette: name }));
  }, []);

  /** setMode(mode)
   * - 'light' | 'dark' | 'toggle'
   */
  const setMode = useCallback((mode) => {
    setState((s) => ({
      ...s,
      mode: mode === "toggle" ? (s.mode === "light" ? "dark" : "light") : mode,
    }));
  }, []);

  /** cyclePalette()
   * - Ganti palet ke berikutnya sesuai PALETTE_ORDER
   */
  const cyclePalette = useCallback(() => {
    setState((s) => {
      const idx = PALETTE_ORDER.indexOf(s.palette);
      const next = PALETTE_ORDER[(idx + 1) % PALETTE_ORDER.length] || "brand";
      return { ...s, palette: next };
    });
  }, []);

  /** token('--primary-700')
   * - Ambil nilai CSS variable saat runtime
   */
  const token = useCallback((cssVarName) => {
    const root = document.documentElement;
    const val = getComputedStyle(root).getPropertyValue(cssVarName).trim();
    return val || "";
  }, []);

  const value = useMemo(
    () => ({ state, setPalette, setMode, cyclePalette, token }),
    [state, setPalette, setMode, cyclePalette, token]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** useTheme()
 * - Hook publik untuk akses/ubah tema dari komponen mana saja
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme() harus dipakai di dalam <ThemeProvider>.");
  return ctx;
}
