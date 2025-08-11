import React, { useState, useEffect } from "react";

// Contoh data awal
const dummyData = [
  {
    id: 1,
    toko_id: 101,
    keterangan: "Opname awal tahun",
    created_by: 1,
    updated_by: null,
    created_at: "2025-08-11",
    updated_at: "2025-08-11",
  },
  {
    id: 2,
    toko_id: 102,
    keterangan: "Opname stok cabang B",
    created_by: 2,
    updated_by: null,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
];

export default function StokOpnamePage() {
  const [stokOpname, setStokOpname] = useState(dummyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    toko_id: "",
    keterangan: "",
    created_by: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    const newItem = {
      id: stokOpname.length + 1,
      toko_id: parseInt(formData.toko_id),
      keterangan: formData.keterangan,
      created_by: parseInt(formData.created_by),
      updated_by: null,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setStokOpname([...stokOpname, newItem]);
    setIsModalOpen(false);
    setFormData({ toko_id: "", keterangan: "", created_by: "" });
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-green-600">📦 Stok Opname</h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            + Tambah
          </button>
        </div>

        {/* Tabel */}
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Toko ID</th>
              <th className="p-2 border">Keterangan</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {stokOpname.map((item) => (
              <tr key={item.id} className="hover:bg-green-50">
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.toko_id}</td>
                <td className="p-2 border">{item.keterangan}</td>
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
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Tambah Stok Opname
            </h2>
            <input
              type="number"
              name="toko_id"
              placeholder="Toko ID"
              value={formData.toko_id}
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
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
