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

      {/* Main Content Full Width */}
      <div className="flex-1 p-8 bg-white overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">UPLOAD DATA</h2>
        <p className="text-lg text-gray-700 mb-6">
          Tekan data yang ingin diunggah ke awan:
        </p>

        <div className="space-y-6">
          {/* Item: Laporan Penjualan */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-xl font-semibold">Laporan Penjualan</p>
              <p className="text-base text-gray-600">Belum ada data baru</p>
            </div>
            <Icon name="check_circle" className="text-3xl text-green-600" />
          </div>

          {/* Item: Manajemen */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-xl font-semibold">Manajemen</p>
              <p className="text-base text-gray-600">Belum ada data baru</p>
            </div>
            <Icon name="check_circle" className="text-3xl text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncData;
