import { useState } from "react";
import {
  FiRefreshCw,
  FiFilter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiHash,
  FiFileText,
} from "react-icons/fi";

export default function SupplierPage() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const suppliers = [
    {
      id: 1,
      nama_supplier: "PT Maju Jaya",
      kode: "SUP001",
      email: "info@majujaya.com",
      no_telp: "021-123456",
      alamat: "Jl. Industri No. 5, Jakarta",
      npwp: "12.345.678.9-012.345",
      image: null,
      status: true,
      created_at: "2025-07-10",
      updated_at: "2025-08-08",
    },
    {
      id: 2,
      nama_supplier: "CV Sumber Makmur",
      kode: "SUP002",
      email: "sumbermakmur@mail.com",
      no_telp: "022-987654",
      alamat: "Jl. Pasar Baru No. 12, Bandung",
      npwp: null,
      image: null,
      status: false,
      created_at: "2025-07-15",
      updated_at: "2025-08-07",
    },
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar Supplier */}
      <div className="w-1/3 border-r flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-lg font-semibold text-gray-700">Supplier</h1>
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

        {/* List Supplier */}
        <div className="flex-1 overflow-y-auto">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              onClick={() => setSelectedSupplier(sup)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedSupplier?.id === sup.id
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <h3 className="font-semibold text-gray-800">{sup.nama_supplier}</h3>
              <p className="text-sm text-gray-500">{sup.no_telp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Supplier */}
      <div className="flex-1 p-6">
        {selectedSupplier ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg">
            {/* Foto / Icon */}
            <div className="flex flex-col items-center mb-4">
              {selectedSupplier.image ? (
                <img
                  src={selectedSupplier.image}
                  alt={selectedSupplier.nama_supplier}
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="text-4xl text-gray-500" />
                </div>
              )}
              <h2 className="text-xl font-bold mt-2">
                {selectedSupplier.nama_supplier}
              </h2>
              <span
                className={`text-sm px-2 py-1 rounded-full mt-1 ${
                  selectedSupplier.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedSupplier.status ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiHash className="text-green-600" />
                <span>Kode: {selectedSupplier.kode || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMail className="text-green-600" />
                <span>{selectedSupplier.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="text-green-600" />
                <span>{selectedSupplier.no_telp || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMapPin className="text-green-600" />
                <span>{selectedSupplier.alamat || "-"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiFileText className="text-green-600" />
                <span>NPWP: {selectedSupplier.npwp || "-"}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-4 text-sm text-gray-500 border-t pt-3">
              <p>Dibuat: {selectedSupplier.created_at}</p>
              <p>Diupdate: {selectedSupplier.updated_at}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Belum ada data supplier terpilih
          </div>
        )}
      </div>
    </div>
  );
}
