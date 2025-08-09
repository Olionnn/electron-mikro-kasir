import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        // const result = await window.electronAPI.getKategoriList({
        //   pagination: { limit: 50, page: 1 },
        //   filter: { search: searchTerm }
        // });
        // setCategories(result.data.items || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [searchTerm]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header - konsisten dengan tema AdminLayout */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/management" className="text-2xl text-gray-700 hover:text-green-600">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Kategori Barang</h1>
        </div>
        <button className="text-green-600 hover:text-green-700 flex items-center gap-2">
          🔄 Refresh (F5)
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full flex flex-col bg-white border-r border-gray-200">
          

          <div className="p-6 border-b">
            <input
              type="text"
              placeholder="🔍 Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex-1 overflow-auto p-6">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                <div className="text-6xl mb-4">📁</div>
                <div className="text-xl mb-2">Database kosong</div>
                <div className="text-lg">Silakan tekan tombol tambah kategori di bawah</div>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={category.id || index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 font-bold">
                          {category.nama ? category.nama.charAt(0).toUpperCase() : 'K'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{category.nama || 'Kategori'}</div>
                        <div className="text-gray-500 text-sm">
                          {category.jumlah_barang || 0} barang
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">›</div>
                  </div>
                ))}
              </div>
            )}
          </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl rounded-xl font-bold transition-colors"
            >
              ➕ TAMBAH KATEGORI
            </button>
          
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsModalOpen(false);
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                      Nama Kategori
                    </label>
                    <input
                      id="categoryName"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
  );
}