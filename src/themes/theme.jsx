import React, {useContext} from "react";
import { useTheme } from "../hooks/useTheme";

const theme = useTheme();
const token = theme.token; 

// Brand palette (dengan fallback aman)
export  const PRI200 = token("--primary-200") || "#B2B0E8"; // Ungu Muda
export  const PRI400 = token("--primary-400") || "#7A85C1"; // Biru Abu
export  const PRI700 = token("--primary-700") || "#3B38A0"; // Biru Tua
export  const PRI800 = token("--primary-800") || "#1A2A80"; // Navy

export  const BG = token("--bg") || "#F8FAFC";
export  const SUR = token("--surface") || "#FFFFFF";
export  const BRD = token("--border") || "#E5E7EB";
export  const TXT = token("--text") || "#0F172A";
export  const MUT = token("--muted") || "#64748B";

// Gradient util
export  const gradientHero = `linear-gradient(135deg, ${PRI200} 0%, ${PRI700} 50%, ${PRI800} 100%)`;
