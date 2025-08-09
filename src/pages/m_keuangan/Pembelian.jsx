import React from "react";

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[280px] border-r border-gray-200 p-6 space-y-4 bg-white">
        <div className="text-xl font-bold mb-6">← Marketing</div>

        <button className="w-full bg-green-100 border border-green-400 text-left px-4 py-3 rounded-lg text-lg hover:bg-green-200">
          Promosi
          <span className="float-right">›</span>
        </button>

        <button className="w-full bg-green-100 border border-green-400 text-left px-4 py-3 rounded-lg text-lg hover:bg-green-200">
          Poin
          <span className="float-right">›</span>
        </button>
      </div>

      {/* Konten */}
      <div className="flex-1 flex flex-col px-6 py-4 space-y-6 bg-gray-50">
        {/* Header */}
        <div className="flex items-center gap-4 text-xl font-bold">
          ←
          <span>POIN</span>
        </div>

        {/* Set Poin Awal */}
        <div>
          <p className="mb-2 text-lg">Fitur yang membantu</p>
          <label className="block text-base mb-1">Set Poin Awal</label>
          <input
            type="number"
            value="0"
            className="w-[120px] px-4 py-2 rounded border border-gray-300 text-lg focus:outline-none"
          />
        </div>

        {/* Data Tukar Poin */}
        <div className="space-y-2">
          <p className="text-base">⭐ Data Tukar Poin</p>
          <div className="flex gap-4">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-3 rounded-lg text-lg">
              Menjadi Diskon
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-3 rounded-lg text-lg">
              Menjadi Barang
            </button>
          </div>
        </div>

        {/* Data Dapatkan Poin */}
        <div className="space-y-2">
          <p className="text-base">⭐ Data Dapatkan Poin</p>
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-lg">
              Data Transaksi
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-lg">
              Data Barang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
