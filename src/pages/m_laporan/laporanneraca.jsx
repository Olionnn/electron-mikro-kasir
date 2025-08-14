import React, { useState, useMemo } from "react";
import { Card } from "../../component/SimpleCard";
import { useNavbar } from "../../hooks/useNavbar";

export default function LaporanPenjualan() {
  const penjualan = [
    { nama: "Produk A", jumlah: 10, harga: 50000, subtotal: 500000 },
    { nama: "Produk B", jumlah: 5, harga: 75000, subtotal: 375000 },
    { nama: "Produk C", jumlah: 3, harga: 60000, subtotal: 180000 },
    { nama: "Produk D", jumlah: 8, harga: 90000, subtotal: 720000 },
    { nama: "Produk E", jumlah: 12, harga: 45000, subtotal: 540000 },
  ];

  const pembelian = [
    { nama: "Produk A", jumlah: 10, harga: 30000, subtotal: 300000 },
    { nama: "Produk B", jumlah: 5, harga: 50000, subtotal: 250000 },
    { nama: "Produk C", jumlah: 3, harga: 40000, subtotal: 120000 },
    { nama: "Produk D", jumlah: 8, harga: 70000, subtotal: 560000 },
    { nama: "Produk E", jumlah: 12, harga: 30000, subtotal: 360000 },
  ];

  const totalPenjualan = penjualan.reduce((acc, item) => acc + item.subtotal, 0);
  const totalPembelian = pembelian.reduce((acc, item) => acc + item.subtotal, 0);
  const totalTerjual = penjualan.reduce((acc, item) => acc + item.jumlah, 0);
  const keuntungan = totalPenjualan - totalPembelian;

  // State Search & Pagination
  const [searchPenjualan, setSearchPenjualan] = useState("");
  const [searchPembelian, setSearchPembelian] = useState("");
  const [pagePenjualan, setPagePenjualan] = useState(1);
  const [pagePembelian, setPagePembelian] = useState(1);
  const itemsPerPage = 3;

  // Filter data
  const filteredPenjualan = useMemo(() => {
    return penjualan.filter((item) =>
      item.nama.toLowerCase().includes(searchPenjualan.toLowerCase())
    );
  }, [penjualan, searchPenjualan]);

  const filteredPembelian = useMemo(() => {
    return pembelian.filter((item) =>
      item.nama.toLowerCase().includes(searchPembelian.toLowerCase())
    );
  }, [pembelian, searchPembelian]);

  // Pagination data
  const paginatedPenjualan = useMemo(() => {
    const start = (pagePenjualan - 1) * itemsPerPage;
    return filteredPenjualan.slice(start, start + itemsPerPage);
  }, [filteredPenjualan, pagePenjualan]);

  const paginatedPembelian = useMemo(() => {
    const start = (pagePembelian - 1) * itemsPerPage;
    return filteredPembelian.slice(start, start + itemsPerPage);
  }, [filteredPembelian, pagePembelian]);

  // Navbar
  useNavbar({
    variant: "page",
    title: "Laporan Penjualan",
    backTo: "/laporan",
    actions: [],
    rightExtra: (
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
    ),
  });

  return (
    <div className="h-full bg-gray-100 flex">
      <div className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 space-y-6">
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
                  <span>Rp {Math.abs(keuntungan).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Detail Penjualan */}
          <Card>
  <div className="flex justify-between items-center mb-3">
    <h2 className="font-semibold text-gray-800">Detail Harga Jual Barang</h2>
    <input
      type="text"
      placeholder="Cari produk..."
      value={searchPenjualan}
      onChange={(e) => {
        setSearchPenjualan(e.target.value);
        setPagePenjualan(1);
      }}
      className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
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
                {paginatedPenjualan.map((item, i) => (
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
                  <td colSpan="3" className="border p-2">
                    Total Penjualan
                  </td>
                  <td className="border p-2 text-right">
                    Rp {totalPenjualan.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setPagePenjualan((p) => Math.max(p - 1, 1))}
                disabled={pagePenjualan === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Halaman {pagePenjualan} dari{" "}
                {Math.ceil(filteredPenjualan.length / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  setPagePenjualan((p) =>
                    p < Math.ceil(filteredPenjualan.length / itemsPerPage) ? p + 1 : p
                  )
                }
                disabled={pagePenjualan >= Math.ceil(filteredPenjualan.length / itemsPerPage)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </Card>

          {/* Detail Pembelian */}
          <Card>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-800">Detail Harga Beli Barang</h2>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchPenjualan}
                  onChange={(e) => {
                    setSearchPenjualan(e.target.value);
                    setPagePenjualan(1);
                  }}
                  className="px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
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
                {paginatedPembelian.map((item, i) => (
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
                  <td colSpan="3" className="border p-2">
                    Total Pembelian
                  </td>
                  <td className="border p-2 text-right">
                    Rp {totalPembelian.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setPagePembelian((p) => Math.max(p - 1, 1))}
                disabled={pagePembelian === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Halaman {pagePembelian} dari{" "}
                {Math.ceil(filteredPembelian.length / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  setPagePembelian((p) =>
                    p < Math.ceil(filteredPembelian.length / itemsPerPage) ? p + 1 : p
                  )
                }
                disabled={pagePembelian >= Math.ceil(filteredPembelian.length / itemsPerPage)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
