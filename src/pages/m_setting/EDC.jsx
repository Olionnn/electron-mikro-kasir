import React from "react";
import {
  MdArrowBack,
  MdInfoOutline,
  MdAdd,
  MdDevicesOther,
} from "react-icons/md";

const PerangkatEDC = () => {
  return (
    <div className="h-full flex flex-col bg-white"> {/* min-h-screen agar full screen */}
      <div className="flex flex-col flex-1 items-center justify-center text-center px-2">
        <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
          <MdDevicesOther className="text-4xl text-green-600" />
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          Belum ada perangkat EDC yang terhubung
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Tambahkan perangkat untuk mulai menggunakan EDC/ECR
        </p>
      </div>

      <div className="p-1">
        <button className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-sm transition">
          <MdAdd className="text-xl" />
          TAMBAH PERANGKAT
        </button>
      </div>
    </div>
  );
};

export default PerangkatEDC;
