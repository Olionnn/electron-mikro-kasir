import React from 'react';

const PengaturanPrinter = () => {
  return (
    <div className="flex h-screen">
      
      {/* Sidebar (40%) */}
      <aside className="w-[40%] border-r bg-white">
        <div className="p-6 text-center text-2xl font-bold border-b">PENGATURAN</div>
        
        <div className="flex items-center gap-4 px-6 py-4 text-xl border-b">
          <span className="text-3xl">&larr;</span>
          <span className="font-semibold">Printer dan Struk</span>
        </div>

        <div className="flex flex-col gap-6 mt-6 px-4">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-gray-100 cursor-pointer hover:bg-gray-200">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 17v-6a2 2 0 012-2h6m-6 6h6m-6 0V5m0 6h6" />
              </svg>
            </div>
            <div className="flex-1 font-bold text-lg">Pengaturan Struk</div>
            <div className="text-2xl">&gt;</div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-green-500 text-white cursor-pointer">
            <div className="bg-white text-green-600 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M6 9v6m6-6v6m6-6v6M4 6h16M4 18h16" />
              </svg>
            </div>
            <div className="flex-1 font-bold text-lg">Pengaturan Printer</div>
            <div className="text-2xl">&gt;</div>
          </div>
        </div>
      </aside>

      {/* Konten (60%) */}
      <main className="w-[60%] bg-white p-8 overflow-y-auto">
        <div className="flex items-center gap-4 mb-10 text-2xl font-bold">
          <span className="text-3xl">&larr;</span>
          <span>PENGATURAN PRINTER</span>
        </div>
        <hr />

        <div className="space-y-8">
          {[
            "Struk Transaksi",
            "Struk Pesanan",
            "Struk Dapur"
          ].map((label, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 border-b">
              <div>
                <div className="font-bold text-xl">{label}</div>
                <div className="text-gray-600 mt-1">Belum Ada yang terhubung</div>
              </div>
              <button className="text-lg border border-green-600 text-green-600 rounded-full px-6 py-2 hover:bg-green-100">
                + Tambah
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between p-5 border-b">
            <div className="font-bold text-xl">Struk Label</div>
            <span className="bg-yellow-400 text-white px-5 py-2 text-base font-semibold rounded-full">
              Coming Soon !
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PengaturanPrinter;
