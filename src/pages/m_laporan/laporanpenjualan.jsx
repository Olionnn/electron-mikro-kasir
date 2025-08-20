import React, { useState, useCallback } from "react";
import { FiCalendar, FiX, FiDownload, FiFilter, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

const LaporanPenjualan = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("11/08/2025 - 11/08/2025");
  const [q, setQ] = useState("");
  const data = []; // kosong untuk contoh

  // ===== handlers =====
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onExport = useCallback(() => alert("Export (dummy)"), []);
  const onOpenFilterDate = useCallback(() => alert("Pilih rentang tanggal (dummy)"), []);

  // ===== useNavbar =====
  useNavbar(
    {
      variant: "page",
      title: "Laporan Penjualan",
      backTo: onBack, 
      actions: [
        {
          type: "button",
          title: "Export",
          onClick: onExport,
          label: "Export",
          className:
            "hidden sm:inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700",
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
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Date Picker (mobile/extra tools) */}
          <button
            onClick={onOpenFilterDate}
            className="inline-flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            title="Filter tanggal"
          >
            <FiCalendar className="text-violet-500 mr-2" />
            {dateRange || "Pilih tanggal"}
          </button>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Struk"
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-2 p-4">
        <div className="flex-1 bg-violet-500 text-white text-center rounded-full py-2 shadow-sm">
          <p className="text-xs opacity-90">Jml Transaksi</p>
          <p className="font-bold text-sm">0</p>
        </div>
        <div className="flex-1 bg-violet-600 text-white text-center rounded-full py-2 shadow-sm">
          <p className="text-xs opacity-90">Pendapatan</p>
          <p className="font-bold text-sm">Rp 0</p>
        </div>
        <div className="flex-1 bg-violet-700 text-white text-center rounded-full py-2 shadow-sm">
          <p className="text-xs opacity-90">Keuntungan</p>
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
          <span>Piutang</span>
        </label>
      </div>

      {/* Content */}
      <div className="flex flex-1 border-t min-h-0">
        {/* Table */}
        <div className="w-full lg:w-1/2 border-r min-h-0">
          <div className="grid grid-cols-4 bg-gray-50 text-sm font-medium text-gray-600 py-2 px-3 border-b sticky top-0">
            <span>Tanggal</span>
            <span>No.Transaksi</span>
            <span>Pendapatan</span>
            <span>Keuntungan</span>
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

      {/* Footer actions (mobile) */}
      <div className="p-4 border-t flex gap-2 sm:hidden">
        <button
          onClick={onOpenFilterDate}
          className="flex-1 inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          <FiCalendar /> {dateRange || "Pilih tanggal"}
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          <FiDownload /> Export
        </button>
      </div>
    </div>
  );
};

export default LaporanPenjualan;