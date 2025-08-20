import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavbar } from "../../hooks/useNavbar";
import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function LaporanNeraca() {
  const navigate = useNavigate();

  const onBack = useCallback(() => navigate(-1), [navigate]);

  useNavbar({
    variant: "page",
    title: "Laporan Shift",
    backTo: onBack,
    actions: [],
  });


  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800">Laporan Shift</h1>
        <p className="text-sm text-gray-500 mb-6">Laporan / Laporan Shift</p>

        {/* Filter Box */}
        <div className="bg-white rounded shadow-sm border p-4 flex flex-wrap items-center gap-4 mb-6">
          {/* Tanggal */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
            <div className="flex items-center border rounded px-3 py-2 bg-white">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                defaultValue="1 Agustus 2025 - 31 Agustus 2025"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Cash Drawer */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Cash Drawer</label>
            <select className="w-full border rounded px-3 py-2 text-sm">
              <option>Semua Cashdrawer</option>
            </select>
          </div>

          {/* Kasir */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Kasir</label>
            <select className="w-full border rounded px-3 py-2 text-sm">
              <option>Semua Kasir</option>
            </select>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded mt-auto">
              Download Laporan
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow-sm border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left">Nama Staff</th>
                <th className="px-4 py-2 text-left">Email Staff</th>
                <th className="px-4 py-2 text-left">Cashdrawer</th>
                <th className="px-4 py-2 text-left">Mulai Shift</th>
                <th className="px-4 py-2 text-left">Shift Selesai</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  Belum ada data untuk tanggal yang dipilih. Coba cari tanggal lain
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500 border-t">
            <span>Showing 0 to 0 of 0 entries</span>
            <div className="flex gap-4">
              <button className="text-gray-400 cursor-not-allowed">Previous</button>
              <button className="text-gray-400 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
