import React from "react";

const PerangkatEDC = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b">
        <div className="flex items-center gap-6">
          <span className="text-3xl text-green-600 cursor-pointer">&larr;</span>
          <h1 className="text-2xl font-bold">Perangkat EDC/ECR</h1>
        </div>
        <div className="text-green-600 text-2xl cursor-pointer">ℹ️</div>
      </div>

      {/* Main Content */}
      <div className="flex h-[52rem] flex-1">
        {/* Kolom Kiri */}
        <div className="w-2/5 border-r border-gray-200 flex flex-col h-full">
          {/* Konten Atas */}
          <div className="p-6">
            {/* Informasi Ajukan */}
            <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Belum pernah terhubung EDC?{" "}
                <a href="#" className="text-green-600 font-semibold">
                  Ajukan di sini
                </a>
              </div>
              <div className="text-yellow-500 text-xl ml-2">
                <span className="text-2xl">👉✨</span>
              </div>
            </div>

            {/* Belum Ada Data */}
            <div className="flex justify-center items-center mt-32">
              <p className="text-gray-400 text-sm">Belum Ada Data</p>
            </div>
          </div>

          {/* Tombol Tambah Perangkat */}
          <div className="p-6 mt-auto">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
              TAMBAH PERANGKAT
            </button>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="w-3/5 bg-white"></div>
      </div>
    </div>
  );
};

export default PerangkatEDC;
