import React from "react";
import Navbar from "../../component/Navbar";

export default function LaporanPage() {
  const banners = [
    {
      img: "https://via.placeholder.com/800x200?text=Banner+1",
      alt: "Banner 1",
    },
    {
      img: "https://via.placeholder.com/800x200?text=Banner+2",
      alt: "Banner 2",
    },
    {
      img: "https://via.placeholder.com/800x200?text=Banner+3",
      alt: "Banner 3",
    },
  ];

  const laporanCards = [
    { icon: "💼", title: "Laporan Keuangan" },
    { icon: "📊", title: "Laporan Penjualan" },
    { icon: "🛒", title: "Laporan Pembelian" },
    { icon: "📄", title: "Laporan Lebih Lengkap" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        title="Laporan"
        onToggleSidebar={() => console.log("Toggle Sidebar")}
      />

      {/* Banner / Carousel */}
      <div className="flex gap-4 overflow-x-auto p-4 pb-2 hide-scrollbar">
        {banners.map((b, i) => (
          <img
            key={i}
            src={b.img}
            alt={b.alt}
            className="rounded-lg flex-shrink-0 w-[320px] h-[120px] object-cover"
          />
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {laporanCards.map((lap, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer flex items-center gap-4"
          >
            <div className="text-green-600 text-3xl">{lap.icon}</div>
            <div className="font-medium">{lap.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
