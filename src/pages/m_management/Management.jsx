import React from 'react';
import { Link } from 'react-router-dom';

export default function ManagementPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {[
          { icon: 'box--v1.png', label: 'Barang atau Jasa', link: '/barang-jasa' },
          { icon: 'grid.png', label: 'Kategori Barang', link: '/kategori-barang' },
          { icon: 'user.png', label: 'Pelanggan', link: '/pelanggan' },
          { icon: 'conference.png', label: 'Supplier', link: '/supplier' },
          { icon: 'sale.png', label: 'Diskon', link: '/diskon' },
          { icon: 'tax.png', label: 'Pajak', link: '/pajak' },
          { icon: 'money.png', label: 'Biaya', link: '/biaya' },
        ].map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="p-6 rounded-lg shadow-md border flex flex-col items-start gap-4 hover:shadow-lg transition bg-white text-lg font-semibold text-green-700 border-green-200"
          >
            <img
              src={`https://img.icons8.com/ios/64/000000/${item.icon}`}
              className="w-8 h-8 icon"  
              alt={item.label}
            />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
