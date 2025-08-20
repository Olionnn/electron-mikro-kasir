// src/pages/DashboardKasirModern.premium.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme"; // ✅ konsisten dengan halaman lain
import { Card } from "../../component/SimpleCard";
import { Badge } from "../../component/SimpleBadge";

import {
  MdMenu,
  MdSearch,
  MdAdd,
  MdInventory,
  MdQrCodeScanner,
  MdBarChart,
  MdViewWeek,
  MdViewCompact,
  MdViewCarousel,
} from "react-icons/md";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

/**
 * DashboardKasirModern — Premium Redesign (3 Layouts)
 * ---------------------------------------------------------------------------
 * Goals:
 * - Tampilan modern, informatif, dan sangat usable untuk kasir/owner.
 * - Sepenuhnya theme-aware melalui useTheme().token('--...').
 * - 3 pilihan layout: "insight", "compact", "hero" (switch via Navbar action).
 * - Siap produksi: tanpa error, aksesibilitas OK, animasi ringan.
 * - Komentar lengkap per bagian untuk memudahkan maintainability.
 */

/* ----------------- Utilities ----------------- */
const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const toISO = (d) => (typeof d === "string" ? d : d.toISOString().slice(0, 10));
const toLabel = (iso) => new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

/* ----------------- Dummy data (tetap sama) ----------------- */
const DUMMY_POS = [
  { id: "TX-001", date: "2025-08-11", revenue: 120000, profit: 35000 },
  { id: "TX-002", date: "2025-08-11", revenue: 250000, profit: 70000 },
  { id: "TX-003", date: "2025-08-12", revenue: 175000, profit: 45000 },
  { id: "TX-004", date: "2025-08-13", revenue: 90000, profit: 20000 },
  { id: "TX-005", date: "2025-08-13", revenue: 220000, profit: 65000 },
];

const DUMMY_SALES_BY_ITEM = [
  { date: "2025-08-13", code: "BRG-001", name: "Beras 5Kg", qty: 2, trxCount: 2, profit: 40000, revenue: 140000 },
  { date: "2025-08-13", code: "BRG-002", name: "Minyak 1L", qty: 4, trxCount: 3, profit: 30000, revenue: 76000 },
  { date: "2025-08-13", code: "BRG-003", name: "Gula 1Kg", qty: 3, trxCount: 2, profit: 21000, revenue: 54000 },
  { date: "2025-08-12", code: "BRG-001", name: "Beras 5Kg", qty: 1, trxCount: 1, profit: 20000, revenue: 70000 },
];

const DUMMY_SALES_BY_STAFF = [
  { date: "2025-08-13", email: "kasir1@toko.id", trxCount: 2, profit: 55000, revenue: 180000 },
  { date: "2025-08-13", email: "kasir2@toko.id", trxCount: 1, profit: 50000, revenue: 190000 },
  { date: "2025-08-12", email: "kasir1@toko.id", trxCount: 1, profit: 45000, revenue: 175000 },
];

const DUMMY_STOCK_MOVES = [
  { date: "2025-08-13", name: "Beras 5Kg", in: 0, out: 2, stock: 18, email: "kasir1@toko.id", mode: "POS", note: "Terjual" },
  { date: "2025-08-13", name: "Minyak 1L", in: 5, out: 1, stock: 24, email: "admin@toko.id", mode: "Pembelian", note: "Restok" },
  { date: "2025-08-12", name: "Gula 1Kg", in: 0, out: 1, stock: 10, email: "kasir1@toko.id", mode: "POS", note: "Terjual" },
];

