import React, { useState } from "react";
import { FiChevronLeft, FiCalendar } from "react-icons/fi";

const LaporanKeuangan = () => {
  const [dateRange, setDateRange] = useState("11/08/2025 - 11/08/2025");
  const data = []; // kosong untuk contoh

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button className="text-2xl text-gray-600">
          <FiChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Laporan Keuangan</h1>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 mb-3">
        *Hanya memuat data <span className="font-semibold">Pemasukan & Pengeluaran</span> dari menu <span className="font-semibold">Keuangan</span>
      </p>

      {/* Date Picker */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm w-fit">
          <FiCalendar className="text-green-500 mr-2" />
          <span>{dateRange}</span>
          <button
            className="ml-3 text-gray-400 hover:text-red-500"
            onClick={() => setDateRange("")}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Pemasukan Lain</p>
          <p className="text-green-600 font-bold text-lg">Rp 0</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Pengeluaran Lain</p>
          <p className="text-red-500 font-bold text-lg">Rp 0</p>
        </div>
      </div>

      {/* Banner Promo */}
      <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center justify-between mb-5">
        <div className="text-sm">
          <p className="font-semibold text-green-800">
            laporan keuangan lebih lengkap
          </p>
          <p className="text-green-700">
            Dapatkan fitur laporan keuangan lebih lengkap dengan Kasir Pintar Dashboard. Download Sekarang!
          </p>
        </div>
        <button className="text-green-800 text-lg">&gt;</button>
      </div>

      {/* Tabel */}
      <div className="w-full">
        <div className="grid grid-cols-4 bg-gray-100 text-sm font-medium text-gray-600 py-2 px-3 rounded-t-lg">
          <span>Tanggal</span>
          <span>Jumlah Transaksi</span>
          <span>Pemasukan Lain</span>
          <span>Pengeluaran Lain</span>
        </div>

        {/* Data Kosong */}
        {data.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">
            Belum ada data transaksi
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanKeuangan;
