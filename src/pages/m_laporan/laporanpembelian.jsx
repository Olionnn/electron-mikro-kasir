import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import { FiCalendar, FiSearch, FiX, FiFilter, FiDownload } from "react-icons/fi";

const LaporanPembelian = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("11/08/2025 - 11/08/2025");
  const [q, setQ] = useState("");
  const data = []; // dummy

  // Handlers
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onExport = useCallback(() => alert("Export (dummy)"), []);
  const onOpenFilterDate = useCallback(() => alert("Pilih rentang tanggal (dummy)"), []);

  // Navbar
  useNavbar(
    {
      variant: "page",
      title: "Laporan Pembelian",
      backTo: onBack,
      actions: [
        {
          type: "button",
          title: "Export",
          onClick: onExport,
          label: "Export",
          className:
            "hidden sm:inline-flex items-center gap-2 bg-violet-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-violet-700",
        },
      ],
      rightExtra: (
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenFilterDate}
            className="inline-flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
            title="Filter tanggal"
          >
            <FiFilter />
            {dateRange || "Pilih tanggal"}
          </button>
        </div>
      ),
    },
    [onBack, onExport, onOpenFilterDate, dateRange]
  );

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Filter Bar */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center bg-white">
        {/* Date Picker */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 max-w-[360px] focus-within:ring-2 focus-within:ring-violet-200">
          <FiCalendar className="text-violet-600 mr-2" />
          <button
            onClick={onOpenFilterDate}
            className="text-left flex-1 truncate hover:opacity-80"
            title="Pilih tanggal"
          >
            {dateRange || "Pilih tanggal"}
          </button>
          <button
            className="ml-2 text-gray-400 hover:text-red-500"
            onClick={() => setDateRange("")}
            title="Bersihkan"
          >
            <FiX />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Struk"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>

        {/* Export (mobile) */}
        <button
          onClick={onExport}
          className="sm:hidden inline-flex items-center gap-2 bg-violet-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-violet-700"
        >
          <FiDownload /> Export
        </button>
      </div>

      {/* Summary */}
      <div className="flex px-4 py-3 gap-2">
        <div className="flex-1 bg-violet-500 text-white text-center rounded-full py-2 shadow-sm">
          <p className="text-[11px] opacity-90">Jumlah Pembelian</p>
          <p className="font-bold text-sm">0</p>
        </div>
        <div className="flex-1 bg-violet-600 text-white text-center rounded-full py-2 shadow-sm">
          <p className="text-[11px] opacity-90">Total Tagihan</p>
          <p className="font-bold text-sm">Rp 0</p>
        </div>
        <div className="flex-1 bg-violet-700 text-white text-center rounded-full py-2 shadow-sm">
          <p className="text-[11px] opacity-90">Yang Dibayarkan</p>
          <p className="font-bold text-sm">Rp 0</p>
        </div>
      </div>

      {/* Filter Radio */}
      <div className="flex gap-5 px-4 pb-2 text-sm text-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="filter" defaultChecked />
          <span>Semua Transaksi</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="filter" />
          <span>Hutang</span>
        </label>
      </div>

      {/* Content */}
      <div className="flex flex-1 border-t min-h-0">
        {/* Table */}
        <div className="w-full lg:w-1/2 border-r min-h-0">
          <div className="grid grid-cols-4 bg-gray-50 text-sm font-medium text-gray-600 py-2 px-3 border-b sticky top-0">
            <span>Tanggal</span>
            <span>No.Pembelian</span>
            <span>Tagihan</span>
            <span>Dibayarkan</span>
          </div>
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Belum ada data transaksi
            </div>
          ) : (
            // render rows di sini
            <div />
          )}
        </div>

        {/* Detail */}
        <div className="hidden lg:flex w-1/2 items-center justify-center text-gray-400 text-sm">
          Silakan pilih struk
        </div>
      </div>
    </div>
  );
};

export default LaporanPembelian;