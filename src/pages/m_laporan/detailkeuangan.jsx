import React from "react";
import { useNavigate } from "react-router-dom";

export default function LaporanKeuanganPage() {
  const navigate = useNavigate();

  const data = [
    { waktu: "11:14:26", aktifitas: "Pengeluaran", nominal: -5555 },
    { waktu: "11:14:04", aktifitas: "Pemasukan", nominal: 444444 },
  ];

  const formatRupiah = (angka) =>
    `Rp ${angka.toLocaleString("id-ID")}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-green-500 text-xl font-bold"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold">Daftar Laporan Keuangan</h1>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Export
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1">
        {/* Left side */}
        <div className="w-1/2 border-r">
          {/* Tanggal */}
          <div className="flex justify-center p-3">
            <div className="bg-gray-100 px-6 py-2 rounded-lg text-gray-700">
              11 Aug 2025
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2">Waktu</th>
                <th className="px-4 py-2">Aktifitas</th>
                <th className="px-4 py-2">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{item.waktu}</td>
                  <td className="px-4 py-2">{item.aktifitas}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      item.nominal < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {formatRupiah(Math.abs(item.nominal))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right side */}
        <div className="w-1/2 flex items-center justify-center text-gray-300">
          Data belum dipilih
        </div>
      </div>
    </div>
  );
}
