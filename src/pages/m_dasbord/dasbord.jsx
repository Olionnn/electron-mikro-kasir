import React, { useMemo, useState } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { Card } from "../../component/SimpleCard";
import { Badge } from "../../component/SimpleBadge";

// 👉 Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Util kecil
const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const toISO = (d) => (typeof d === "string" ? d : d.toISOString().slice(0, 10));
const toLabel = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

// === DUMMY DATA ===
const DUMMY_POS = [
  { id: "TX-001", date: "2025-08-11", revenue: 120000, profit: 35000 },
  { id: "TX-002", date: "2025-08-11", revenue: 250000, profit: 70000 },
  { id: "TX-003", date: "2025-08-12", revenue: 175000, profit: 45000 },
  { id: "TX-004", date: "2025-08-13", revenue: 90000, profit: 20000 },
  { id: "TX-005", date: "2025-08-13", revenue: 220000, profit: 65000 },
];

// per barang
const DUMMY_SALES_BY_ITEM = [
  { date: "2025-08-13", code: "BRG-001", name: "Beras 5Kg", qty: 2, trxCount: 2, profit: 40000, revenue: 140000 },
  { date: "2025-08-13", code: "BRG-002", name: "Minyak 1L", qty: 4, trxCount: 3, profit: 30000, revenue: 76000 },
  { date: "2025-08-13", code: "BRG-003", name: "Gula 1Kg", qty: 3, trxCount: 2, profit: 21000, revenue: 54000 },
  { date: "2025-08-12", code: "BRG-001", name: "Beras 5Kg", qty: 1, trxCount: 1, profit: 20000, revenue: 70000 },
];

// per staff
const DUMMY_SALES_BY_STAFF = [
  { date: "2025-08-13", email: "kasir1@toko.id", trxCount: 2, profit: 55000, revenue: 180000 },
  { date: "2025-08-13", email: "kasir2@toko.id", trxCount: 1, profit: 50000, revenue: 190000 },
  { date: "2025-08-12", email: "kasir1@toko.id", trxCount: 1, profit: 45000, revenue: 175000 },
];

// stok
const DUMMY_STOCK_MOVES = [
  { date: "2025-08-13", name: "Beras 5Kg", in: 0, out: 2, stock: 18, email: "kasir1@toko.id", mode: "POS", note: "Terjual" },
  { date: "2025-08-13", name: "Minyak 1L", in: 5, out: 1, stock: 24, email: "admin@toko.id", mode: "Pembelian", note: "Restok" },
  { date: "2025-08-12", name: "Gula 1Kg", in: 0, out: 1, stock: 10, email: "kasir1@toko.id", mode: "POS", note: "Terjual" },
];

