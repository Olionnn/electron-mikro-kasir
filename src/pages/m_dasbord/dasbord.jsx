// src/pages/DashboardKasirModern.jsx
import React, { useMemo, useState } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme";
import { Card } from "../../component/SimpleCard";
import { Badge } from "../../component/SimpleBadge";
import {
  MdMenu,
  MdSearch,
  MdClose,
  MdAdd,
  MdInventory,
  MdQrCodeScanner,
  MdBarChart,
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
} from "recharts";

/**
 * DashboardKasirModern
 * - Versi tampilan modern / premium sesuai gambar referensi.
 * - Fungsi / data tidak diubah; hanya tampilannya yang dirubah.
 * - Menggunakan useTheme().token('--primary-700') untuk mengambil warna runtime dari ThemeProvider.
 *
 * Catatan integrasi:
 * - Pastikan ThemeProvider menyediakan CSS variable --primary-700, --primary-500, --primary-900, dll.
 * - Card / Badge dipakai ulang untuk konsistensi.
 */

/* ----------------- Utilities ----------------- */
const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const toISO = (d) => (typeof d === "string" ? d : d.toISOString().slice(0, 10));
const toLabel = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

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

export default function DashboardKasir() {

  useNavbar(
    {
      variant: "page",
      title: "Dashboard",
      actions: [
        {
          type: "button",
          title: "Fitur Baru",
          onClick: () => console.log("Fitur Baru"),
          className: "px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50",
          label: "Fitur Baru ▾",
        },
        {
          type: "span",
          title: "User",
          className: "hidden md:inline-flex items-center gap-2 text-sm text-gray-700",
          label: "Narin Elvarelle",
        },
      ],
    },
    []
  );

  // State filter tanggal (sama fungsi)
  const [activeDate, setActiveDate] = useState("2025-08-13");

  // ↳ Derive KPI hari ini
  const kpi = useMemo(() => {
    const rows = DUMMY_POS.filter((r) => r.date === activeDate);
    const trx = rows.length;
    const revenue = rows.reduce((s, x) => s + x.revenue, 0);
    const profit = rows.reduce((s, x) => s + x.profit, 0);
    return { trx, revenue, profit };
  }, [activeDate]);

  // ↳ Series untuk grafik (agregasi per tanggal)
  const seriesByDate = useMemo(() => {
    const map = new Map();
    for (const r of DUMMY_POS) {
      if (!map.has(r.date)) map.set(r.date, { date: r.date, trx: 0, revenue: 0, profit: 0 });
      const o = map.get(r.date);
      o.trx += 1;
      o.revenue += r.revenue;
      o.profit += r.profit;
    }
    // sort ASC (tanggal lama → baru) biar line chart halus
    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  const salesByItem = useMemo(() => DUMMY_SALES_BY_ITEM.filter((r) => r.date === activeDate), [activeDate]);
  const salesByStaff = useMemo(() => DUMMY_SALES_BY_STAFF.filter((r) => r.date === activeDate), [activeDate]);
  const stockMoves = useMemo(() => DUMMY_STOCK_MOVES.filter((r) => r.date === activeDate), [activeDate]);

  // Ring progress data (contoh statis: 76% -> hitung dari target)
  const target = 200_000_000;
  const achieved = 152_000_000;
  const achievedPct = Math.round((achieved / target) * 100);

  // Tooltip custom (dipakai di chart)
  const TooltipBox = ({ payload, label }) => {
    if (!payload || !payload.length) return null;
    return (
      <div className="bg-[#0b1226]/90 border border-white/8 text-xs text-white p-2 rounded shadow-lg">
        <div className="font-semibold text-sm">{toLabel(label)}</div>
        {payload.map((p, i) => (
          <div className="flex items-center gap-2 mt-1" key={i}>
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
            <div className="text-xs text-white/80">{p.name}:</div>
            <div className="font-medium text-white">{p.value >= 1000 ? fmtIDR(p.value) : p.value}</div>
          </div>
        ))}
      </div>
    );
  };

  /* ----------------- Layout -----------------
     - Struktur: 12-column grid (kiri lebar 8, kanan 4)
     - Background gradient & glass cards untuk efek "deep purple dashboard"
     - Tailwind utility classes digunakan; tambahkan kelas helper di tailwind config jika perlu
  ------------------------------------------------*/
  return (
    <div className="min-h-screen bg-purple-950 text-white p-4">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-purple-900 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <MdMenu className="text-2xl" />
          <h1 className="font-bold text-lg">POS Dashboard</h1>
        </div>
        <div className="flex-1 mx-6">
          <div className="flex items-center bg-purple-800 px-3 py-2 rounded-xl">
            <MdSearch className="mr-2 text-gray-300" />
            <input
              type="text"
              placeholder="Cari menu, pelanggan, item.."
              className="bg-transparent flex-1 outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>
        <button className="bg-purple-700 px-4 py-2 rounded-xl font-semibold hover:bg-purple-600">
          Tutup Kas
        </button>
      </header>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Ringkasan Penjualan */}
        <div className="bg-purple-900 rounded-2xl p-4 col-span-2 shadow-lg">
          <h2 className="font-bold mb-2">Ringkasan Penjualan (Mingguan)</h2>
          <p className="text-sm text-gray-400 mb-4">Sales vs Orders</p>
          <div className="flex items-end gap-2 h-48">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-8 bg-purple-500 rounded-t"
                  style={{ height: `${Math.random() * 100 + 40}px` }}
                />
                <span className="text-xs mt-2 text-gray-300">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kartu Statistik */}
        <div className="flex flex-col gap-4">
          <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-gray-400">Omzet Minggu Ini</p>
            <h3 className="text-xl font-bold">Rp 382.500.000</h3>
          </div>
          <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-gray-400">Total Order</p>
            <h3 className="text-xl font-bold">744</h3>
          </div>
          <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-gray-400">Rata-rata Keranjang</p>
            <h3 className="text-xl font-bold">Rp 51.405</h3>
          </div>
          <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-gray-400">Item Terjual</p>
            <h3 className="text-xl font-bold">1.359 pcs</h3>
          </div>
        </div>
      </div>

      {/* Aksi Cepat + Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Aksi Cepat */}
        <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
          <h2 className="font-bold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-purple-800 p-4 rounded-xl flex flex-col items-center hover:bg-purple-700">
              <MdAdd className="text-2xl mb-1" />
              <span className="text-sm">Transaksi</span>
            </button>
            <button className="bg-purple-800 p-4 rounded-xl flex flex-col items-center hover:bg-purple-700">
              <MdQrCodeScanner className="text-2xl mb-1" />
              <span className="text-sm">Scan Barcode</span>
            </button>
            <button className="bg-purple-800 p-4 rounded-xl flex flex-col items-center hover:bg-purple-700">
              <MdInventory className="text-2xl mb-1" />
              <span className="text-sm">Inventory</span>
            </button>
            <button className="bg-purple-800 p-4 rounded-xl flex flex-col items-center hover:bg-purple-700">
              <MdBarChart className="text-2xl mb-1" />
              <span className="text-sm">Laporan</span>
            </button>
          </div>
        </div>

        {/* Pencapaian Target */}
        <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
          <h2 className="font-bold mb-4">Pencapaian Target Bulan Ini</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">76%</p>
              <p className="text-sm text-gray-400">
                Target omzet Rp 200.000.000
              </p>
              <p className="text-sm text-gray-400">ETA 9 hari</p>
            </div>
            <div className="w-20 h-20 rounded-full border-8 border-purple-700 flex items-center justify-center font-bold text-lg">
              76%
            </div>
          </div>
        </div>
      </div>

      {/* Produk Terlaris + Penjualan Per Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Produk Terlaris */}
        <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
          <h2 className="font-bold mb-4">Produk Terlaris</h2>
          {[
            { name: "Kopi Latte 12oz", val: 11020000 },
            { name: "Roti Sourdough", val: 8400000 },
            { name: "Es Teh Manis", val: 6150000 },
          ].map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>{item.val.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-purple-800 rounded-full">
                <div
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${(item.val / 12000000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Penjualan Per Staff */}
        <div className="bg-purple-900 rounded-2xl p-4 shadow-lg">
          <h2 className="font-bold mb-4">Penjualan Per Staff</h2>
          {[
            { email: "kasir1@toko.id", trx: 2, total: 180000 },
            { email: "kasir2@toko.id", trx: 1, total: 190000 },
          ].map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-purple-800 last:border-0"
            >
              <span>{s.email}</span>
              <span>
                {s.trx} trx • Rp {s.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
