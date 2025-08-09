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
        {/* Kartu Menu */}
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
    </div>
  );
}
