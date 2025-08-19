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
import { useTheme } from "../../hooks/useTheme"; // ✅ Integrasi tema runtime

/**
 * MANAGEMENT PAGE — Premium Redesign (v2)
 * -------------------------------------------------------------------------
 * Tujuan:
 * - UI modern, profesional, informatif, dan sangat usable.
 * - Sepenuhnya theme-aware: semua warna via token() / CSS variables.
 * - 3 alternatif layout: "neo", "mosaic", dan "minimalPro".
 * - Siap produksi: tanpa error, aksesibilitas OK, animasi halus (menghormati prefers-reduced-motion).
 * - Komentar rapi untuk memudahkan maintainability.
 *
 * Catatan Desain:
 * - Menggunakan palet: Ungu Muda (#B2B0E8), Biru Abu (#7A85C1), Biru Tua (#3B38A0), Navy (#1A2A80)
 * - Tidak hardcode warna; gunakan token('--...') dengan fallback yang sesuai.
 * - Konsisten dengan pola dan penamaan dari halaman-halaman yang sudah kita rombak sebelumnya.
 */

export default function ManagementPage() {
  // ---------------------------------------------------------------------
  // THEME & TOKENS
  // ---------------------------------------------------------------------
  /**
   * token(name, fallback): ambil nilai dari ThemeProvider. Jika ThemeProvider belum siap,
   * gunakan CSS var dengan fallback warna agar tetap aman untuk produksi.
   */
  const theme = useTheme?.();
  const token = theme?.token;
  const color = useCallback(
    (name, fallback) => {
      if (typeof token === "function") return token(name, fallback);
      return `var(${name}, ${fallback})`;
    },
    [token]
  );

  // Warna inti sesuai palet brand (dengan fallback aman)
  const PRI700 = color("--primary-700", "#3B38A0"); // Biru Tua
  const PRI200 = color("--primary-200", "#B2B0E8"); // Ungu Muda
  const ACC600 = color("--accent-600", "#1A2A80"); // Navy
  const MUT500 = color("--muted-500", "#7A85C1"); // Biru Abu

  // Surface & Text
  const CARD = color("--card", "#FFFFFF");
  const CARD_SOFT = color("--card-muted", "#F6F7FB");
  const BORDER = color("--border", "#E6E8F0");
  const TXT = color("--text", "#1F2A37");
  const TXT_MUT = color("--text-muted", "#64748B");
  const BG_APP = color("--app-bg", "#FAFBFF");

  const gradientHero = `linear-gradient(135deg, ${PRI200} 0%, ${PRI700} 50%, ${ACC600} 100%)`;

  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  /** selectedLayout: "neo" | "mosaic" | "minimalPro"  */
  const [selectedLayout, setSelectedLayout] = useState(() => {
    try {
      return localStorage.getItem("management_selectedLayout") || "neo";
    } catch {
      return "neo";
    }
  });

  /** isLoading: animasi masuk agar terasa halus */
  const [isLoading, setIsLoading] = useState(true);

  // Persist pilihan layout
  useEffect(() => {
    try {
      localStorage.setItem("management_selectedLayout", selectedLayout);
    } catch {}
  }, [selectedLayout]);

  // Smooth entrance animation (hormati prefers-reduced-motion)
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media && media.matches) {
      setIsLoading(false);
      return;
    }
    const t = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  // ---------------------------------------------------------------------
  // NAVBAR CONFIG
  // ---------------------------------------------------------------------
  const actions = useMemo(() => {
    return [
      {
        type: "button",
        label: <BiCategoryAlt title="Ganti layout" />,
        onClick: () => {
          const layouts = ["neo", "mosaic", "minimalPro"];
          const i = layouts.indexOf(selectedLayout);
          setSelectedLayout(layouts[(i + 1) % layouts.length]);
        },
      },
    ];
  }, [selectedLayout]);

  // Daftarkan navbar: judul + tombol switch layout
  useNavbar({ variant: "page", title: "Management", backTo: null, actions }, [actions]);

  // ---------------------------------------------------------------------
  // DATA: Kategori & Item (link & struktur tetap — UI diperbarui)
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

  // Flatten item untuk layout non-berkelompok
  const allItems = useMemo(() => managementCategories.flatMap((c) => c.items), [managementCategories]);

  // ---------------------------------------------------------------------
  // UI PRIMITIVES
  // ---------------------------------------------------------------------
  /**
   * Badge kecil (New/Hot/dsb)
   */
  const Pill = ({ children }) => (
    <span
      aria-label={String(children)}
      className="inline-flex items-center rounded-full text-[10px] px-2 py-0.5 font-medium select-none"
      style={{
        color: color("--primary-900", "#0F172A"),
        background: color("--primary-100", "#EEF2FF"),
        border: `1px solid ${color("--primary-200", "#B2B0E8")}`,
      }}
    >
      {children}
    </span>
  );

  /**
   * Komponen Kartu App: aksesibilitas + animasi hover halus
   * - Gunakan Link agar SPA tetap ringan
   * - Focus ring untuk keyboard users
   */
  const AppCard = ({ icon, label, description, link, badge }) => (
    <Link
      to={link}
      role="button"
      aria-label={label}
      title={label}
      className="group relative rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all"
      style={{ background: CARD, border: `1px solid ${BORDER}`, boxShadow: "0 8px 24px rgba(16,24,40,0.06)" }}
    >
      {/* Decorative gradient bar */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${PRI200}, ${PRI700}, ${ACC600})`, opacity: 0.85 }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className="grid place-items-center rounded-xl w-12 h-12 shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: color("--primary-50", "#F4F4FB"), color: PRI700, border: `1px solid ${color("--primary-100", "#EAE9FD")}` }}
          >
            {icon}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaRocket aria-hidden className="text-base" style={{ color: MUT500 }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: TXT }}>
              {label}
            </h3>
            {badge ? <Pill>{badge}</Pill> : null}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: TXT_MUT }}>
            {description}
          </p>
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
      <div className="p-4 rounded-2xl shadow-md" aria-hidden style={{ background: color("--primary-600", "#3B38A0"), color: color("--primary-50", "#F4F4FB"), boxShadow: "0 12px 24px rgba(27,31,59,0.18)" }}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: TXT }}>{title}</h2>
        <p className="text-sm" style={{ color: TXT_MUT }}>{description}</p>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // LAYOUTS
  // ---------------------------------------------------------------------
  /** Layout 1: NEO — Hero gradien, section rapi dengan micro-interactions */
  const layoutNeo = (
    <div className="min-h-full" style={{ background: `linear-gradient(180deg, ${BG_APP} 0%, ${CARD_SOFT} 100%)` }}>

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

  /** Layout 2: MOSAIC — Semua item dalam satu grid (rasa dashboard) */
  const layoutMosaic = (
    <div className="min-h-full px-6 sm:px-8 py-10" style={{ background: BG_APP }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: TXT }}>Management</h1>
          <p className="text-sm" style={{ color: TXT_MUT }}>Semua modul dalam satu grid. Cocok untuk akses cepat.</p>
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

  /** Layout 3: MINIMAL PRO — Daftar bersih, fokus task */
  const layoutMinimalPro = (
    <div className="min-h-full px-6 sm:px-8 py-10" style={{ background: CARD_SOFT }}>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: TXT }}>Management</h1>
          <p className="text-sm" style={{ color: TXT_MUT }}>Tampilan ringkas dan efisien. Ideal untuk power users.</p>
        </header>

        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {managementCategories.map((cat, iCat) => (
            <div key={cat.title} className={iCat > 0 ? "border-t" : ""} style={{ borderColor: BORDER }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: color("--subtle", "#FBFBFE") }}>
                <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: color("--primary-50", "#F4F4FB"), color: PRI700 }}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: TXT }}>{cat.title}</div>
                  <div className="text-xs" style={{ color: TXT_MUT }}>{cat.description}</div>
                </div>
              </div>

              <ul className="divide-y" style={{ borderColor: BORDER }}>
                {cat.items.map((it) => (
                  <li key={`${cat.title}-${it.label}`}>
                    <Link to={it.link} className="flex items-center gap-4 px-5 py-4 group hover:no-underline" style={{ color: TXT }}>
                      <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0 transition-transform group-hover:scale-105" style={{ background: color("--primary-50", "#F4F4FB"), color: PRI700, border: `1px solid ${color("--primary-100", "#EAE9FD")}` }}>
                        {it.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{it.label}</span>
                          {it.badge ? <Pill>{it.badge}</Pill> : null}
                        </div>
                        <div className="text-xs" style={{ color: TXT_MUT }}>{it.description}</div>
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
