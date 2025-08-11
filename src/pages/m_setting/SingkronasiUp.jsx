import React from "react";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";

const SyncData = () => {
  return (
    <div className="h-full flex flex-col">
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
            <MdCheckCircle className="text-3xl text-green-600" />
          </div>

          {/* Item: Manajemen */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-xl font-semibold">Manajemen</p>
              <p className="text-base text-gray-600">Belum ada data baru</p>
            </div>
            <MdCheckCircle className="text-3xl text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncData;