import React from "react";
import Navbar from "../../component/Navbar";
import { MdCalendarToday } from "react-icons/md";

export default function ShiftPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar
        title="SHIFT"
        onToggleSidebar={() => console.log("Toggle Sidebar")}
      />

      {/* Konten */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] border-t">
        {/* Kiri */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <img
            src="/cash-drawer.png"
            alt="Cash Drawer"
            className="w-48 h-48 object-contain"
          />
          <p className="text-gray-600 mt-4">
            Sebelum memulai shift, harap menambahkan Cash Drawer
          </p>
          <button className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full">
            Tambah Cash Drawer
          </button>
        </div>

        {/* Kanan */}
        <div className="w-full md:w-1/2 border-l p-6 flex flex-col">
          {/* Header Riwayat */}
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h2 className="font-semibold text-gray-800">RIWAYAT</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Tanggal :</span>
              <div className="flex items-center gap-2 border border-teal-500 rounded-lg px-3 py-1 cursor-pointer">
                <MdCalendarToday className="text-teal-500" />
                <span className="text-gray-800">
                  01/08/2025 - 31/08/2025
                </span>
              </div>
            </div>
          </div>

          {/* Data Kosong */}
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Data Riwayat Kosong
          </div>
        </div>
      </div>
    </div>
  );
}
