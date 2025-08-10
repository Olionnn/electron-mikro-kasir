import React from 'react';

const OlsopinPage = () => {
  const items = [
    { id: 1, initials: 'Be', name: 'Beras', price: 'Rp 13.000' },
    { id: 2, initials: 'Ke', name: 'Kecap', price: 'Rp 4.000' },
    { id: 3, initials: 'Be', name: 'beras 5KG', price: 'Rp 70.000' },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <div className="text-2xl">☰</div>
          <h1 className="text-2xl font-bold">OLSHOPIN</h1>
        </div>
        <a href="#" className="text-green-600 font-semibold">
          Kunjungi
        </a>
      </div>

      {/* Tabs */}
      <div className="flex justify-start items-center border-b border-gray-200 text-center text-lg font-semibold">
        <div className="w-48 py-4 text-green-600 border-b-4 border-green-600 cursor-pointer flex flex-col items-center">
          <span className="text-2xl">🛒</span>
          <span>Barang</span>
        </div>
        <div className="w-48 py-4 text-gray-400 cursor-pointer flex flex-col items-center">
          <span className="text-2xl">📦</span>
          <span>Pesanan</span>
        </div>
        <div className="w-48 py-4 text-gray-400 cursor-pointer flex flex-col items-center">
          <span className="text-2xl">🏬</span>
          <span>Toko</span>
        </div>
      </div>

      {/* Isi */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kiri: Daftar Barang */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {/* Info */}
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4 text-base font-medium">
            Bagikan produk Anda di Whatsapp, Facebook, dan Instagram dengan klik produk di bawah ini
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-2xl">⚙️</div>
            <input
              type="text"
              placeholder="Cari nama atau kode barang"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none"
            />
            <div className="text-2xl">📶</div>
          </div>

          {/* Produk List */}
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 w-12 h-12 flex items-center justify-center rounded-md font-bold text-lg">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-xl">{item.name}</div>
                    <div className="text-gray-600 text-lg">{item.price}</div>
                  </div>
                </div>
                <div className="text-green-500 text-2xl">🔗</div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan: Kosong */}
        <div className="w-1/2 border-l border-gray-200"></div>
      </div>
    </div>
  );
};

export default OlsopinPage;
