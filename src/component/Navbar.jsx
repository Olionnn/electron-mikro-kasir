// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdArrowBack, MdSettings, MdDarkMode, MdLightMode, MdColorLens } from "react-icons/md";
import cx from "../utils/utils";
import { useTheme } from "../hooks/useTheme.jsx"; 

const baseWrap = "w-full flex items-center justify-between";
const baseBar  = "px-4 lg:px-6 py-3 lg:py-4 border-b shadow-sm";
const baseSticky = "sticky top-0 z-40";

/** IconBtn
 * - Tombol ikon reusable (link / button)
 */
function IconBtn({ as = "button", to, onClick, title, className, children }) {
  const cls = cx(
    "inline-flex items-center justify-center rounded-full w-11 h-11 transition-colors",
    className
  );
  if (as === "link") {
    return (
      <Link to={to} className={cls} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls} title={title}>
      {children}
    </button>
  );
}

/** Navbar
 * Props utama:
 * - variant: 'pos' | 'admin' | 'page'
 * - title / pageName
 * - backTo: string | function (opsional)
 * - onToggleSidebar (opsional)
 * - sticky: boolean
 * - rightExtra: node tambahan kanan (opsional)
 * - actions: array tombol kanan
 *
 * Perombakan:
 * - Warna bar mengikuti CSS variables tema (elegan, B2B).
 * - Tambah tombol Theme: cycle palette + toggle dark/light.
 */
export default function Navbar({
  variant = "page",
  title = "",
  pageName,
  backTo,
  onToggleSidebar,
  sticky = true,
  rightExtra = null,
  actions = [],
}) {
  const finalTitle = title || pageName || "";

  // ⬇️ Ambil kontrol tema global
  const { state, cyclePalette, setMode } = useTheme();
  const isDark = state.mode === "dark";

  // Kiri: Back / Burger / Title
  const Left = (
    <div className="flex items-center gap-3">
      {backTo ? (
        typeof backTo === "function" ? (
          <button
            onClick={backTo}
            className="text-2xl hover:opacity-80"
            title="Kembali"
            style={{ color: "var(--text)" }}
          >
            <MdArrowBack size={26} />
          </button>
        ) : (
          <Link
            to={backTo}
            className="text-2xl hover:opacity-80"
            title="Kembali"
            style={{ color: "var(--text)" }}
          >
            <MdArrowBack size={26} />
          </Link>
        )
      ) : onToggleSidebar ? (
        <button
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          className="hover:opacity-80"
          style={{ color: "var(--text)" }}
        >
          <MdMenu size={26} />
        </button>
      ) : null}

      <h1
        className={cx("font-semibold tracking-tight", variant === "pos" ? "text-2xl" : "text-xl lg:text-2xl")}
        style={{ color: "var(--text)" }}
      >
        {finalTitle}
      </h1>
    </div>
  );

  // Kanan: Theme buttons + actions + rightExtra
  const Right = (
    <div className="flex items-center gap-2">
      {/* Tombol ganti palette (cycle) */}
      <IconBtn
        onClick={cyclePalette}
        title={`Ganti Tema (palette: ${state.palette})`}
        className="hover:bg-opacity-10"
        style={{
          color: "var(--text)",
          backgroundColor: "transparent",
        }}
      >
        <MdColorLens size={22} />
      </IconBtn>

      {/* Tombol toggle mode (light/dark) */}
      {/* <IconBtn
        onClick={() => setMode("toggle")}
        title={`Mode: ${isDark ? "Dark" : "Light"}`}
        className="hover:bg-opacity-10"
        style={{
          color: "var(--text)",
          backgroundColor: "transparent",
        }}
      >
        {isDark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
      </IconBtn> */}

      {rightExtra}

      {actions.map((a, i) => {
        // Tombol berlabel
        if (a.label) {
          return (
            <button
              key={i}
              onClick={a.onClick}
              className={cx("px-5 py-2 rounded-full font-medium", a.className)}
              title={a.title}
              style={{
                // Default brand button jika className tidak override
                background: a.className ? undefined : "var(--primary-700)",
                color: a.className ? undefined : "#fff",
              }}
            >
              {a.label}
            </button>
          );
        }
        // Link/button ikon
        return (
          <IconBtn
            key={i}
            as={a.type === "link" ? "link" : "button"}
            to={a.to}
            onClick={a.onClick}
            title={a.title}
            className={a.className || ""}
            style={{ color: "var(--text)" }}
          >
            {a.icon || <MdSettings size={22} />}
          </IconBtn>
        );
      })}
    </div>
  );

  return (
    <nav
      className={cx(baseBar, baseWrap, sticky && baseSticky)}
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {Left}
      {Right}
    </nav>
  );
}
