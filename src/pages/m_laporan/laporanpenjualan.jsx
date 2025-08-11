import React, { useState } from "react";
import { FiChevronLeft, FiCalendar, FiX } from "react-icons/fi";

const LaporanPenjualan = () => {
  const [dateRange, setDateRange] = useState("11/08/2025 - 11/08/2025");
  const data = []; // kosong untuk contoh

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button className="text-2xl text-gray-600">
          <FiChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Laporan Penjualan</h1>
      </div>

      {/* Banner */}
      <div className="bg-green-100 text-green-800 p-3 flex justify-between items-start">
        <div>
          <p className="font-medium">Kelola laporan lebih lengkap dan leluasa</p>
          <p className="text-green-600 font-medium cursor-pointer">
            Kasir Pintar Dashboard
          </p>
        </div>
        <button className="text-gray-500">
          <FiX />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Date Picker */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <FiCalendar className="text-green-500 mr-2" />
            <span>{dateRange}</span>
            <button
              className="ml-3 text-gray-400 hover:text-red-500"
              onClick={() => setDateRange("")}
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Cari Struk"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-1 p-4">
        <div className="flex-1 bg-green-500 text-white text-center rounded-full py-2">
          <p className="text-xs">Jml Transaksi</p>
          <p className="font-bold text-sm">0</p>
        </div>
        <div className="flex-1 bg-green-700 text-white text-center rounded-full py-2">
          <p className="text-xs">Pendapatan</p>
          <p className="font-bold text-sm">Rp 0</p>
        </div>
        <div className="flex-1 bg-green-700 text-white text-center rounded-full py-2">
          <p className="text-xs">Keuntungan</p>
          <p className="font-bold text-sm">Rp 0</p>
        </div>
      </div>

      {/* Filter Radio */}
      <div className="flex gap-5 px-4 pb-2 text-sm">
        <label className="flex items-center gap-1">
          <input type="radio" name="filter" defaultChecked />
          Semua Transaksi
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="filter" />
          Piutang
        </label>
      </div>

      {/* Content */}
      <div className="flex flex-1 border-t">
        {/* Table */}
        <div className="w-1/2 border-r">
          <div className="grid grid-cols-4 bg-gray-100 text-sm font-medium text-gray-600 py-2 px-3">
            <span>Tanggal</span>
            <span>No.Transaksi</span>
            <span>Pendapatan</span>
            <span>Keuntungan</span>
          </div>
          {data.length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm">
              Belum ada data transaksi
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="w-1/2 flex items-center justify-center text-gray-400 text-sm">
          Silahkan pilih struk
        </div>
      </div>
    </div>
  );
};

export default LaporanPenjualan;
