import React from "react";

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-5 border-b text-gray-800 text-2xl font-bold">
        <button className="text-3xl mr-4">←</button>
        TRANSAKSI ADD ON
      </div>

      {/* Konten */}
      <div className="flex flex-col md:flex-row h-[calc(100%-8rem)] text-lg">
        {/* Kolom Kiri */}
        <div className="md:w-1/2 w-full border-r px-6 py-5">
          <div className="bg-red-100 text-red-700 rounded-md p-4 mb-4 text-base flex items-center">
            ✅ Pastikan aplikasi Owner/Staff versi minimal 150
          </div>

          {/* Pencarian */}
          <div className="flex items-center mb-4 gap-3">
            <button className="text-2xl">☰</button>
            <input
              type="text"
              placeholder="Cari Barang Add On"
              className="flex-grow border-2 border-gray-400 rounded-lg px-4 py-3 text-lg"
            />
            <button className="bg-green-200 text-green-800 px-4 py-2 rounded-lg text-lg">
              Semua
            </button>
          </div>

          {/* Tidak Ada Barang */}
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329158.png"
              className="w-36 mb-5"
              alt="Kosong"
            />
            <p className="text-xl">Belum ada barang tipe Add On</p>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="md:w-1/2 w-full px-6 py-5 flex flex-col justify-between">
          <div>
            <p className="text-xl font-semibold mb-2">3 x Beras 5KG</p>
            <p className="text-base text-gray-500">
              *Jumlah Add On mengikuti jumlah barang
            </p>
          </div>
          <p className="text-center text-gray-500 text-lg mb-4">
            Pilih Add On dari daftar di sebelah kiri
          </p>
        </div>
      </div>

      {/* Bottom Bar - Lebih Tinggi */}
      <div className="w-full px-5 py-5 bg-yellow-500 flex justify-between items-center text-white text-xl font-bold">
        <span>0 Item Add On</span>
        <button className="bg-white text-yellow-600 px-6 py-4 rounded-full hover:bg-gray-100 text-xl">
          LANJUT ➜
        </button>
      </div>
    </div>
  );
}
