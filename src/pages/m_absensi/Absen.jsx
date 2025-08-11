import React from "react";
import Navbar from "../../component/Navbar";
import { MdCalendarToday } from "react-icons/md";

export default function AbsensiPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar
        title="ABSENSI"
        onToggleSidebar={() => console.log("Toggle Sidebar")}
      />

      {/* Konten */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] border-t">
        {/* Kiri */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <img
            src="/absensi-illustration.png"
            alt="Absensi"
            className="w-48 h-48 object-contain"
          />
          <p className="text-gray-600 mt-4">
            Silakan lakukan absensi untuk memulai atau mengakhiri hari kerja.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full">
              Absen Masuk
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full">
              Absen Pulang
            </button>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-full md:w-1/2 border-l p-6 flex flex-col">
          {/* Header Riwayat */}
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h2 className="font-semibold text-gray-800">RIWAYAT ABSENSI</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Tanggal :</span>
              <div className="flex items-center gap-2 border border-green-500 rounded-lg px-3 py-1 cursor-pointer">
                <MdCalendarToday className="text-green-500" />
                <span className="text-gray-800">
                  01/08/2025 - 31/08/2025
                </span>
              </div>
            </div>
          </div>

          {/* Data Kosong */}
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Data Absensi Kosong
          </div>
        </div>
      </div>
    </div>
  );
}
