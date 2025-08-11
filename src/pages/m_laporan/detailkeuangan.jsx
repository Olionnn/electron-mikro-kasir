import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiDownload, FiSearch, FiFilter, FiChevronRight, FiTag, FiHash, FiCreditCard
} from "react-icons/fi";

export default function LaporanKeuanganPage() {
  const navigate = useNavigate();

  // ==== DUMMY DATA ====
  const data = useMemo(() => ([
    // 11 Aug 2025
    { id: "TRX-20250811-001", tanggal: "2025-08-11", waktu: "11:14:26", aktivitas: "Pengeluaran", kategori: "Operasional", metode: "Kartu Debit", nominal: -555500, catatan: "Beli kertas dan tinta", ref: "INV-OP-90813" },
    { id: "TRX-20250811-002", tanggal: "2025-08-11", waktu: "11:14:04", aktivitas: "Pemasukan", kategori: "Penjualan", metode: "Tunai", nominal: 444444, catatan: "Penjualan #10231", ref: "SO-10231" },
    // 10 Aug 2025
    { id: "TRX-20250810-003", tanggal: "2025-08-10", waktu: "15:02:11", aktivitas: "Pemasukan", kategori: "Penjualan", metode: "QRIS", nominal: 1250000, catatan: "Order online", ref: "SO-10229" },
    { id: "TRX-20250810-004", tanggal: "2025-08-10", waktu: "09:41:36", aktivitas: "Pengeluaran", kategori: "Gaji", metode: "Transfer Bank", nominal: -2500000, catatan: "Gaji harian", ref: "PAY-78512" },
    // 09 Aug 2025
    { id: "TRX-20250809-005", tanggal: "2025-08-09", waktu: "18:22:44", aktivitas: "Pemasukan", kategori: "Penjualan", metode: "Kartu Kredit", nominal: 355000, catatan: "Add-on service", ref: "SO-10188" },
  ]), []);

  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [range, setRange] = useState({ from: "2025-08-09", to: "2025-08-11" });

  const formatRupiah = (n) => `Rp ${Math.abs(n).toLocaleString("id-ID")}`;
  const toID = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

  // Filter sederhana by keyword + tanggal
  const filtered = useMemo(() => {
    const from = new Date(range.from);
    const to = new Date(range.to);
    return data.filter(d => {
      const t = new Date(d.tanggal);
      const inDate = t >= from && t <= to;
      const inSearch =
        !q ||
        d.id.toLowerCase().includes(q.toLowerCase()) ||
        d.kategori.toLowerCase().includes(q.toLowerCase()) ||
        d.aktivitas.toLowerCase().includes(q.toLowerCase()) ||
        d.catatan.toLowerCase().includes(q.toLowerCase());
      return inDate && inSearch;
    });
  }, [data, q, range]);

  // Group by tanggal
  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      acc[item.tanggal] = acc[item.tanggal] || [];
      acc[item.tanggal].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const totals = useMemo(() => {
    const pemasukan = filtered.filter(d => d.nominal > 0).reduce((s, x) => s + x.nominal, 0);
    const pengeluaran = filtered.filter(d => d.nominal < 0).reduce((s, x) => s + Math.abs(x.nominal), 0);
    return { pemasukan, pengeluaran, net: pemasukan - pengeluaran };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-green-600 text-lg font-semibold hover:opacity-80"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold">Daftar Laporan Keuangan</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
            onClick={() => alert("Filter date range dummy")}
            title="Filter tanggal"
          >
            <FiFilter /> {toID(range.from)} – {toID(range.to)}
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Top tools + summary */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
              placeholder="Cari ID, kategori, catatan…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="hidden md:flex gap-3">
            <div className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm">
              <p className="text-gray-500">Total Pemasukan</p>
              <p className="text-green-600 font-semibold">{formatRupiah(totals.pemasukan)}</p>
            </div>
            <div className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm">
              <p className="text-gray-500">Total Pengeluaran</p>
              <p className="text-red-500 font-semibold">{formatRupiah(totals.pengeluaran)}</p>
            </div>
            <div className="bg-white border rounded-lg px-4 py-2 text-sm shadow-sm">
              <p className="text-gray-500">Neto</p>
              <p className={`${totals.net >= 0 ? "text-green-600" : "text-red-500"} font-semibold`}>
                {formatRupiah(totals.net)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left: list */}
        <div className="w-full lg:w-1/2 border-r min-h-0 overflow-auto">
          {Object.keys(grouped).length === 0 && (
            <div className="flex items-center justify-center text-gray-400 h-full text-sm">
              Tidak ada data pada rentang ini
            </div>
          )}

          {Object.entries(grouped)
            .sort((a, b) => new Date(b[0]) - new Date(a[0])) // terbaru dulu
            .map(([tgl, rows]) => (
              <div key={tgl} className="px-4 py-4">
                {/* Chip tanggal */}
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-100 px-4 py-1.5 rounded-full text-gray-700 text-xs font-medium">
                    {toID(tgl)}
                  </div>
                </div>

                <div className="overflow-hidden border rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-600">
                        <th className="px-4 py-2">Waktu</th>
                        <th className="px-4 py-2">Aktivitas</th>
                        <th className="px-4 py-2">Kategori</th>
                        <th className="px-4 py-2">Nominal</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item) => {
                        const active = selected?.id === item.id;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelected(item)}
                            className={`border-t cursor-pointer transition ${
                              active ? "bg-green-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-700">{item.waktu}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.aktivitas === "Pemasukan"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {item.aktivitas}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-600">{item.kategori}</td>
                            <td className={`px-4 py-2 font-semibold ${
                              item.nominal < 0 ? "text-red-500" : "text-green-600"
                            }`}>
                              {formatRupiah(item.nominal)}
                            </td>
                            <td className="px-4 py-2 text-gray-400">
                              <FiChevronRight />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>

        {/* Right: detail */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-6">
          {!selected ? (
            <div className="text-gray-300">Pilih salah satu transaksi di kiri</div>
          ) : (
            <div className="w-full max-w-md">
              <div className="border rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">ID Transaksi</p>
                    <p className="font-semibold text-gray-800">{selected.id}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selected.aktivitas === "Pemasukan"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {selected.aktivitas}
                  </span>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500">Nominal</p>
                  <p className={`text-2xl font-bold ${
                    selected.nominal < 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    {formatRupiah(selected.nominal)}
                  </p>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <FiTag className="text-gray-400" /> Kategori:
                    <span className="font-medium">{selected.kategori}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <FiCreditCard className="text-gray-400" /> Metode:
                    <span className="font-medium">{selected.metode}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <FiHash className="text-gray-400" /> Referensi:
                    <span className="font-medium">{selected.ref}</span>
                  </li>
                  <li className="text-gray-600">
                    <span className="text-gray-500">Catatan: </span>
                    {selected.catatan || "-"}
                  </li>
                  <li className="text-gray-600">
                    <span className="text-gray-500">Waktu: </span>
                    {toID(selected.tanggal)} • {selected.waktu}
                  </li>
                </ul>

                <button
                  onClick={() => alert(`Buka detail lengkap: ${selected.id}`)}
                  className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  Lihat detail lengkap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
