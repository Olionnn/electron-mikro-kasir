import React from "react";
import { Card } from "../../component/SimpleCard";

export default function LaporanPenjualan() {
  const penjualan = [
    { nama: "Produk A", jumlah: 10, harga: 50000, subtotal: 500000 },
    { nama: "Produk B", jumlah: 5, harga: 75000, subtotal: 375000 },
    { nama: "Produk C", jumlah: 3, harga: 60000, subtotal: 180000 },
  ];

  const pembelian = [
    { nama: "Produk A", jumlah: 10, harga: 30000, subtotal: 300000 },
    { nama: "Produk B", jumlah: 5, harga: 50000, subtotal: 250000 },
    { nama: "Produk C", jumlah: 3, harga: 40000, subtotal: 120000 },
  ];

  const totalPenjualan = penjualan.reduce((acc, item) => acc + item.subtotal, 0);
  const totalPembelian = pembelian.reduce((acc, item) => acc + item.subtotal, 0);
  const totalTerjual = penjualan.reduce((acc, item) => acc + item.jumlah, 0);
  const keuntungan = totalPenjualan - totalPembelian;

  return (
    <div className="min-h-screen bg-gray-100 flex">
     

      {/* Main */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Laporan Penjualan</h1>
            <div className="flex items-center gap-2">
              <input
                type="date"
                defaultValue="2025-08-13"
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                Tampilkan
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 space-y-6">
          
          {/* Ringkasan Atas */}
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h2 className="font-semibold text-gray-800 mb-3">Total Barang Terjual</h2>
                <div className="p-3 bg-gray-50 border rounded-lg flex justify-between text-sm font-medium text-gray-800">
                  <span>Jumlah Terjual</span>
                  <span>{totalTerjual} pcs</span>
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 mb-3">Untung / Rugi Penjualan</h2>
                <div
                  className={`p-3 border rounded-lg flex justify-between text-sm font-bold ${
                    keuntungan >= 0
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <span>{keuntungan >= 0 ? "Keuntungan" : "Kerugian"}</span>
                  <span>
                    Rp {Math.abs(keuntungan).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Detail Penjualan */}
          <Card>
            <h2 className="font-semibold text-gray-800 mb-3">Detail Harga Jual Barang</h2>
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-2 text-left">Nama Produk</th>
                  <th className="border p-2 text-center">Jumlah</th>
                  <th className="border p-2 text-right">Harga Satuan</th>
                  <th className="border p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {penjualan.map((item, i) => (
                  <tr key={i}>
                    <td className="border p-2">{item.nama}</td>
                    <td className="border p-2 text-center">{item.jumlah}</td>
                    <td className="border p-2 text-right">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="border p-2 text-right">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td colSpan="3" className="border p-2">Total Penjualan</td>
                  <td className="border p-2 text-right">
                    Rp {totalPenjualan.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* Detail Pembelian */}
          <Card>
            <h2 className="font-semibold text-gray-800 mb-3">Detail Harga Beli (Modal)</h2>
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-2 text-left">Nama Produk</th>
                  <th className="border p-2 text-center">Jumlah</th>
                  <th className="border p-2 text-right">Harga Satuan</th>
                  <th className="border p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pembelian.map((item, i) => (
                  <tr key={i}>
                    <td className="border p-2">{item.nama}</td>
                    <td className="border p-2 text-center">{item.jumlah}</td>
                    <td className="border p-2 text-right">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="border p-2 text-right">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td colSpan="3" className="border p-2">Total Pembelian</td>
                  <td className="border p-2 text-right">
                    Rp {totalPembelian.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
