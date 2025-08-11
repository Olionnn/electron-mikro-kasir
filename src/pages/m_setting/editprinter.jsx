import React, { useState } from "react";

export default function StrukTransaksi() {
  const [jumlahCetak, setJumlahCetak] = useState(1);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b">
        <button className="mr-2 text-lg">←</button>
        <h1 className="text-lg font-semibold">STRUK TRANSAKSI</h1>
      </div>

      <div className="p-4 space-y-5">
        {/* Printer */}
        <div>
          <p className="text-sm text-gray-600">Printer</p>
          <p className="font-medium">POS-80</p>
        </div>

        {/* Jenis Kertas */}
        <div>
          <label className="block mb-1 font-medium">Jenis Kertas</label>
          <select className="w-full border rounded-lg px-3 py-2 focus:outline-none">
            <option>Kertas Thermal 80</option>
            <option>Kertas Thermal 58</option>
          </select>
        </div>

        {/* Checkbox */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-5 h-5" />
            <span>Auto Print di Transaksi</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-5 h-5" />
            <span>Jadikan sebagai Printer Utama</span>
            <span className="text-green-500 text-lg">ⓘ</span>
          </label>
        </div>

        {/* Jumlah Tercetak */}
        <div>
          <label className="block mb-1 font-medium">Jumlah Tercetak</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setJumlahCetak(Math.max(1, jumlahCetak - 1))}
              className="px-3 py-1 border rounded-lg"
            >
              −
            </button>
            <span>{jumlahCetak}</span>
            <button
              onClick={() => setJumlahCetak(jumlahCetak + 1)}
              className="px-3 py-1 border rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Format Teks */}
        <div>
          <p className="font-medium mb-2">Format Teks</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Panjang Karakter Struk</label>
              <input
                type="number"
                defaultValue={32}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Ukuran Font</label>
              <input
                type="number"
                defaultValue={9}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Jenis Font */}
        <div>
          <label className="block mb-1 font-medium">Jenis Font</label>
          <select className="w-full border rounded-lg px-3 py-2">
            <option>Roboto (Regular)</option>
            <option>Arial</option>
            <option>Courier New</option>
          </select>
        </div>

        {/* Batas Margin */}
        <div>
          <p className="font-medium mb-2">Batas Margin</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Jumlah baris margin bawah</label>
              <input
                type="number"
                defaultValue={1}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Margin Horizontal</label>
              <input
                type="number"
                defaultValue={8}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simpan */}
      <div className="p-4">
        <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold">
          Simpan
        </button>
      </div>
    </div>
  );
}
