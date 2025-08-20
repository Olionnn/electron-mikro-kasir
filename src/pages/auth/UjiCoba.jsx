import React from "react";

export default function MasaUjiCoba() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-2xl p-6 text-center">
        {/* Judul */}
        <h1 className="text-lg font-semibold mb-6">MASA UJI COBA</h1>

        {/* Icon */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-violet-100 rounded-lg text-2xl">
              🟨
            </div>
            <span className="text-sm mt-2">Pro</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-lg text-2xl">
              🟧
            </div>
            <span className="text-sm mt-2">POS</span>
          </div>
        </div>

        {/* Deskripsi */}
        <p className="text-gray-700 mb-3">
          Saat ini Anda sedang uji coba{" "}
          <span className="font-medium">7 hari Kasir Pintar POS Windows</span>{" "}
          dan <span className="font-medium">30 hari Kasir Pintar Pro</span>.
          Sistem Pembayaran di Kasir Pintar bersifat pascabayar yaitu membayar di
          akhir periode pemakaian. Anda boleh tidak membayar jika tidak ingin
          lanjut berlangganan.{" "}
          <a href="#" className="text-violet-600 underline">
            Baca Selengkapnya.
          </a>
        </p>
        <p className="text-gray-700 mb-6">
          Untuk penggunaan berikutnya Kasir Pintar Pro & Plugin Desktop hanya
          dikenakan biaya <span className="font-semibold">Rp 111.000</span>.
        </p>

        {/* Tombol */}
        <div className="space-y-3">
          <button className="w-full border-2 border-violet-500 text-violet-600 py-3 rounded-full font-medium hover:bg-violet-50 transition">
            Hubungi Customer Service
          </button>
          <button className="w-full bg-violet-500 text-white py-3 rounded-full font-medium hover:bg-violet-600 transition">
            Mengerti dan Mulai Panduan
          </button>
          <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition">
            Lewati Panduan
          </button>
        </div>
      </div>
    </div>
  );
}


