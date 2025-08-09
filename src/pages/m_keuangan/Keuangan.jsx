import React from 'react';

export default function BarangJasaLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b shadow-sm bg-white sticky top-0 z-10">
        <button className="text-3xl font-bold mr-4">☰</button>
        <h1 className="text-2xl font-bold">MANAJEMEN</h1>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {[
          { icon: 'box--v1.png', label: 'Barang atau Jasa' },
          { icon: 'grid.png', label: 'Kategori Barang' },
          { icon: 'user.png', label: 'Pelanggan' },
          { icon: 'conference.png', label: 'Supplier' },
          { icon: 'sale.png', label: 'Diskon' },
          { icon: 'tax.png', label: 'Pajak' },
          { icon: 'money.png', label: 'Biaya' },
          { icon: 'marketing.png', label: 'Marketing' },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md border flex flex-col items-start gap-4 hover:shadow-lg transition bg-white text-lg font-semibold"
          >
            <img
              src={`https://img.icons8.com/ios/64/000000/${item.icon}`}
              className="w-8 h-8 icon"
              alt={item.label}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Pengaturan Transaksi */}
      <div className="w-full min-h-screen p-6 space-y-6">
        <div className="p-6 shadow-md">
          <h1 className="text-2xl font-bold">PENGATURAN TRANSAKSI</h1>
        </div>

        {/* Mode Transaksi */}
        <div className="p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Mode Transaksi</h2>
          <div className="flex items-center justify-between">
            <span className="font-medium">Full Online</span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500"></div>
              <span className="ml-3">Aktif</span>
            </label>
          </div>
          <p className="text-sm text-gray-600 italic">
            *Mengaktifkan mode online akan membuat transaksi hanya bisa dilakukan secara online.
          </p>
        </div>

        {/* Tampilan Item Barang */}
        <div className="p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Tampilan Item Barang</h2>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="view" className="w-6 h-6 text-green-600" />
              <span>List</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="view" className="w-6 h-6 text-green-600" />
              <span>Grid</span>
            </label>
          </div>
        </div>

        {/* Atribut Item Barang */}
        <div className="p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Atribut Item Barang</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Sisa Stok', 'Diskon', 'Harga', 'Letak Rak'].map((attr, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="w-6 h-6 text-green-600" />
                <span>{attr}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mode Pencarian */}
        <div className="p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Mode Pencarian Barcode Barang</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Barang Default', 'IMEI', 'Varian', 'Multisatuan'].map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="w-6 h-6 text-green-600" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-600 italic">
            *Mengaktifkan semua dapat memperlambat proses pencarian Anda.
          </p>
        </div>

        {/* Dialog Tipe Harga */}
        <div className="p-6 shadow-md">
          <h2 className="text-xl font-semibold">Dialog Tipe Harga</h2>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-6 h-6 text-green-600" />
            <span className="text-xl">Selalu tampilkan dialog tipe harga</span>
          </label>
        </div>

        {/* Potensi Untung */}
        <div className="p-6 shadow-md">
          <h2 className="text-xl font-semibold">Potensi Untung</h2>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-6 h-6 text-green-600" />
            <span className="text-xl">Tampilkan potensi untung</span>
          </label>
        </div>

        {/* Mode Stok Tracking */}
        <div>
          <p className="text-sm font-medium">Mode Stok Tracking</p>
          <button className="w-full border border-gray-300 rounded-md py-2 px-4 mt-2 text-left">
            Atur Mode Stok Tracking
          </button>
        </div>

        {/* Tombol Simpan */}
        <div className="text-right">
          <button className="bg-green-600 text-white py-3 px-6 rounded-lg text-xl hover:bg-green-700">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
