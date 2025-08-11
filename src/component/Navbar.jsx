import React from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdArrowBack, MdSettings } from "react-icons/md";

/** Utility kecil */
const cx = (...a) => a.filter(Boolean).join(" ");

const baseWrap = "w-full flex items-center justify-between";
const baseBar  = "bg-white px-4 lg:px-6 py-3 lg:py-4 border-b shadow-sm";
const baseSticky = "sticky top-0 z-40";

/** Tombol ikon */
function IconBtn({ as = "button", to, onClick, title, className, children }) {
  const cls = cx(
    "inline-flex items-center justify-center rounded-full w-12 h-12",
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

/**
 * actions: [
 *  { type:'link', to:'/pesanan', title:'Pesanan', className:'bg-orange-400 text-white', icon: <.../> },
 *  { type:'button', onClick:fn, title:'Favorit', className:'bg-green-600 text-white', icon:<.../> },
 *  { type:'button', onClick:fn, title:'Batalkan', className:'border border-red-500 text-red-500 px-6 py-2 rounded-full font-semibold text-lg', label:'Batalkan' },
 *  { type:'button', onClick:fn, title:'Pengaturan', icon:<MdSettings size={26}/>, className:'w-12 h-12 text-gray-700 hover:bg-gray-100 rounded-full' }
 * ]
 */
export default function Navbar({
  variant = "page",          // 'pos' | 'admin' | 'page'
  title = "",
  pageName,                  // alias untuk title kalau kepake
  backTo,                    // string | undefined
  onToggleSidebar,           // () => void
  sticky = true,
  rightExtra = null,         // node tambahan di kanan
  actions = [],              // array tombol kanan
}) {
  const finalTitle = title || pageName || "";

  // Kiri: Back / Burger / Title
  const Left = (
    <div className="flex items-center gap-3">
      {backTo ? (
        typeof backTo === "function" ? (
          <button
            onClick={backTo}
            className="text-2xl text-gray-700 hover:text-gray-900"
            title="Kembali"
          >
            <MdArrowBack size={28} />
          </button>
        ) : (
          <Link
            to={backTo}
            className="text-2xl text-gray-700 hover:text-gray-900"
            title="Kembali"
          >
            <MdArrowBack size={28} />
          </Link>
        )
      ) : onToggleSidebar ? (
        <button onClick={onToggleSidebar} title="Toggle Sidebar" className="text-gray-700 hover:text-gray-900">
          <MdMenu size={28} />
        </button>
      ) : null}

      <h1 className={cx("font-bold",
        variant === "pos" ? "text-2xl" : "text-xl lg:text-2xl"
      )}>
        {finalTitle}
      </h1>
    </div>
  );

  // Kanan: actions + rightExtra
  const Right = (
    <div className="flex items-center gap-3">
      {rightExtra}
      {actions.map((a, i) => {
        // Ada dua gaya: tombol ikon bulat atau tombol berlabel
        if (a.label) {
          return (
            <button
              key={i}
              onClick={a.onClick}
              className={cx(
                "px-6 py-2 rounded-full font-semibold text-lg",
                a.className
              )}
              title={a.title}
            >
              {a.label}
            </button>
          );
        }
        // link/button ikon bulat
        return (
          <IconBtn
            key={i}
            as={a.type === "link" ? "link" : "button"}
            to={a.to}
            onClick={a.onClick}
            title={a.title}
            className={a.className || "w-12 h-12 text-gray-700 hover:bg-gray-100"}
          >
            {a.icon || <MdSettings size={24} />}
          </IconBtn>
        );
      })}
    </div>
  );

  return (
    <nav className={cx(baseBar, baseWrap, sticky && baseSticky)}>
      {Left}
      {Right}
    </nav>
  );
}