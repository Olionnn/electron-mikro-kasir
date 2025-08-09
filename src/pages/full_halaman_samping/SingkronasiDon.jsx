import React from "react";

const SyncPage = () => {
  const syncItems = [
    "Manajemen", "Pelanggan", "Supplier", "Diskon", "Pajak",
    "Biaya", "Pesanan", "Draft Pembelian", "Kategori", "Staff",
    "Promosi", "Shift", "Gambar Produk"
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-gray-100">
        <div className="text-xl font-bold p-5 border-b">🔄 SINKRONISASI</div>
        <div className="flex flex-col gap-2 mt-2">
          {/* Upload Data */}
          <div className="flex items-start gap-4 px-5 py-4 hover:bg-gray-200 cursor-pointer">
            <div className="text-green-600 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4-4m0 0l-4 4m4-4v12" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">Upload Data</div>
              <div className="text-gray-600 text-base">Kirim data ke cloud</div>
            </div>
          </div>

          {/* Download Data */}
          <div className="flex items-start gap-4 px-5 py-4 bg-green-200 cursor-pointer">
            <div className="text-yellow-600 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v1a2 2 0 002 2h12a2 2 0 002-2V4M8 12l4 4m0 0l4-4m-4 4V4" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">Donwload Data</div>
              <div className="text-gray-600 text-base">Ambil data dari cloud</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="text-lg text-gray-700 mb-2">← Donwload Data</div>
        <h2 className="text-2xl font-bold mb-4">Donwload Data</h2>
        <p className="text-base text-gray-700 mb-6">Ambil data dari cloud ke perangkat Anda.</p>

        <div className="space-y-6">
          {syncItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-5">
              <div className="w-48 font-medium">{item}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-300 h-3 rounded">
                  <div className="bg-gray-500 h-3 rounded w-0"></div>
                </div>
              </div>
              <div className="w-24 text-base text-gray-600 text-right">0 data</div>
              <button className="text-green-600 hover:text-green-700 p-2 rounded-lg" title="Sinkronkan">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582M20 20v-5h-.581M4 9a8.003 8.003 0 0115.418-2.996M20 15a8.003 8.003 0 01-15.418 2.996" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SyncPage;
