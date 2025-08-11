import React, { useCallback } from "react";
import { MdCalendarToday } from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";
import { useNavigate } from "react-router-dom";

export default function ShiftPage() {
  const navigate = useNavigate();

  // Aksi untuk tombol kembali
  const onBack = useCallback(() => navigate(-1), [navigate]);

  // Implementasi useNavbar
  useNavbar(
    {
      variant: "page", // bisa "pos" atau "page"
      title: "SHIFT",
      backTo: null,
      actions: [
        {
          type: "button",
          title: "Pengaturan",
          onClick: () => console.log("Pengaturan Shift"),
          className: "rounded-full w-12 h-12 text-gray-700 hover:bg-gray-100",
          icon: <MdCalendarToday size={20} />,
        },
      ],
    },
    [onBack]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Konten */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] border-t">
        {/* Panel Kiri */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
          <img
            src="/cash-drawer.png"
            alt="Cash Drawer"
            className="w-48 h-48 object-contain drop-shadow-sm"
          />
          <p className="text-gray-600 mt-6 text-lg max-w-xs">
            Sebelum memulai shift, harap menambahkan Cash Drawer
          </p>
          <button className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full shadow transition-all duration-200">
            Tambah Cash Drawer
          </button>
        </div>

        {/* Panel Kanan */}
        <div className="w-full md:w-1/2 border-l bg-white p-6 flex flex-col shadow-inner">
          {/* Header Riwayat */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4">
            <h2 className="font-bold text-gray-800 text-lg tracking-wide">
              RIWAYAT
            </h2>
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <span className="text-gray-700 font-medium">Tanggal :</span>
              <div className="flex items-center gap-2 border border-teal-500 rounded-lg px-3 py-1 cursor-pointer hover:bg-teal-50 transition">
                <MdCalendarToday className="text-teal-500" />
                <span className="text-gray-800 font-medium">
                  01/08/2025 - 31/08/2025
                </span>
              </div>
            </div>
          </div>

          {/* Data Kosong */}
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <img
              src="https://via.placeholder.com/120x120?text=No+Data"
              alt="No Data"
              className="mb-4 opacity-70"
            />
            <p className="text-center">Data Riwayat Kosong</p>
          </div>
        </div>
      </div>
    </div>
  );
}