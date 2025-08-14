import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

export default function App() {
  const [page, setPage] = useState("neraca"); // "neraca" atau "detail"
  const navigate = useNavigate();

  const onBack = useCallback(() => navigate(-1), [navigate]);

  useNavbar({
    variant: "page",
    title: "Riwayat Transaksi",
    backTo: onBack,
    actions: [],
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {page === "neraca" ? (
          <LaporanNeraca onDetailClick={() => setPage("detail")} />
        ) : (
          <DetailHistoryTransaksi onBackClick={() => setPage("neraca")} />
        )}
      </div>
    </div>
  );
}

function LaporanNeraca({ onDetailClick }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Filter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <input
          type="date"
          className="px-3 py-2 border rounded-lg text-sm col-span-1"
        />
        <input
          type="date"
          className="px-3 py-2 border rounded-lg text-sm col-span-1"
        />
        <select className="px-3 py-2 border rounded-lg text-sm col-span-1">
          <option>Cash Drawer</option>
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm col-span-1">
          <option>Kasir</option>
        </select>
        <div className="flex gap-2 col-span-1">
          <button className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
            Download
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-3 py-2 text-left">No</th>
            <th className="px-3 py-2 text-left">Kode Transaksi</th>
            <th className="px-3 py-2 text-left">Tanggal</th>
            <th className="px-3 py-2 text-left">Keterangan</th>
            <th className="px-3 py-2 text-left">Nominal</th>
            <th className="px-3 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-3 py-2">1</td>
            <td className="px-3 py-2">TRX-001</td>
            <td className="px-3 py-2">2025-08-13</td>
            <td className="px-3 py-2">Transaksi Penjualan</td>
            <td className="px-3 py-2">Rp 500.000</td>
            <td className="px-3 py-2">
              <button
                onClick={onDetailClick}
                className="text-emerald-600 hover:underline"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DetailHistoryTransaksi({ onBackClick }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Detail History Transaksi
        </h2>
        <button
          onClick={onBackClick}
          className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
        >
          Kembali
        </button>
      </div>

      {/* Info Transaksi */}
      <div className="mb-4">
        <p className="text-sm">
          <span className="font-semibold">Kode Transaksi:</span> TRX-001
        </p>
        <p className="text-sm">
          <span className="font-semibold">Tanggal:</span> 2025-08-13
        </p>
      </div>

      {/* Tabel Produk */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-3 py-2 text-left">No</th>
            <th className="px-3 py-2 text-left">Produk</th>
            <th className="px-3 py-2 text-left">Qty</th>
            <th className="px-3 py-2 text-left">Harga</th>
            <th className="px-3 py-2 text-left">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-3 py-2">1</td>
            <td className="px-3 py-2">Produk A</td>
            <td className="px-3 py-2">2</td>
            <td className="px-3 py-2">Rp 50.000</td>
            <td className="px-3 py-2">Rp 100.000</td>
          </tr>
          <tr className="border-b">
            <td className="px-3 py-2">2</td>
            <td className="px-3 py-2">Produk B</td>
            <td className="px-3 py-2">1</td>
            <td className="px-3 py-2">Rp 75.000</td>
            <td className="px-3 py-2">Rp 75.000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
