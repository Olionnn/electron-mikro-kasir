import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const result = await window.electronAPI.getKategoriList({
        pagination: { limit: 50, page: 1 },
        filter: { search: searchTerm },
      });
      setCategories(result?.data?.items || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "F5") {
        e.preventDefault();
        fetchCategories();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nama = newCategoryName.trim();
    if (!nama) return;
  
    try {
      setSaving(true);
      await window.electronAPI.createKategori({ nama });
      setNewCategoryName("");
      setIsModalOpen(false);
      await fetchCategories(); // refresh list
    } catch (err) {
      console.error("createKategori error:", err);
      alert(err?.message || "Gagal menyimpan kategori");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/management" className="text-2xl text-gray-700 hover:text-green-600">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Kategori Barang</h1>
        </div>
        <button
          className="text-green-600 hover:text-green-700 flex items-center gap-2"
          onClick={fetchCategories}
          title="Refresh (F5)"
        >
          🔄 Refresh (F5)
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
  <div className="w-full flex flex-col bg-white border-x border-gray-200 rounded-t-2xl">

    {/* Toolbar / Search (sticky) */}
    <div className="p-4 md:p-6 border-b sticky top-0 bg-white/90 backdrop-blur z-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search input with leading icon & clear */}
        <div className="relative w-full md:max-w-xl">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.09-4.14a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari kategori…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-100 text-gray-500"
              title="Bersihkan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            {categories.length} kategori
          </span>
        </div>
      </div>
    </div>

    {/* List */}
    <div className="flex-1 overflow-auto p-4 md:p-6">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <span className="text-4xl">📁</span>
              </div>
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-1">Database kosong</div>
            <div className="text-gray-500 mb-4">Silakan tambah kategori terlebih dahulu</div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-green-600 hover:bg-green-700"
            >
              <span>＋</span> Tambah Kategori
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {categories.map((category, index) => (
              <button
                key={category.id || index}
                type="button"
                className="group text-left w-full p-0 rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  {/* Aksen kiri */}
                  <div className="h-full w-1.5 bg-gradient-to-b from-green-400 to-emerald-500" />
                  {/* Isi */}
                  <div className="flex-1 flex items-center gap-3 p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center shrink-0">
                      <span className="text-green-600 font-bold">
                        {category.nama ? category.nama.charAt(0).toUpperCase() : "K"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {category.nama || "Kategori"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {category.jumlah_barang ?? 0} barang
                      </div>
                    </div>
                  </div>
                  {/* Chevron */}
                  <div className="pr-4 text-gray-300 group-hover:text-gray-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA Tambah (sticky bottom on mobile look) */}
      <div className="border-t p-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl font-semibold transition-colors"
        >
          TAMBAH KATEGORI
        </button>
      </div>
    </div>
  </div>

      {/* Modal Tambah Kategori */}
      <Modal open={isModalOpen} title="Tambah Kategori" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Nama Kategori
            </label>
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="cth: Makanan, Elektronik, ATK..."
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              data-autofocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!newCategoryName.trim() || saving}
              className="rounded-xl px-4 py-2.5 text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}