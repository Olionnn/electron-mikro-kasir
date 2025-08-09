import React, { useState } from "react";

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
  ]);

  const toggleMethod = (index) => {
    setPaymentMethods((prev) =>
      prev.map((method, i) =>
        i === index ? { ...method, checked: !method.checked } : method
      )
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex-[0.4] border-r overflow-y-auto p-6">
        <div className="flex items-center gap-5 mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            alt="POS Icon"
            className="w-14 h-14"
          />
          <div>
            <p className="font-semibold text-lg">beastbeeme2@gmail.com</p>
            <p className="text-base text-gray-500">version 2.7.0 db version 12</p>
          </div>
        </div>
        {/* Menu Buttons... */}
        <div className="space-y-3">
          {/* ...menu items disingkat untuk ringkas */}
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-lg bg-green-600 text-white text-left">
            <span className="material-icons text-[30px]">payment</span> Metode Pembayaran
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-[0.6] h-full overflow-y-auto p-8">
        <div className="flex items-center space-x-3 mb-6">
          <button className="text-xl text-gray-600">&larr;</button>
          <h1 className="text-2xl font-bold">Metode Pembayaran</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Nama metode"
            className="flex-1 px-4 py-3 border rounded-md text-lg"
          />
          <button className="bg-green-100 text-green-700 font-medium px-6 py-3 rounded-md hover:bg-green-200 transition text-lg">
            Tambah
          </button>
        </div>

        <h2 className="font-semibold text-lg text-gray-800 mb-3">Metode Default</h2>

        <div className="space-y-4 mb-10">
          {paymentMethods.map((method, index) => (
            <div
              key={method.name}
              className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-md"
            >
              <span className="text-lg">{method.name}</span>
              <div className="flex items-center gap-5">
                {method.name !== "Cash" && (
                  <span className="text-green-600 font-semibold cursor-pointer text-lg">
                    Edit
                  </span>
                )}
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={method.checked}
                    onChange={() => toggleMethod(index)}
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition relative">
                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition peer-checked:translate-x-6" />
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-md">
          <span className="text-lg">EDC BCA</span>
          <button className="text-green-600 font-medium">Sambungkan</button>
        </div>

        <p className="mt-6 font-semibold text-base">Metode Tambahan</p>

        <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-green-700 transition mt-4">
          Simpan
        </button>
      </div>
    </div>
  );
};

export default MetodePembayaran;