export default function DashboardKasir() {
  // Navbar
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

  // Tanggal aktif (filter)
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

  const salesByItem = useMemo(
    () => DUMMY_SALES_BY_ITEM.filter((r) => r.date === activeDate),
    [activeDate]
  );
  const salesByStaff = useMemo(
    () => DUMMY_SALES_BY_STAFF.filter((r) => r.date === activeDate),
    [activeDate]
  );
  const stockMoves = useMemo(
    () => DUMMY_STOCK_MOVES.filter((r) => r.date === activeDate),
    [activeDate]
  );

  // Tooltip custom kecil
  const Tip = ({ active, payload, label, valueFmt = (v) => v }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white border rounded-md shadow px-3 py-2 text-xs">
        <div className="font-semibold mb-1">{toLabel(label)}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-semibold">{valueFmt(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4 grid grid-cols-12 gap-4">
          <main className="col-span-12">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 bg-white border rounded-lg text-sm"
                    value={activeDate}
                    onChange={(e) => setActiveDate(toISO(new Date(e.target.value)))}
                  />
                  <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" className="rounded" />
                    Tampilkan Total Pendapatan Sebelum Piutang Dibayar
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" className="rounded" />
                    Tampilkan Untung Sebelum Piutang Dibayar
                  </label>
                </div>
              </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><span>Jumlah Transaksi</span><Badge className="bg-gray-100 text-gray-600 ml-2">{activeDate.split("-").reverse().join("-")}</Badge></div>}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧾</span>
                  <div className="text-2xl font-bold text-gray-800">{kpi.trx}</div>
                </div>
              </Card>
              <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><span>Pendapatan</span><Badge className="bg-gray-100 text-gray-600 ml-2">{activeDate.split("-").reverse().join("-")}</Badge></div>}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div className="text-2xl font-bold text-gray-800">{fmtIDR(kpi.revenue)}</div>
                </div>
              </Card>
              <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><span>Keuntungan</span><Badge className="bg-gray-100 text-gray-600 ml-2">{activeDate.split("-").reverse().join("-")}</Badge></div>}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <div className="text-2xl font-bold text-gray-800">{fmtIDR(kpi.profit)}</div>
                </div>
              </Card>
            </div>

            {/* Grafiks */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              {/* Grafik Transaksi */}
              <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><Badge className="bg-emerald-600 text-white">Grafik Transaksi</Badge></div>}>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seriesByDate} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={toLabel} fontSize={12} />
                      <YAxis allowDecimals={false} fontSize={12} />
                      <Tooltip content={<Tip valueFmt={(v)=>v} />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="trx" name="Transaksi" stroke="#16a34a" dot activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Grafik Pendapatan */}
              <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><Badge className="bg-emerald-600 text-white">Grafik Pendapatan</Badge></div>}>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seriesByDate} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={toLabel} fontSize={12} />
                      <YAxis tickFormatter={(v)=> (v>=1000? `${(v/1000).toFixed(0)}k`: v)} fontSize={12} />
                      <Tooltip content={<Tip valueFmt={(v)=>fmtIDR(v)} />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#10b981" dot activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Grafik Keuntungan */}
              <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><Badge className="bg-emerald-600 text-white">Grafik Keuntungan</Badge></div>}>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seriesByDate} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={toLabel} fontSize={12} />
                      <YAxis tickFormatter={(v)=> (v>=1000? `${(v/1000).toFixed(0)}k`: v)} fontSize={12} />
                      <Tooltip content={<Tip valueFmt={(v)=>fmtIDR(v)} />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="profit" name="Keuntungan" stroke="#059669" dot activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Tabel lainnya (tetap sama) */}
            <Card className="mb-6" title={<div className="font-semibold">Laporan Penjualan Barang <span className="text-xs font-normal text-gray-500">
              {new Date(activeDate).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </span></div>}>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-2 pr-4">Kode</th>
                      <th className="text-left py-2 pr-4">Nama</th>
                      <th className="text-left py-2 pr-4">Jumlah Barang</th>
                      <th className="text-left py-2 pr-4">Jumlah Transaksi</th>
                      <th className="text-left py-2 pr-4">Keuntungan</th>
                      <th className="text-left py-2 pr-4">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesByItem.length === 0 ? (
                      <tr><td className="py-3 pr-4 text-gray-500" colSpan={6}>Transaksi Kosong</td></tr>
                    ) : salesByItem.map((r) => (
                      <tr key={`${r.date}-${r.code}`} className="border-b last:border-0">
                        <td className="py-2 pr-4">{r.code}</td>
                        <td className="py-2 pr-4">{r.name}</td>
                        <td className="py-2 pr-4">{r.qty}</td>
                        <td className="py-2 pr-4">{r.trxCount}</td>
                        <td className="py-2 pr-4">{fmtIDR(r.profit)}</td>
                        <td className="py-2 pr-4">{fmtIDR(r.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-right text-xs text-gray-500">Business Account</div>
            </Card>

            <div className="grid grid-cols-12 gap-4">
              <Card className="col-span-12 lg:col-span-6" title={<div className="font-semibold">Laporan Penjualan Per Staff <span className="text-xs font-normal text-gray-500">
                {new Date(activeDate).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </span></div>}>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b">
                        <th className="text-left py-2 pr-4">Email</th>
                        <th className="text-left py-2 pr-4">Jumlah Transaksi</th>
                        <th className="text-left py-2 pr-4">Keuntungan</th>
                        <th className="text-left py-2 pr-4">Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesByStaff.length === 0 ? (
                        <tr><td className="py-3 pr-4 text-gray-500" colSpan={4}>Transaksi Kosong</td></tr>
                      ) : salesByStaff.map((r) => (
                        <tr key={`${r.date}-${r.email}`} className="border-b last:border-0">
                          <td className="py-2 pr-4">{r.email}</td>
                          <td className="py-2 pr-4">{r.trxCount}</td>
                          <td className="py-2 pr-4">{fmtIDR(r.profit)}</td>
                          <td className="py-2 pr-4">{fmtIDR(r.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-right text-xs text-gray-500">Business Account</div>
              </Card>

              <Card className="col-span-12 lg:col-span-6" title={<div className="font-semibold">Laporan Manajemen Stok <span className="text-xs font-normal text-gray-500">
                {new Date(activeDate).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </span></div>}>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b">
                        <th className="text-left py-2 pr-4">Tanggal</th>
                        <th className="text-left py-2 pr-4">Nama</th>
                        <th className="text-left py-2 pr-4">Masuk</th>
                        <th className="text-left py-2 pr-4">Keluar</th>
                        <th className="text-left py-2 pr-4">Stok</th>
                        <th className="text-left py-2 pr-4">Email</th>
                        <th className="text-left py-2 pr-4">Mode</th>
                        <th className="text-left py-2 pr-4">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockMoves.length === 0 ? (
                        <tr><td className="py-3 pr-4 text-gray-500" colSpan={8}>Transaksi Kosong</td></tr>
                      ) : stockMoves.map((r, i) => (
                        <tr key={`${r.date}-${r.name}-${i}`} className="border-b last:border-0">
                          <td className="py-2 pr-4">{new Date(r.date).toLocaleDateString("id-ID")}</td>
                          <td className="py-2 pr-4">{r.name}</td>
                          <td className="py-2 pr-4">{r.in}</td>
                          <td className="py-2 pr-4">{r.out}</td>
                          <td className="py-2 pr-4">{r.stock}</td>
                          <td className="py-2 pr-4">{r.email}</td>
                          <td className="py-2 pr-4">{r.mode}</td>
                          <td className="py-2 pr-4">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Floating helpers */}
            <div className="fixed right-4 bottom-4 flex flex-col gap-2">
              <button className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center shadow-lg">💬</button>
              <button className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center shadow-lg">❓</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}