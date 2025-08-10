import React from "react";

const Icon = ({ name, className }) => (
  <span className={`material-icons ${className || ""}`}>{name}</span>
);

const SyncData = () => {
  return (
    <div className="h-screen flex flex-col">

      {/* Header */}
      <div className="flex items-center px-6 py-6 border-b bg-blue-100">
        <Icon name="arrow_back" className="text-2xl mr-3" />
        <h1 className="text-2xl font-bold">SINKRONISASI DATA</h1>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">

        {/* Panel Kiri */}
        <div className="w-full md:w-1/3 border-r bg-gray-50">
          <button className="w-full text-left p-6 bg-green-200 hover:bg-green-300 focus:outline-none">
            <div className="flex items-center space-x-4">
              <Icon name="cloud_upload" className="text-4xl text-green-700" />
              <div>
                <p className="text-xl font-semibold">Upload Data</p>
                <p className="text-base text-gray-700">Kirim data ke awan (cloud)</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-6 hover:bg-yellow-200 focus:outline-none">
            <div className="flex items-center space-x-4">
              <Icon name="cloud_download" className="text-4xl text-yellow-600" />
              <div>
                <p className="text-xl font-semibold">Download Data</p>
                <p className="text-base text-gray-700">Ambil data dari awan (cloud)</p>
              </div>
            </div>
          </button>
        </div>

        {/* Panel Kanan */}
        <div className="w-full md:w-2/3 p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">UPLOAD DATA</h2>
          <p className="text-lg text-gray-700 mb-6">Tekan data yang ingin diunggah ke awan:</p>

          <div className="space-y-6">
            {/* Item: Laporan Penjualan */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <div>
                <p className="text-xl font-semibold">Laporan Penjualan</p>
                <p className="text-base text-gray-600">Belum ada data baru</p>
              </div>
              <Icon name="check_circle" className="text-3xl text-green-600" />
            </div>

            {/* Item: Manajemen */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <div>
                <p className="text-xl font-semibold">Manajemen</p>
                <p className="text-base text-gray-600">Belum ada data baru</p>
              </div>
              <Icon name="check_circle" className="text-3xl text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncData;