/** Tooltip custom untuk chart */
function TooltipBox({ payload, label }) {
  if (!payload || !payload.length) return null;
  return (
    <div className="bg-[#0b1226]/90 border border-white/10 text-xs text-white p-2 rounded shadow-lg">
      <div className="font-semibold text-sm">{toLabel(label)}</div>
      {payload.map((p, i) => (
        <div className="flex items-center gap-2 mt-1" key={i}>
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <div className="text-xs text-white/80">{p.name}:</div>
          <div className="font-medium text-white">{p.value >= 1000 ? fmtIDR(p.value) : p.value}</div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardKasirModern() {
  // ---------------------------------------------------------------------
  // THEME TOKENS
  // ---------------------------------------------------------------------
  const theme = useTheme();
  const token = theme.token; // token('--primary-700') → string hex (e.g. "#3B38A0")

  const PRI200 = token("--primary-200") || "#B2B0E8"; // Ungu Muda
  const PRI400 = token("--primary-400") || "#7A85C1"; // Biru Abu
  const PRI700 = token("--primary-700") || "#3B38A0"; // Biru Tua
  const PRI800 = token("--primary-800") || "#1A2A80"; // Navy

  const BG = token("--bg") || "#F8FAFC";
  const SUR = token("--surface") || "#FFFFFF";
  const BRD = token("--border") || "#E5E7EB";
  const TXT = token("--text") || "#0F172A";
  const MUT = token("--muted") || "#64748B";

  // Warna untuk grafik (recharts)
  const CHART_COLORS = [PRI700, PRI800, PRI400, PRI200];

  // ---------------------------------------------------------------------
  // NAVBAR CONFIG & LAYOUT STATE
  // ---------------------------------------------------------------------
  const [layout, setLayout] = useState(() => localStorage.getItem("cashier_dashboard_layout") || "insight");

  const layoutSwitcher = [
    { key: "insight", icon: <MdViewWeek />, label: "Insight" },
    { key: "compact", icon: <MdViewCompact />, label: "Compact" },
    { key: "hero", icon: <MdViewCarousel />, label: "Hero" },
  ];

  useNavbar(
    {
      variant: "page",
      title: "Dashboard Kasir",
      actions: [
        {
          type: "button",
          title: "Ganti Layout",
          onClick: () => {
            const orders = layoutSwitcher.map((x) => x.key);
            const i = orders.indexOf(layout);
            const next = orders[(i + 1) % orders.length];
            setLayout(next);
            try { localStorage.setItem("cashier_dashboard_layout", next); } catch {}
          },
          label: "Layout ▾",
          className: "px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50",
        },
      ],
    },
    [layout]
  );

  // ---------------------------------------------------------------------
  // STATE: Filter tanggal
  // ---------------------------------------------------------------------
  const [activeDate, setActiveDate] = useState("2025-08-13");

  // ---------------------------------------------------------------------
  // DERIVED DATA: KPI & SERIES
  // ---------------------------------------------------------------------
  /**
   * kpi: hitung total transaksi, revenue, profit untuk tanggal aktif
   */
  const kpi = useMemo(() => {
    const rows = DUMMY_POS.filter((r) => r.date === activeDate);
    const trx = rows.length;
    const revenue = rows.reduce((s, x) => s + x.revenue, 0);
    const profit = rows.reduce((s, x) => s + x.profit, 0);
    return { trx, revenue, profit };
  }, [activeDate]);

  /** seriesByDate: agregasi per tanggal untuk grafik */
  const seriesByDate = useMemo(() => {
    const map = new Map();
    for (const r of DUMMY_POS) {
      if (!map.has(r.date)) map.set(r.date, { date: r.date, trx: 0, revenue: 0, profit: 0 });
      const o = map.get(r.date);
      o.trx += 1;
      o.revenue += r.revenue;
      o.profit += r.profit;
    }
    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  const salesByItem = useMemo(() => DUMMY_SALES_BY_ITEM.filter((r) => r.date === activeDate), [activeDate]);
  const salesByStaff = useMemo(() => DUMMY_SALES_BY_STAFF.filter((r) => r.date === activeDate), [activeDate]);
  const stockMoves = useMemo(() => DUMMY_STOCK_MOVES.filter((r) => r.date === activeDate), [activeDate]);

  // Target bulanan (contoh statis)
  const target = 200_000_000;
  const achieved = 152_000_000;
  const achievedPct = Math.round((achieved / target) * 100);

  // Pie data: komposisi item (by revenue)
  const pieData = useMemo(() => {
    const list = salesByItem.length ? salesByItem : DUMMY_SALES_BY_ITEM.filter((r)=>r.date==="2025-08-13");
    return list.map((x) => ({ name: x.name, value: x.revenue }));
  }, [salesByItem]);

  // ---------------------------------------------------------------------
  // ATOMICS: KPI Card & Section Title
  // ---------------------------------------------------------------------
  const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-3">
      <h3 className="text-lg font-semibold" style={{ color: TXT }}>{title}</h3>
      {subtitle ? <p className="text-sm" style={{ color: MUT }}>{subtitle}</p> : null}
    </div>
  );

  const KPICard = ({ label, value, hint }) => (
    <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
      <div className="text-xs" style={{ color: MUT }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color: TXT }}>{value}</div>
      {hint ? <div className="text-xs mt-1" style={{ color: MUT }}>{hint}</div> : null}
    </Card>
  );

  // ---------------------------------------------------------------------
  // LAYOUTS
  // ---------------------------------------------------------------------
  const LayoutInsight = () => (
    <div className="px-4 py-6" style={{ background: BG }}>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard label="Omzet Hari Ini" value={fmtIDR(kpi.revenue)} hint={`Profit: ${fmtIDR(kpi.profit)}`} />
        <KPICard label="Transaksi" value={`${kpi.trx} trx`} hint={`Tanggal: ${toLabel(activeDate)}`} />
        <KPICard label="Progress Target" value={`${achievedPct}%`} hint={`Target: ${fmtIDR(target)}`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="rounded-2xl p-4 col-span-2" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Tren Harian" subtitle="Pendapatan, Profit, dan Jumlah Transaksi" />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={seriesByDate} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRD} />
                <XAxis dataKey="date" tickFormatter={toLabel} stroke={MUT} />
                <YAxis stroke={MUT} />
                <Tooltip content={<TooltipBox />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke={PRI700} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke={PRI800} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="trx" name="Transaksi" stroke={PRI400} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Komposisi Produk" subtitle="Kontribusi omzet per item" />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}> 
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => fmtIDR(val)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl p-4 col-span-2" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Produk Terlaris (Hari Ini)" />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={salesByItem} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRD} />
                <XAxis dataKey="name" stroke={MUT} />
                <YAxis stroke={MUT} />
                <Tooltip content={<TooltipBox />} />
                <Bar dataKey="revenue" name="Revenue">
                  {salesByItem.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Penjualan per Staff" />
          <ul className="divide-y" style={{ borderColor: BRD }}>
            {salesByStaff.map((s, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: TXT }}>{s.email}</div>
                  <div className="text-xs" style={{ color: MUT }}>{s.trxCount} trx</div>
                </div>
                <div className="text-sm font-semibold" style={{ color: TXT }}>{fmtIDR(s.revenue)}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { icon: <MdAdd className="text-2xl" />, label: "Transaksi" },
          { icon: <MdQrCodeScanner className="text-2xl" />, label: "Scan" },
          { icon: <MdInventory className="text-2xl" />, label: "Inventory" },
          { icon: <MdBarChart className="text-2xl" />, label: "Laporan" },
        ].map((a, i) => (
          <button key={i} className="rounded-xl p-4 transition-transform hover:scale-[1.02]" style={{ background: SUR, border: `1px solid ${BRD}`, color: TXT }}>
            <div className="grid place-items-center mb-2" style={{ color: PRI700 }}>{a.icon}</div>
            <div className="text-sm font-medium">{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const LayoutCompact = () => (
    <div className="px-4 py-6" style={{ background: BG }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: TXT }}>Ringkasan</h2>
        <div className="text-xs" style={{ color: MUT }}>Tanggal aktif: {toLabel(activeDate)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Omzet" value={fmtIDR(kpi.revenue)} />
        <KPICard label="Profit" value={fmtIDR(kpi.profit)} />
        <KPICard label="Transaksi" value={`${kpi.trx} trx`} />
        <KPICard label="Target" value={`${achievedPct}%`} hint={`Target: ${fmtIDR(target)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl p-4 col-span-2" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Tren Harian" />
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={seriesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRD} />
                <XAxis dataKey="date" tickFormatter={toLabel} stroke={MUT} />
                <YAxis stroke={MUT} />
                <Tooltip content={<TooltipBox />} />
                <Line type="monotone" dataKey="revenue" stroke={PRI700} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" stroke={PRI800} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Komposisi Produk" />
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Produk Terlaris" />
          <ul className="divide-y" style={{ borderColor: BRD }}>
            {salesByItem.map((x, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: TXT }}>{x.name}</div>
                  <div className="text-xs" style={{ color: MUT }}>{x.qty} pcs • {x.trxCount} trx</div>
                </div>
                <div className="text-sm font-semibold" style={{ color: TXT }}>{fmtIDR(x.revenue)}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
          <SectionTitle title="Pergerakan Stok Terbaru" />
          <ul className="divide-y" style={{ borderColor: BRD }}>
            {stockMoves.map((m, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: TXT }}>{m.name}</div>
                  <div className="text-xs" style={{ color: MUT }}>{m.mode} • {m.note}</div>
                </div>
                <div className="text-xs" style={{ color: MUT }}>Sisa: {m.stock}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );

  const LayoutHero = () => (
    <div className="min-h-full" style={{ background: `linear-gradient(180deg, ${PRI200}22 0%, ${BG} 35%)` }}>
      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-8 py-8" style={{ color: TXT }}>
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${PRI200} 0%, ${PRI700} 50%, ${PRI800} 100%)` }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ringkasan Kasir</h1>
                <p className="opacity-90 text-sm sm:text-base">Pantau omzet, transaksi, dan produk terlaris secara kilat.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 text-center">
                  <div className="text-[11px] opacity-90">Omzet</div>
                  <div className="text-sm font-semibold">{fmtIDR(kpi.revenue)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 text-center">
                  <div className="text-[11px] opacity-90">Profit</div>
                  <div className="text-sm font-semibold">{fmtIDR(kpi.profit)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 text-center">
                  <div className="text-[11px] opacity-90">Transaksi</div>
                  <div className="text-sm font-semibold">{kpi.trx} trx</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl p-4 col-span-2" style={{ background: SUR, borderColor: BRD }}>
            <SectionTitle title="Tren Harian" />
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={seriesByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BRD} />
                  <XAxis dataKey="date" tickFormatter={toLabel} stroke={MUT} />
                  <YAxis stroke={MUT} />
                  <Tooltip content={<TooltipBox />} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke={PRI700} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke={PRI800} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
            <SectionTitle title="Target Bulan Ini" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold" style={{ color: TXT }}>{achievedPct}%</div>
                <div className="text-xs mt-1" style={{ color: MUT }}>Target: {fmtIDR(target)}</div>
                <div className="text-xs" style={{ color: MUT }}>Pencapaian: {fmtIDR(achieved)}</div>
              </div>
              <div className="w-20 h-20 rounded-full grid place-items-center font-bold text-sm" style={{ border: `8px solid ${PRI700}`, color: TXT }}>
                {achievedPct}%
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl p-4 col-span-2" style={{ background: SUR, borderColor: BRD }}>
            <SectionTitle title="Produk Terlaris" />
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={salesByItem}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BRD} />
                  <XAxis dataKey="name" stroke={MUT} />
                  <YAxis stroke={MUT} />
                  <Tooltip content={<TooltipBox />} />
                  <Bar dataKey="revenue" name="Revenue">
                    {salesByItem.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-2xl p-4" style={{ background: SUR, borderColor: BRD }}>
            <SectionTitle title="Penjualan per Staff" />
            <ul className="divide-y" style={{ borderColor: BRD }}>
              {salesByStaff.map((s, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium" style={{ color: TXT }}>{s.email}</div>
                    <div className="text-xs" style={{ color: MUT }}>{s.trxCount} trx</div>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: TXT }}>{fmtIDR(s.revenue)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );

  // ---------------------------------------------------------------------
  // RENDER (pilih layout)
  // ---------------------------------------------------------------------
  return (
    <>
      {layout === "insight" && <LayoutInsight />}
      {layout === "compact" && <LayoutCompact />}
      {layout === "hero" && <LayoutHero />}
    </>
  );
}
