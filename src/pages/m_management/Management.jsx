// src/pages/ManagementPage.premium.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BiCategory,
  BiCategoryAlt,
  BiBox,
  BiUser,
  BiPackage,
  BiSolidDiscount,
  BiMoneyWithdraw,
  BiMoney,
  BiSolidOffer,
} from "react-icons/bi";
import { FaBoxes, FaRocket } from "react-icons/fa";
import { MdStorage, MdWarehouse } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme";
/**
 * ManagementPage — Premium Redesign (3 Layouts)
 * --------------------------------------------------------------------------
 * Goals:
 * - Tampilan modern, informatif, sangat usable.
 * - Sepenuhnya theme-aware: semua warna diambil dari CSS variables via token().
 * - 3 alternatif layout: "neo", "mosaic", "minimalPro".
 * - Siap produksi: tanpa error, aksesibilitas oke, animasi halus.
 * - Komentar jelas agar mudah di-maintain.
 */

export default function ManagementPage() {
  // ---------------------------------------------------------------------
  // THEME TOKENS
  // ---------------------------------------------------------------------
  const theme = useTheme();
  const token = theme.token; // token('--primary-700') → string hex

  // Brand palette (dengan fallback aman)
  const PRI200 = token("--primary-200") || "#B2B0E8"; // Ungu Muda
  const PRI700 = token("--primary-700") || "#3B38A0"; // Biru Tua
  const PRI800 = token("--primary-800") || "#1A2A80"; // Navy

  const BG = token("--bg") || "#F8FAFC";
  const SUR = token("--surface") || "#FFFFFF";
  const BRD = token("--border") || "#E5E7EB";
  const TXT = token("--text") || "#0F172A";
  const MUT = token("--muted") || "#64748B";

  // Gradient util
  const gradientHero = `linear-gradient(135deg, ${PRI200} 0%, ${PRI700} 50%, ${PRI800} 100%)`;

  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  /** selectedLayout: menyimpan pilihan layout user */
  const [selectedLayout, setSelectedLayout] = useState(() => {
    try { return localStorage.getItem("management_selectedLayout") || "neo"; } catch { return "neo"; }
  });

  /** isLoading: animasi masuk saat pertama render */
  const [isLoading, setIsLoading] = useState(true);

  // Persist pilihan layout
  useEffect(() => { try { localStorage.setItem("management_selectedLayout", selectedLayout); } catch {} }, [selectedLayout]);

  // Smooth entrance animation (hormati prefers-reduced-motion)
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) { setIsLoading(false); return; }
    const t = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  // ---------------------------------------------------------------------
  // NAVBAR
  // ---------------------------------------------------------------------
  const actions = useMemo(() => ([
    {
      type: "button",
      title: "Ganti layout",
      onClick: () => {
        const layouts = ["neo", "mosaic", "minimalPro"]; const i = layouts.indexOf(selectedLayout);
        setSelectedLayout(layouts[(i + 1) % layouts.length]);
      },
      label: <BiCategoryAlt title="Ganti layout" />,
      className: "px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50",
      style: { borderColor: BRD, color: TXT },
    },
  ]), [selectedLayout, BRD, TXT]);

  useNavbar({ variant: "page", title: "Management", backTo: null, actions }, [actions]);

  // ---------------------------------------------------------------------
  // DATA: Kategori & Item (link tetap — UI dirombak)
  // ---------------------------------------------------------------------
  const managementCategories = [
    {
      title: "Inventory & Products",
      description: "Kelola produk, stok, dan kategori",
      icon: <MdWarehouse className="text-2xl" />,
      items: [
        { icon: <BiBox className="text-2xl" />, label: "Barang atau Jasa", link: "/barang-jasa", description: "Kelola produk dan layanan", badge: "Hot" },
        { icon: <BiCategory className="text-2xl" />, label: "Kategori Barang", link: "/kategori-barang", description: "Organisir kategori produk" },
        { icon: <FaBoxes className="text-2xl" />, label: "Manajemen Stok", link: "/stok", description: "Monitor inventori real-time" },
        { icon: <MdStorage className="text-2xl" />, label: "Stok Opname", link: "/stokopname", description: "Audit dan penyesuaian stok", badge: "New" },
      ],
    },
    {
      title: "Customer Relations",
      description: "Manajemen pelanggan dan supplier",
      icon: <BiUser className="text-2xl" />,
      items: [
        { icon: <BiUser className="text-2xl" />, label: "Pelanggan", link: "/pelanggan", description: "Database pelanggan lengkap" },
        { icon: <BiPackage className="text-2xl" />, label: "Supplier", link: "/supplier", description: "Manajemen mitra bisnis" },
      ],
    },
    {
      title: "Financial Management",
      description: "Kontrol keuangan dan pricing",
      icon: <BiMoney className="text-2xl" />,
      items: [
        { icon: <BiSolidDiscount className="text-2xl" />, label: "Diskon", link: "/diskon", description: "Strategi harga dan promosi" },
        { icon: <BiMoneyWithdraw className="text-2xl" />, label: "Pajak", link: "/pajak", description: "Pengaturan pajak otomatis" },
        { icon: <BiMoney className="text-2xl" />, label: "Biaya Operasional", link: "/biaya", description: "Tracking pengeluaran bisnis" },
      ],
    },
    {
      title: "Marketing & Promotions",
      description: "Kampanye dan strategi penjualan",
      icon: <HiSparkles className="text-2xl" />,
      items: [
        { icon: <BiSolidOffer className="text-2xl" />, label: "Promosi Events", link: "/promosi", description: "Campaign dan event khusus" },
      ],
    },
  ];

  // Untuk layout non-berkelompok
  const allItems = useMemo(() => managementCategories.flatMap((c) => c.items), [managementCategories]);

  // ---------------------------------------------------------------------
  // UI PRIMITIVES
  // ---------------------------------------------------------------------
  /** Badge kecil (New/Hot/dsb) */
  const Pill = ({ children }) => (
    <span
      aria-label={String(children)}
      className="inline-flex items-center rounded-full text-[10px] px-2 py-0.5 font-medium select-none"
      style={{ color: TXT, background: `${PRI200}33`, border: `1px solid ${PRI200}` }}
    >
      {children}
    </span>
  );

  /** Kartu navigasi modul */
  const AppCard = ({ icon, label, description, link, badge }) => (
    <Link
      to={link}
      role="button"
      aria-label={label}
      title={label}
      className="group relative rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all"
      style={{ background: SUR, border: `1px solid ${BRD}`, boxShadow: "0 8px 24px rgba(16,24,40,0.06)" }}
    >
      {/* Decorative gradient bar */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${PRI200}, ${PRI700}, ${PRI800})`, opacity: 0.9 }} />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="grid place-items-center rounded-xl w-12 h-12 shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: `${PRI200}22`, color: PRI700, border: `1px solid ${BRD}` }}>{icon}</div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaRocket aria-hidden className="text-base" style={{ color: MUT }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: TXT }}>{label}</h3>
            {badge ? <Pill>{badge}</Pill> : null}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: MUT }}>{description}</p>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: PRI700 }}>
          Kelola
          <svg aria-hidden className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* bottom highlight on hover */}
      <div aria-hidden className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ background: PRI700 }} />
    </Link>
  );

  /** Header kategori untuk layout berkelompok */
  const CategoryHeader = ({ icon, title, description }) => (
    <div className="flex items-center gap-4 mb-6">
      <div className="p-4 rounded-2xl shadow-md" aria-hidden style={{ background: PRI700, color: "#fff", boxShadow: "0 12px 24px rgba(27,31,59,0.18)" }}>{icon}</div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: TXT }}>{title}</h2>
        <p className="text-sm" style={{ color: MUT }}>{description}</p>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // LAYOUTS
  // ---------------------------------------------------------------------
  /** Layout 1: NEO — Hero + sections */
  const layoutNeo = (
    <div className="min-h-full" style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG} 35%, ${PRI200}11 100%)` }}>
  
      {/* CONTENT */}
      <section className="px-6 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {managementCategories.map((cat, i) => (
            <div key={cat.title} className={`transition-all ${isLoading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`} style={{ transitionDuration: "500ms", transitionDelay: `${i * 80}ms` }}>
              <CategoryHeader icon={cat.icon} title={cat.title} description={cat.description} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cat.items.map((it, j) => (
                  <div key={`${cat.title}-${it.label}`} style={{ transitionDelay: `${j * 40}ms` }}>
                    <AppCard {...it} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  /** Layout 2: MOSAIC — grid menyatu */
  const layoutMosaic = (
    <div className="min-h-full px-6 sm:px-8 py-10" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: TXT }}>Management</h1>
          <p className="text-sm" style={{ color: MUT }}>Semua modul dalam satu grid. Cocok untuk akses cepat.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {allItems.map((it, i) => (
            <div key={`${it.label}-${i}`} className={`transition-all ${isLoading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`} style={{ transitionDuration: "500ms", transitionDelay: `${i * 30}ms` }}>
              <AppCard {...it} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /** Layout 3: MINIMAL PRO — list padat */
  const layoutMinimalPro = (
    <div className="min-h-full px-6 sm:px-8 py-10" style={{ background: `${PRI200}11` }}>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: TXT }}>Management</h1>
          <p className="text-sm" style={{ color: MUT }}>Tampilan ringkas dan efisien. Ideal untuk power users.</p>
        </header>

        <div className="rounded-2xl overflow-hidden" style={{ background: SUR, border: `1px solid ${BRD}` }}>
          {managementCategories.map((cat, iCat) => (
            <div key={cat.title} className={iCat > 0 ? "border-t" : ""} style={{ borderColor: BRD }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: `${PRI200}22` }}>
                <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: "#fff", color: PRI700, border: `1px solid ${BRD}` }}>{cat.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: TXT }}>{cat.title}</div>
                  <div className="text-xs" style={{ color: MUT }}>{cat.description}</div>
                </div>
              </div>

              <ul className="divide-y" style={{ borderColor: BRD }}>
                {cat.items.map((it) => (
                  <li key={`${cat.title}-${it.label}`}>
                    <Link to={it.link} className="flex items-center gap-4 px-5 py-4 group hover:no-underline" style={{ color: TXT }}>
                      <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0 transition-transform group-hover:scale-105" style={{ background: `${PRI200}22`, color: PRI700, border: `1px solid ${BRD}` }}>{it.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{it.label}</span>
                          {it.badge ? <Pill>{it.badge}</Pill> : null}
                        </div>
                        <div className="text-xs" style={{ color: MUT }}>{it.description}</div>
                      </div>
                      <svg aria-hidden className="w-5 h-5 opacity-60 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <>
      {selectedLayout === "neo" && layoutNeo}
      {selectedLayout === "mosaic" && layoutMosaic}
      {selectedLayout === "minimalPro" && layoutMinimalPro}
    </>
  );
}
