import React, { useState } from "react";
import { FiChevronLeft, FiCalendar, FiSearch, FiX } from "react-icons/fi";

const LaporanPembelian = () => {
  const [dateRange, setDateRange] = useState("11/08/2025 - 11/08/2025");
  const data = [];

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button className="text-2xl text-gray-600">
          <FiChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Laporan Pembelian</h1>
      </div>

      {/* Filter Bar */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center">
        {/* Date Picker */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 max-w-[350px]">
          <FiCalendar className="text-green-500 mr-2" />
          <span className="flex-1">{dateRange}</span>
          <button
            className="ml-2 text-gray-400 hover:text-red-500"
            onClick={() => setDateRange("")}
          >
            <FiX />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Cari Struk"
            className="outline-none flex-1"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex px-4 py-2 gap-1">
        <div className="flex-1 bg-green-500 text-white text-center rounded-full py-2">
          <p className="text-xs">Jumlah Pembelian</p>
          <p className="font-bold text-sm">0</p>
        </div>
        <div className="flex-1 bg-green-700 text-white text-center rounded-full py-2">
          <p className="text-xs">Total Tagihan</p>
          <p className="font-bold text-sm">Rp 0</p>
        </div>
        <div className="flex-1 bg-green-700 text-white text-center rounded-full py-2">
          <p className="text-xs">Yang Dibayarkan</p>
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
          Hutang
        </label>
      </div>

      {/* Content */}
      <div className="flex flex-1 border-t">
        {/* Table */}
        <div className="w-1/2 border-r">
          <div className="grid grid-cols-4 bg-gray-100 text-sm font-medium text-gray-600 py-2 px-3">
            <span>Tanggal</span>
            <span>No.Pembelian</span>
            <span>Tagihan</span>
            <span>Dibayarkan</span>
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

export default LaporanPembelian;
