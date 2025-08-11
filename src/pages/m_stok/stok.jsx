import React, { useState } from "react";

// Contoh data awal sesuai model BarangStok
const dummyData = [
  {
    id: 1,
    toko_id: 101,
    barang_id: 201,
    harga_dasar: 50000,
    tanggal_masuk: "2025-08-01",
    jumlah_stok: 20,
    keterangan: "Stok awal bulan Agustus",
    created_by: 1,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-01",
    updated_at: "2025-08-01",
  },
  {
    id: 2,
    toko_id: 102,
    barang_id: 202,
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 15,
    keterangan: "Restock barang",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
  },
];

export default function BarangStokPage() {
  const [barangStok, setBarangStok] = useState(dummyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    toko_id: "",
    barang_id: "",
    harga_dasar: "",
    tanggal_masuk: "",
    jumlah_stok: "",
    keterangan: "",
    created_by: "",
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAdd = () => {
    const newItem = {
      id: barangStok.length + 1,
      toko_id: parseInt(formData.toko_id),
      barang_id: parseInt(formData.barang_id),
      harga_dasar: parseInt(formData.harga_dasar),
      tanggal_masuk: formData.tanggal_masuk,
      jumlah_stok: parseInt(formData.jumlah_stok),
      keterangan: formData.keterangan,
      created_by: parseInt(formData.created_by),
      updated_by: null,
      sync_at: null,
      status: formData.status,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setBarangStok([...barangStok, newItem]);
    setIsModalOpen(false);
    setFormData({
      toko_id: "",
      barang_id: "",
      harga_dasar: "",
      tanggal_masuk: "",
      jumlah_stok: "",
      keterangan: "",
      created_by: "",
      status: true,
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">📦 Barang Stok</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            + Tambah
          </button>
        </div>

        {/* Tabel */}
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Toko ID</th>
              <th className="p-2 border">Barang ID</th>
              <th className="p-2 border">Harga Dasar</th>
              <th className="p-2 border">Tanggal Masuk</th>
              <th className="p-2 border">Jumlah Stok</th>
              <th className="p-2 border">Keterangan</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {barangStok.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50">
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.toko_id}</td>
                <td className="p-2 border">{item.barang_id}</td>
                <td className="p-2 border">Rp {item.harga_dasar.toLocaleString()}</td>
                <td className="p-2 border">{item.tanggal_masuk}</td>
                <td className="p-2 border">{item.jumlah_stok}</td>
                <td className="p-2 border">{item.keterangan}</td>
                <td className="p-2 border">{item.status ? "Aktif" : "Nonaktif"}</td>
                <td className="p-2 border">{item.created_by}</td>
                <td className="p-2 border">{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Tambah Barang Stok
            </h2>
            <input
              type="number"
              name="toko_id"
              placeholder="Toko ID"
              value={formData.toko_id}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              name="barang_id"
              placeholder="Barang ID"
              value={formData.barang_id}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              name="harga_dasar"
              placeholder="Harga Dasar"
              value={formData.harga_dasar}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="date"
              name="tanggal_masuk"
              value={formData.tanggal_masuk}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              name="jumlah_stok"
              placeholder="Jumlah Stok"
              value={formData.jumlah_stok}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <textarea
              name="keterangan"
              placeholder="Keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              name="created_by"
              placeholder="Created By (User ID)"
              value={formData.created_by}
              onChange={handleChange}
              className="w-full border p-2 mb-2 rounded"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              Aktif
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
