import React from "react";
import { MdSync } from "react-icons/md";

const SyncPage = () => {
  const syncItems = [
    "Manajemen", "Pelanggan", "Supplier", "Diskon", "Pajak",
    "Biaya", "Pesanan", "Draft Pembelian", "Kategori", "Staff",
    "Promosi", "Shift", "Gambar Produk"
  ];

  return (
    <div className="h-screen bg-white p-8 overflow-y-auto">

      <h2 className="text-2xl font-bold mb-4">Download Data</h2>
      <p className="text-base text-gray-700 mb-6">
        Ambil data dari cloud ke perangkat Anda.
      </p>

      {/* List Sinkronisasi */}
      <div className="space-y-6">
        {syncItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-5 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {/* Nama Item */}
            <div className="w-48 font-medium">{item}</div>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-gray-500 h-3 rounded w-0"></div>
              </div>
            </div>

            {/* Data Count */}
            <div className="w-24 text-base text-gray-600 text-right">0 data</div>

            {/* Tombol Sinkronkan */}
            <button
              className="text-green-600 hover:text-green-700 p-2 rounded-lg"
              title="Sinkronkan"
            >
              <MdSync className="text-2xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyncPage;