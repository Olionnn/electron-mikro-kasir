'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TambahEditBarang = () => { // Remove async from component declaration
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('Default');
  const [tampilkan, setTampilkan] = useState(true);
  const [pakaiStok, setPakaiStok] = useState(true);
  const [stok, setStok] = useState('0');
  const [kodeBarang, setKodeBarang] = useState('');
  const [hargaDasar, setHargaDasar] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [kategori, setKategori] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => { 
    event.preventDefault();

    if (!nama || !hargaJual) {
      alert('Nama dan Harga Jual wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const barangData = {
        nama: nama,
        stok: parseInt(stok) || 0,
        kode: kodeBarang || null,
        harga_dasar: parseInt(hargaDasar) || 0,
        harga_jual: parseInt(hargaJual) || 0,
        show_transaksi: tampilkan,
        use_stok: pakaiStok,
        kategori_id: kategori ? parseInt(kategori) : null,
        toko_id: 1, 
        image: null,
        status: true,
        created_by: 1,
        updated_by: 1
      };

      const result = await window.electronAPI.createBarang(barangData);

      if (result.success) {
        alert('Barang berhasil ditambahkan!');
        navigate('/barang-jasa'); // Navigate to barang list
      } else {
        alert('Gagal menambahkan barang: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating barang:', error);
      alert('Terjadi kesalahan saat menambahkan barang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex">
      <div className="w-full h-full border-r border-gray-300 flex flex-col pt-10 px-10 pb-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Link to="/barang-jasa" className="text-gray-600 hover:text-green-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold">Tambah Barang</h1>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm6 2a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-lg">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Nama *</label>
            <input 
              type="text" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
              placeholder="Nama barang" 
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Tipe Barang</label>
            <select 
              value={tipe} 
              onChange={(e) => setTipe(e.target.value)} 
              className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              <option value="Default">Default</option>
              <option value="Servis">Servis</option>
            </select>
          </div>

          <div className="space-y-3 text-lg">
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={tampilkan} 
                onChange={(e) => setTampilkan(e.target.checked)} 
                className="form-checkbox text-green-600 w-5 h-5"
                disabled={loading}
              />
              <span className="text-gray-800">Tampilkan Di Transaksi</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={pakaiStok} 
                onChange={(e) => setPakaiStok(e.target.checked)} 
                className="form-checkbox text-green-600 w-5 h-5"
                disabled={loading}
              />
              <span className="text-gray-800">Pakai Stok</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Stok</label>
              <input 
                type="number" 
                value={stok} 
                onChange={(e) => setStok(e.target.value)} 
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Kode Barang</label>
              <input 
                type="text" 
                value={kodeBarang} 
                onChange={(e) => setKodeBarang(e.target.value)} 
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Kode unik barang"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Harga Dasar</label>
              <input 
                type="number" 
                value={hargaDasar} 
                onChange={(e) => setHargaDasar(e.target.value)} 
                placeholder="0" 
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Harga Jual *</label>
              <input 
                type="number" 
                value={hargaJual} 
                onChange={(e) => setHargaJual(e.target.value)} 
                placeholder="0" 
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Kategori</label>
            <select 
              value={kategori} 
              onChange={(e) => setKategori(e.target.value)} 
              className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              <option value="">Pilih Kategori</option>
              {/* You can populate this with actual categories from your database */}
              <option value="1">Elektronik</option>
              <option value="2">Pakaian</option>
              <option value="3">Makanan</option>
            </select>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 rounded-full text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'MENYIMPAN...' : 'SIMPAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahEditBarang;