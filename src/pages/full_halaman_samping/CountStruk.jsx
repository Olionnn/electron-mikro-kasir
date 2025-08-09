import React from 'react';

export default function PengaturanStruk() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b">
        <span className="text-2xl">&larr;</span>
        <h1 className="text-xl font-bold">PENGATURAN STRUK</h1>
      </div>

      {/* Content */}
      <div className="flex flex-1 h-[calc(100vh-120px)] overflow-hidden">
        {/* Left */}
        <div className="w-2/5 p-6 overflow-y-auto">
          <div className="flex items-center justify-between bg-yellow-100 text-green-700 px-4 py-3 rounded-md">
            <span>Klik untuk Download dari cloud</span>
            <button className="bg-green-500 text-white p-2 rounded-full">⭳</button>
          </div>

          {/* Logo Settings */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="font-semibold text-2xl">Tampilkan Logo</label>
              <input type="checkbox" className="toggle toggle-md" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Panjang Logo (Karakter)</label>
                <input type="text" defaultValue="16" className="w-full border rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block mb-1">Panjang canvas Logo</label>
                <input type="text" defaultValue="16" className="w-full border rounded-lg px-4 py-2" />
              </div>
            </div>
          </div>

          {/* Checkbox Settings */}
          <div className="space-y-4 mt-8">
            {[
              'Tampilkan Kode Struk',
              'Tampilkan No Urut',
              'Tampilkan Satuan Sebelah Qty',
              'Tampilkan Alamat Pelanggan',
              'Tampilkan Nomor Struk',
              'Tampilkan Total Kuantitas',
              'Tampilkan Kolom Tanda Tangan Hutang / Piutang',
              'Tampilkan tipe harga',
              'Pisah biaya admin toko'
            ].map((label, i) => (
              <div key={i} className="flex justify-between items-center">
                <span>{label}</span>
                <input type="checkbox" className="toggle" />
              </div>
            ))}

            <div className="flex justify-between items-center">
              <div>
                <div>Tampilkan poin akhir pada struk</div>
                <div className="text-sm text-gray-500">(auto print nonaktif jika offline)</div>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <span>Sembunyikan Presentase(%) Pajak</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>

          <hr className="my-6" />

          <div className="mb-4 font-semibold">Tampilkan Struk Online dan Kritik Saran</div>
          <div className="flex gap-8 mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Mode Link
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              Mode QR Code
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-600">Keterangan Footer</label>
              <textarea className="w-full border rounded-lg p-2" rows="3" />
            </div>
            <div>
              <label className="block mb-1 text-gray-600">Keterangan Header</label>
              <textarea className="w-full border rounded-lg p-2" rows="3" />
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-600">Nomor Struk</label>
              <input type="text" defaultValue="2" className="w-full border rounded-lg px-4 py-2" />
            </div>
            <button className="mt-6 border border-green-500 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50">
              Reset Nomor Struk
            </button>
          </div>
        </div>

        {/* Right / Preview */}
        <div className="w-3/5 bg-gray-100 p-6 flex flex-col items-center">
          <div className="text-center text-sm text-gray-600 border-b-2 border-green-500 w-full pb-2 mb-4">
            32 Karakter
          </div>
          <div className="bg-white shadow p-4 rounded-xl w-[200px] text-sm font-mono">
            <div className="text-center font-bold mb-2">Abror G4nteng</div>
            <div className="border-t border-dashed border-black mb-2" />
            <div className="flex justify-between">
              <span>2025-08-06</span>
              <span>Kasir 1</span>
            </div>
            <div className="flex justify-between">
              <span>10:44:50</span>
              <span>Pelanggan 1</span>
            </div>
            <div className="border-t border-dashed border-black my-2" />
            <div className="flex justify-between">
              <span>Jus Apel</span>
              <span>3.000</span>
            </div>
            <div className="text-xs">1 x 3.000</div>
            <div className="flex justify-between">
              <span>Jus Mangga</span>
              <span>3.000</span>
            </div>
            <div className="text-xs">1 x 3.000</div>
            <div className="border-t border-dashed border-black my-2" />
            <div className="flex justify-between">
              <span>Total</span>
              <span>6.000</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak : PPN</span>
              <span>1.000</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar</span>
              <span>6.000</span>
            </div>
            <div className="flex justify-between">
              <span>Kembali</span>
              <span>0</span>
            </div>
            <div className="flex justify-center mt-3">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=contoh"
                alt="QR Code"
                className="h-20 w-20"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">Struk di atas hanya sebagai contoh</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 p-6 border-t">
        <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50">Tes Print</button>
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">Simpan</button>
      </div>
    </div>
  );
}
