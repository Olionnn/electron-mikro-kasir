import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useNavbar } from  "../../hooks/useNavbar";

export default function LaporanPage() {
  const navigate = useNavigate();

  // optional: tombol back ke halaman sebelumnya
  const onBack = useCallback(() => navigate(-1), [navigate]);

  // Set navbar untuk halaman ini
  useNavbar(
    {
      variant: "page",
      title: "Laporan",
      backTo: null,            // pakai path string jika perlu, contoh: "/management"
      // backTo: "/management",
      // atau jika mau pakai history back di tombol aksi:
      // actions: [
      //   {
      //     type: "button",
      //     title: "Kembali",
      //     onClick: onBack,
      //     className: "px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100",
      //   },
      // ],
    },
    [onBack]
  );

  const banners = [
    // { img: "https://via.placeholder.com/800x200?text=Banner+1", alt: "Banner 1" },
    // { img: "https://via.placeholder.com/800x200?text=Banner+2", alt: "Banner 2" },
    // { img: "https://via.placeholder.com/800x200?text=Banner+3", alt: "Banner 3" },
  ];

  const laporanCards = [
    { icon: "💼", title: "Laporan Keuangan" },
    { icon: "📊", title: "Laporan Penjualan" },
    { icon: "🛒", title: "Laporan Pembelian" },
    // { icon: "📄", title: "Laporan Lebih Lengkap" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
        {laporanCards.map((lap, i) => {
          // Ubah title menjadi slug untuk URL
          const slug = lap.title.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link
              to={`/laporan/${slug}`}
              key={i}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer flex items-center gap-4"
            >
              <div className="text-green-600 text-3xl">{lap.icon}</div>
              <div className="font-medium">{lap.title}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}