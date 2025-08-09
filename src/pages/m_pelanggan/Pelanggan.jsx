import { useState } from "react";
import { FiRefreshCw, FiFilter, FiMail, FiPhone, FiMapPin, FiAward, FiHash, FiUser } from "react-icons/fi";

export default function PelangganPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = [
    {
      id: 1,
      toko_id: 101,
      nama: "Budi Santoso",
      poin: 120,
      kode: "PLG001",
      email: "budi@example.com",
      no_telp: "08123456789",
      alamat: "Jl. Merdeka No. 10, Jakarta",
      image: null,
      created_by: 1,
      updated_by: 2,
      sync_at: "2025-08-01",
      status: true,
      created_at: "2025-07-15",
      updated_at: "2025-08-09"
    },
    {
      id: 2,
      toko_id: 102,
      nama: "Siti Aminah",
      poin: 80,
      kode: "PLG002",
      email: "siti@example.com",
      no_telp: "08129876543",
      alamat: "Jl. Melati No. 5, Bandung",
      image: null,
      created_by: 1,
      updated_by: 1,
      sync_at: null,
      status: false,
      created_at: "2025-07-20",
      updated_at: "2025-08-08"
    },
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar Pelanggan */}
      <div className="w-1/3 border-r flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-lg font-semibold text-gray-700">Pelanggan</h1>
          <button className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm">
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Search */}
        <div className="p-4 flex items-center gap-2 border-b">
          <button className="p-2 border rounded-lg hover:bg-gray-100">
            <FiFilter className="text-xl text-green-600" />
          </button>
          <input
            type="text"
            placeholder="Cari nama, email atau no. telp..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* List Pelanggan */}
        <div className="flex-1 overflow-y-auto">
          {customers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomer(cust)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedCustomer?.id === cust.id
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <h3 className="font-semibold text-gray-800">{cust.nama}</h3>
              <p className="text-sm text-gray-500">{cust.no_telp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Pelanggan */}
      <div className="flex-1 p-6">
        {selectedCustomer ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg">
            {/* Foto */}
            <div className="flex flex-col items-center mb-4">
              {selectedCustomer.image ? (
                <img
                  src={selectedCustomer.image}
                  alt={selectedCustomer.nama}
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="text-4xl text-gray-500" />
                </div>
              )}
              <h2 className="text-xl font-bold mt-2">{selectedCustomer.nama}</h2>
              <span
                className={`text-sm px-2 py-1 rounded-full mt-1 ${
                  selectedCustomer.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedCustomer.status ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiAward className="text-green-600" />
                <span>Poin: {selectedCustomer.poin}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiHash className="text-green-600" />
                <span>Kode: {selectedCustomer.kode || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMail className="text-green-600" />
                <span>{selectedCustomer.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="text-green-600" />
                <span>{selectedCustomer.no_telp || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMapPin className="text-green-600" />
                <span>{selectedCustomer.alamat || "-"}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-4 text-sm text-gray-500 border-t pt-3">
              <p>Dibuat: {selectedCustomer.created_at}</p>
              <p>Diupdate: {selectedCustomer.updated_at}</p>
              {selectedCustomer.sync_at && <p>Sync: {selectedCustomer.sync_at}</p>}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Belum ada data pelanggan terpilih
          </div>
        )}
      </div>
    </div>
  );
}
