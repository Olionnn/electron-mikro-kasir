import React, { useState } from "react";

const PrinterSelection = () => {
  const [selectedPrinter, setSelectedPrinter] = useState("");

  const printers = [
    "POS-58(copy of 1)",
    "Fax",
    "Microsoft Print to PDF",
    "Microsoft XPS Document Writer",
    "OneNote for Windows 10",
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800 text-[16px]">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <span className="text-2xl mr-3 cursor-pointer">&#8592;</span>
        <h1 className="text-lg font-semibold">Pilih Printer</h1>
      </div>

      {/* Info */}
      <div className="flex items-start px-4 py-3 border-b border-gray-100 text-[13px] text-gray-600">
        <div className="flex items-center justify-center w-5 h-5 border border-green-500 text-green-500 rounded-full mr-2 text-[12px] font-bold">
          i
        </div>
        <p>
          Device MAC/ Desktop hanya mendeteksi driver printer terinstall, silahkan
          berganti dengan mobile/ iOS untuk terhubung dengan perangkat lainnya
        </p>
      </div>

      {/* Pilih koneksi printer */}
      <div className="px-4 mt-4">
        <p className="text-[15px] font-medium mb-2">Pilih Koneksi Printer</p>
        <div className="flex items-center space-x-3">
          <button className="bg-gray-100 px-4 py-2 rounded-full text-[14px]">
            Driver terinstall
          </button>
          <button className="flex items-center space-x-1 border border-green-500 text-green-500 px-4 py-2 rounded-full text-[14px]">
            <span>Scan</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582a10.025 10.025 0 011.543-3.528l-.413-.482zM4 15v5h5v-.582a10.025 10.025 0 01-3.528-1.543l-.482.413zM15 4h5v5h-.582a10.025 10.025 0 01-1.543-3.528l.413-.482zM15 20h5v-5h-.582a10.025 10.025 0 01-1.543 3.528l.413.482z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Cara menghubungkan printer */}
      <div className="px-4 mt-3">
        <div className="bg-[#F2F6F9] rounded-md p-3 text-[14px] text-gray-700">
          <p>Cara menghubungkan printer USB :</p>
          <p>1. Aktifkan printer.</p>
          <p>2. Sambungkan printer dengan kabel USB ke HP/ komputer yang Anda gunakan.</p>
        </div>
      </div>

      {/* Printer terdeteksi */}
      <div className="px-4 mt-4">
        <p className="text-[15px] font-medium mb-3">Printer terdeteksi</p>
        <div className="space-y-3">
          {printers.map((printer, idx) => (
            <label key={idx} className="flex items-center space-x-2">
              <input
                type="radio"
                name="printer"
                value={printer}
                checked={selectedPrinter === printer}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-[15px]">{printer}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Set printer button */}
      <div className="px-4 mt-6">
        <button
          disabled={!selectedPrinter}
          className={`w-full py-3 rounded-full text-white font-medium ${
            selectedPrinter
              ? "bg-green-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          SET PRINTER
        </button>
      </div>
    </div>
  );
};

export default PrinterSelection;
