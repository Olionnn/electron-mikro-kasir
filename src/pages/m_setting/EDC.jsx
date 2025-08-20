import React from "react";
import {
  MdArrowBack,
  MdInfoOutline,
  MdAdd,
  MdDevicesOther,
} from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";

const PerangkatEDC = () => {


  useNavbar(
    {
      variant: "page",
      title: "Pengaturan",
      backTo: null,
      actions: [
        {
          type: "span",
          title: "Versi Aplikasi",
          className: "px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200",
          label: "v2.7.0",
        },
        {
          type: "span",
          title: "Versi Database",
          className: "px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200",
          label: "DB 12",
        },
      ],
    },
    
  );
  return (
    <div className="h-full flex flex-col bg-white"> {/* min-h-screen agar full screen */}
      <div className="flex flex-col flex-1 items-center justify-center text-center px-2">
        <div className="w-20 h-20 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
          <MdDevicesOther className="text-4xl text-violet-600" />
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          Belum ada perangkat EDC yang terhubung
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Tambahkan perangkat untuk mulai menggunakan EDC/ECR
        </p>
      </div>

      <div className="p-1">
        <button className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold shadow-sm transition">
          <MdAdd className="text-xl" />
          TAMBAH PERANGKAT
        </button>
      </div>
    </div>
  );
};

export default PerangkatEDC;
