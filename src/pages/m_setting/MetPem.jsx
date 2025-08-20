import React, { useState } from "react";
import {
  MdArrowBack,
  MdAdd,
  MdEdit,
  MdCreditCard,
  MdLink,
} from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";

const MetodePembayaran = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { name: "Cash", checked: true },
    { name: "Debit", checked: true },
    { name: "GoPay", checked: true },
    { name: "OVO", checked: true },
    { name: "Cashlez", checked: true },
    { name: "Dana", checked: true },
    { name: "LikAja", checked: true },
    { name: "QRIS", checked: true },
    { name: "Transfer", checked: true },
    { name: "Cicilan", checked: false },
  ]);

  const toggleMethod = (index) => {
    setPaymentMethods((prev) =>
      prev.map((method, i) =>
        i === index ? { ...method, checked: !method.checked } : method
      )
    );
  };


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
    <div className="h-full w-full bg-white flex flex-col overflow-hidden">

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
        {/* Input tambah metode */}
        <div className="flex items-center gap-3 md:gap-4 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border rounded-xl text-lg focus-within:ring-2 focus-within:ring-violet-500">
            <span className="inline-block text-gray-400">
              <MdCreditCard className="text-2xl" />
            </span>
            <input
              type="text"
              placeholder="Nama metode"
              className="flex-1 outline-none"
            />
          </div>
          <button
            className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 font-medium px-5 md:px-6 py-3 rounded-xl hover:bg-violet-200 transition"
            title="Tambah Metode"
          >
            <MdAdd className="text-xl" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </div>

        {/* Metode Default */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Metode Default</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
            {paymentMethods.filter((m) => m.checked).length} aktif
          </span>
        </div>

        <div className="space-y-3 mb-10">
          {paymentMethods.map((method, index) => (
            <div
              key={method.name}
              className="flex items-center justify-between bg-gray-50 px-4 sm:px-6 py-4 rounded-xl border border-gray-200 hover:border-violet-200 hover:bg-violet-50/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <MdCreditCard className="text-gray-500" />
                </div>
                <span className="text-base sm:text-lg font-medium text-gray-800">
                  {method.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {method.name !== "Cash" && (
                  <button
                    className="inline-flex items-center gap-1.5 text-violet-600 font-semibold text-sm hover:underline"
                    title={`Edit ${method.name}`}
                  >
                    <MdEdit className="text-base" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={method.checked}
                    onChange={() => toggleMethod(index)}
                  />
                  <div className="w-14 h-8 rounded-full bg-gray-300 peer-checked:bg-violet-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow"></div>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* EDC BCA */}
        <div className="flex items-center justify-between bg-gray-50 px-4 sm:px-6 py-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <MdLink className="text-gray-500" />
            </div>
            <span className="text-base sm:text-lg font-medium text-gray-800">
              EDC BCA
            </span>
          </div>
          <button className="text-violet-600 font-medium hover:text-violet-700">
            Sambungkan
          </button>
        </div>

        {/* Metode tambahan */}
        <p className="mt-6 font-semibold text-sm text-gray-600 uppercase tracking-wide">
          Metode Tambahan
        </p>

        {/* Tombol Simpan */}
        <div className="mt-4">
          <button className="w-full bg-violet-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-violet-700 transition shadow-sm">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodePembayaran;