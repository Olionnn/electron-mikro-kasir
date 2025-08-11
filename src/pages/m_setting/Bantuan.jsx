import React from "react";

const Bantuan = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shadow">
        <button className="text-3xl">&#9776;</button>
        <h1 className="text-2xl font-bold">Bantuan</h1>
        <span className="opacity-0">dummy</span>
      </div>

      {/* Konten Utama Fullscreen */}
      <div className="flex-1 bg-white overflow-y-auto">
        <ul className="space-y-4 p-4">
          {/* Hubungi Kami */}
          <li>
            <button className="flex items-start justify-between w-full p-5 bg-green-600 text-white text-left rounded-xl shadow hover:shadow-lg transition">
              <div>
                <div className="text-lg font-bold">Hubungi Kami</div>
                <div className="text-sm text-white">
                  Kontak kami berdasar kebutuhan Anda
                </div>
              </div>
              <span className="text-2xl">&gt;</span>
            </button>
          </li>

          {/* Buku Panduan & FAQ */}
          <li>
            <button className="flex items-start justify-between w-full p-5 bg-white text-left border rounded-xl shadow hover:shadow-lg transition">
              <div>
                <div className="text-lg font-bold text-yellow-700">
                  Buku Panduan & FAQ
                </div>
                <div className="text-sm text-gray-600">
                  Baca panduan dan pertanyaan terkait
                </div>
              </div>
              <span className="text-2xl">&gt;</span>
            </button>
          </li>

          {/* Media Sosial & Komunitas */}
          <li>
            <button className="flex items-start justify-between w-full p-5 bg-white text-left border rounded-xl shadow hover:shadow-lg transition">
              <div>
                <div className="text-lg font-bold text-orange-500">
                  Media Sosial & Komunitas
                </div>
                <div className="text-sm text-gray-600">
                  Ikuti perkembangan terbaru kami
                </div>
              </div>
              <span className="text-2xl">&gt;</span>
            </button>
          </li>

          {/* Feedback Aplikasi */}
          <li>
            <button className="flex items-start justify-between w-full p-5 bg-white text-left border rounded-xl shadow hover:shadow-lg transition">
              <div>
                <div className="text-lg font-bold text-yellow-700">
                  Feedback Aplikasi
                </div>
                <div className="text-sm text-gray-600">
                  Kritik & saran Anda membantu kami
                </div>
              </div>
              <span className="text-2xl">&gt;</span>
            </button>
          </li>

          {/* Tutorial Aplikasi */}
          <li>
            <button className="flex items-start justify-between w-full p-5 bg-white text-left border rounded-xl shadow hover:shadow-lg transition">
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  Tutorial Aplikasi
                </div>
                <div className="text-sm text-gray-600">
                  Ikuti panduan penggunaan aplikasi
                </div>
              </div>
              <span className="text-2xl">&gt;</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Bantuan;
