import React, { useState } from "react";

export default function PengaturanStok() {
  const [selected, setSelected] = useState("fifo");

  return (
    <div className="flex justify-center min-h-screen bg-white py-8">
      <div className="w-full max-w-2xl p-6">
        {/* Judul */}
        <h1 className="text-lg font-semibold mb-4">Pengaturan stok</h1>
        <p className="mb-6 text-gray-700">
          Bagaimana nantinya Anda mengelola stok dan harga dasar barang?
        </p>

        {/* Opsi */}
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="stok"
              value="fifo"
              checked={selected === "fifo"}
              onChange={() => setSelected("fifo")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">
                FIFO (First In First Out){" "}
                <span className="ml-2 bg-violet-100 text-violet-600 text-xs px-2 py-0.5 rounded-full">
                  Rekomendasi
                </span>
              </span>
              <p className="text-sm text-gray-600">
                Harga dasar barang yang terjual diambil dari barang yang pertama
                kali masuk.
              </p>
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="stok"
              value="lifo"
              checked={selected === "lifo"}
              onChange={() => setSelected("lifo")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">LIFO (Last In Last Out)</span>
              <p className="text-sm text-gray-600">
                Harga dasar barang yang terjual diambil dari barang yang terakhir
                kali masuk.
              </p>
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="stok"
              value="average"
              checked={selected === "average"}
              onChange={() => setSelected("average")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">Average</span>
              <p className="text-sm text-gray-600">
                Harga dasar barang yang terjual diambil dari rata-rata pergerakan
                harga dasar.
              </p>
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="stok"
              value="default"
              checked={selected === "default"}
              onChange={() => setSelected("default")}
              className="mt-1"
            />
            <span>
              <span className="font-medium">Default</span>
              <p className="text-sm text-gray-600">
                Harga dasar ditentukan owner di database barang.
              </p>
            </span>
          </label>
        </div>

        {/* Tombol contoh & video */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="flex items-center gap-2 border-2 border-violet-500 text-violet-600 px-4 py-2 rounded-full hover:bg-violet-50 transition">
            📦 Klik untuk Lihat Contoh
          </button>
          <button className="flex items-center gap-2 border-2 border-violet-500 text-violet-600 px-4 py-2 rounded-full hover:bg-violet-50 transition">
            🎥 Klik untuk Lihat Video
          </button>
        </div>

        {/* Tombol lanjut */}
        <div className="text-center mt-6">
          <button className="w-full bg-violet-500 text-white py-3 rounded-full font-semibold hover:bg-violet-600 transition">
            OK, LANJUT !
          </button>
        </div>
      </div>
    </div>
  );
}


