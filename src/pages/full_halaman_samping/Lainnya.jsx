import React from "react";

const Lainnya = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-6 border-b">
        <span className="text-3xl text-black mr-6 cursor-pointer">&larr;</span>
        <h1 className="text-2xl font-semibold">Lainnya</h1>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="w-2/5 border-r border-gray-200 p-6 flex flex-col gap-6">
          {/* Tentang Aplikasi */}
          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow cursor-pointer">
            <div className="flex items-center gap-6">
              <img
                src="https://img.icons8.com/color/48/000000/info--v1.png"
                alt="Info"
                className="w-12 h-12"
              />
              <div>
                <p className="font-semibold text-lg">Tentang Aplikasi</p>
                <p className="text-base text-gray-500">Melihat versi aplikasi saat ini</p>
              </div>
            </div>
            <span className="text-green-500 text-2xl">›</span>
          </div>

          {/* Reset Semua Data */}
          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow cursor-pointer">
            <div className="flex items-center gap-6">
              <img
                src="https://img.icons8.com/color/48/000000/refresh--v1.png"
                alt="Reset"
                className="w-12 h-12"
              />
              <div>
                <p className="font-semibold text-lg">Reset Semua Data</p>
                <p className="text-base text-gray-500">
                  Akan menghilangkan semua database barang dan laporan
                </p>
              </div>
            </div>
            <span className="text-green-500 text-2xl">›</span>
          </div>

          {/* Logout */}
          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow cursor-pointer">
            <div className="flex items-center gap-6">
              <img
                src="https://img.icons8.com/color/48/000000/logout-rounded-up.png"
                alt="Logout"
                className="w-12 h-12"
              />
              <div>
                <p className="font-semibold text-lg">Logout</p>
                <p className="text-base text-gray-500">Keluar akun</p>
              </div>
            </div>
            <span className="text-green-500 text-2xl">›</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-3/5"></div>
      </div>
    </div>
  );
};

export default Lainnya;
