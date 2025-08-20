// src/theme/palettes.js
// Kumpulan palette brand dalam format cocok untuk CSS variables.
// Gunakan hex tanpa # agar mudah di-inject sebagai CSS var (# ditambah saat apply).



export const BRAND_PALETTE = {
  "primary-200": "B2B0E8", // Ungu Muda
  "primary-400": "7A85C1", // Biru Abu
  "primary-700": "3B38A0", // Biru Tua
  "primary-800": "1A2A80", // Navy Gelap

  "bg": "F8FAFC",
  "surface": "FFFFFF",
  "border": "E5E7EB",
  "text": "0F172A",
  "muted": "64748B",

  "success": "16A34A",
  "warning": "D97706",
  "danger":  "DC2626",
  "info":    "2563EB",
};

export const TEAL_PALETTE = {
  "primary-200": "99F6E4",
  "primary-400": "2DD4BF",
  "primary-700": "0D9488",
  "primary-800": "115E59",
  "bg": "F8FAFC",
  "surface": "FFFFFF",
  "border": "E5E7EB",
  "text": "0F172A",
  "muted": "64748B",
  "success": "16A34A",
  "warning": "D97706",
  "danger":  "DC2626",
  "info":    "2563EB",
};

export const SUNSET_PALETTE = {
  "primary-200": "FED7AA",
  "primary-400": "FB923C",
  "primary-700": "C2410C",
  "primary-800": "7C2D12",
  "bg": "FFF7ED",
  "surface": "FFFFFF",
  "border": "F3F4F6",
  "text": "111827",
  "muted": "6B7280",
  "success": "16A34A",
  "warning": "D97706",
  "danger":  "DC2626",
  "info":    "2563EB",
};

export const EMERALD_PALETTE = {
  "primary-200": "A7F3D0",
  "primary-400": "34D399",
  "primary-700": "047857",
  "primary-800": "065F46",
  "bg": "F8FAFC",
  "surface": "FFFFFF",
  "border": "E5E7EB",
  "text": "0F172A",
  "muted": "64748B",
  "success": "16A34A",
  "warning": "D97706",
  "danger":  "DC2626",
  "info":    "2563EB",
};


// Index palet yang tersedia
export const PALETTES = {
  brand: BRAND_PALETTE,
  teal: TEAL_PALETTE,
  sunset: SUNSET_PALETTE,
  emerald: EMERALD_PALETTE,
};

// Urutan cycling palet ketika user klik tombol ganti tema
export const PALETTE_ORDER = ["brand", "teal", "sunset", "emerald"];
