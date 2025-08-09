import React from 'react';

export default function BarangJasaLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b text-green-600 text-xl">
        <div className="font-bold">Kasir Pintar</div>
        <div className="flex items-center gap-6">
          <span className="underline">Kategori</span>
          <span>|</span>
          <span>Barang/Jasa</span>
          <span className="bg-white text-green-600 px-3 py-1 rounded cursor-pointer">🔄 Refresh (F5)</span>
        </div>
      </div>

      {/* Konten */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kolom Kategori */}
        <div className="w-[65%] flex flex-col border-r border-gray-200">
          {/* Notifikasi */}
          <div className="bg-green-200 text-lg px-6 py-4 text-gray-900">
            📝 <span className="font-bold">Edit & hapus kategori</span> dapat dilakukan di
            <span className="underline text-blue-700 cursor-pointer"> Backoffice</span>
          </div>

          {/* Daftar Kategori */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {/* Tambahkan list kategori di sini */}
          </div>

          {/* Tombol Tambah Kategori */}
          <div className="p-6 border-t bg-white">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl rounded-lg">
              ➕ TAMBAH KATEGORI
            </button>
          </div>
        </div>

        {/* Kolom Barang */}
        <div className="w-[35%] flex flex-col bg-white">
          {/* Filter dan Pencarian */}
          <div className="p-6 border-b space-y-3">
            <input
              type="text"
              placeholder="🔍 Cari barang..."
              className="w-full border border-gray-400 rounded-lg px-4 py-3 text-lg focus:outline-none"
            />
            <div className="flex gap-3">
              <button className="flex-1 bg-green-100 py-2 rounded-lg">📦 Semua</button>
            </div>
          </div>

          {/* Daftar Barang */}
          <div className="flex-1 p-6 flex items-center justify-center text-gray-400 text-lg text-center">
            🗃️ <br />Database kosong<br />Silakan tekan tombol tambah barang di bawah
          </div>

          {/* Tombol Tambah Barang */}
          <div className="p-6 border-t">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl rounded-lg">
              ➕ TAMBAH BARANG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
