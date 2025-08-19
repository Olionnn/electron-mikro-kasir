'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNavbar } from '../../hooks/useNavbar';
import { MdClose, MdSave } from 'react-icons/md';

const toInt = (v) => {
  if (v === '' || v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/[^\d-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function TambahEditBarang() {
  const navigate = useNavigate();
  const { id } = useParams(); // /barang/edit/:id -> edit mode
  const isEdit = Boolean(id);

  // state form
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('Default'); // Default | Servis
  const [tampilkan, setTampilkan] = useState(true);
  const [pakaiStok, setPakaiStok] = useState(true);
  const [stok, setStok] = useState('0');
  const [kodeBarang, setKodeBarang] = useState('');
  const [hargaDasar, setHargaDasar] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [kategori, setKategori] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-set: jika tipe Servis, stok off
  useEffect(() => {
    if (tipe === 'Servis') {
      setPakaiStok(false);
      setStok('0');
    }
  }, [tipe]);

  // Preload saat edit
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        if (window.electronAPI?.getBarangById) {
          const res = await window.electronAPI.getBarangById(Number(id));
          if (mounted && res?.success && res.data) {
            const b = res.data;
            setNama(b.nama ?? '');
            setTipe(b.use_stok === false ? 'Servis' : 'Default');
            setTampilkan(Boolean(b.show_transaksi));
            setPakaiStok(Boolean(b.use_stok));
            setStok(String(b.stok ?? 0));
            setKodeBarang(b.kode ?? '');
            setHargaDasar(String(b.harga_dasar ?? ''));
            setHargaJual(String(b.harga_jual ?? ''));
            setKategori(String(b.kategori_id ?? ''));
          }
        } else {
          console.warn('electronAPI.getBarangById tidak tersedia (dev fallback).');
        }
      } catch (e) {
        console.error(e);
        alert('Gagal memuat data barang.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isEdit, id]);

  const onCancel = useCallback(() => {
    navigate('/barang-jasa');
  }, [navigate]);

  const payload = useMemo(() => ({
    nama,
    stok: pakaiStok ? toInt(stok) : 0,
    kode: kodeBarang || null,
    harga_dasar: toInt(hargaDasar),
    harga_jual: toInt(hargaJual),
    show_transaksi: tampilkan,
    use_stok: pakaiStok,
    kategori_id: kategori ? toInt(kategori) : null,
    toko_id: 1,
    image: null,
    status: true,
    created_by: 1,
    updated_by: 1,
  }), [nama, pakaiStok, stok, kodeBarang, hargaDasar, hargaJual, tampilkan, kategori]);

  const onSave = useCallback(async () => {
    if (!nama || !hargaJual) {
      alert('Nama dan Harga Jual wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      if (!window.electronAPI) {
        console.warn('electronAPI tidak tersedia, mock save.');
        alert('Tersimpan (mock).');
        navigate('/barang-jasa');
        return;
      }

      let result;
      if (isEdit && window.electronAPI.updateBarang) {
        result = await window.electronAPI.updateBarang(Number(id), payload);
      } else if (window.electronAPI.createBarang) {
        result = await window.electronAPI.createBarang(payload);
      } else {
        throw new Error('API create/update tidak tersedia');
      }

      if (result?.success) {
        alert(isEdit ? 'Barang berhasil diperbarui!' : 'Barang berhasil ditambahkan!');
        navigate('/barang-jasa');
      } else {
        alert('Gagal menyimpan barang: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving barang:', error);
      alert('Terjadi kesalahan saat menyimpan barang.');
    } finally {
      setLoading(false);
    }
  }, [isEdit, id, payload, nama, hargaJual, navigate]);

  // Navbar diatur per halaman
  useNavbar(
    {
      variant: 'page',
      title: isEdit ? 'Edit Barang' : 'Tambah Barang',
      backTo: '/barang-jasa',
      actions: [
        {
          type: 'button',
          title: 'Batal',
          onClick: onCancel,
          className: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100',
          icon: <MdClose size={18} />,
        },
        {
          type: 'button',
          title: 'Simpan',
          onClick: onSave,
          className: 'inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-60',
          icon: <MdSave size={18} />,
        },
      ],
    },
    [onCancel, onSave, isEdit]
  );

  const stokDisabled = !pakaiStok || tipe === 'Servis';

  return (
    <div className="w-screen h-screen bg-white flex">
      <div className="w-full h-full border-r border-gray-300 flex flex-col pt-10 px-10 pb-10 overflow-y-auto">

        {/* Thumbnail placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm6 2a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-6 text-lg"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-2">Nama *</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Nama barang"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Tipe Barang</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={loading}
              >
                <option value="Default">Default</option>
                <option value="Servis">Servis</option>
              </select>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tampilkan}
                onChange={(e) => setTampilkan(e.target.checked)}
                className="form-checkbox text-violet-600 w-5 h-5"
                disabled={loading}
              />
              <span className="text-gray-800">Tampilkan di Transaksi</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={pakaiStok}
                onChange={(e) => setPakaiStok(e.target.checked)}
                className="form-checkbox text-violet-600 w-5 h-5"
                disabled={loading || tipe === 'Servis'}
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
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                min="0"
                disabled={loading || stokDisabled}
                placeholder={stokDisabled ? 'Tidak menggunakan stok' : '0'}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Kode Barang</label>
              <input
                type="text"
                value={kodeBarang}
                onChange={(e) => setKodeBarang(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
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
              className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              disabled={loading}
            >
              <option value="">Pilih Kategori</option>
              <option value="1">Elektronik</option>
              <option value="2">Pakaian</option>
              <option value="3">Makanan</option>
            </select>
          </div>

          {/* Tombol bawah opsional, karena aksi sudah ada di navbar.
              Kalau mau satu sumber kebenaran, boleh dihapus. */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-violet-600 text-white font-bold py-4 rounded-full text-lg hover:bg-violet-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (isEdit ? 'MENYIMPAN...' : 'MENAMBAHKAN...') : (isEdit ? 'SIMPAN PERUBAHAN' : 'SIMPAN')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}