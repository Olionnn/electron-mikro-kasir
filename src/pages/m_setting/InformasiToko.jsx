import React from 'react';

const InformasiToko = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[30%] border-r overflow-y-auto">
        <div className="flex items-center p-6 gap-5">
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="POS Icon" className="w-14 h-14" />
          <div>
            <p className="font-semibold text-lg">beastbeeme2@gmail.com</p>
            <p className="text-base text-gray-500">version 2.7.0 db version 12</p>
          </div>
        </div>
        <div className="space-y-3 px-6">
          {[
            { icon: 'account_circle', text: 'Profil' },
            { icon: 'store', text: 'Informasi Toko', active: true },
            { icon: 'sync', text: 'Sinkronisasi' },
            { icon: 'print', text: 'Printer dan Struk' },
            { icon: 'supervisor_account', text: 'Manajemen Staff' },
            { icon: 'payment', text: 'Metode Pembayaran' },
            { icon: 'credit_card', text: 'Perangkat EDC' },
            { icon: 'settings', text: 'Pengaturan Transaksi' },
            { icon: 'star_rate', text: 'Rating Apps' },
            { icon: 'settings', text: 'Pengaturan Notifikasi' },
            { icon: 'more_horiz', text: 'Lainnya' }
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg ${item.active ? 'bg-green-600 text-white' : 'border text-black'}`}>
              <span className="material-icons text-[30px]">{item.icon}</span> {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <h1 className="text-2xl font-bold">INFORMASI TOKO</h1>
          <a href="#" className="text-green-600 font-semibold">Edit Toko</a>
        </div>

        <div className="flex flex-col items-center text-[18px]">
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="Store Icon" className="w-24 h-24 mb-6" />

          {/* Info Toko */}
          <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6">
            <p className="mb-4"><span className="font-bold">Jenis Usaha</span><br />pilih jenis usaha ...</p>
            <p className="mb-4"><span className="font-bold">Nama Toko</span><br />Abror G4nteng</p>
            <p className="mb-4"><span className="font-bold">Pajak Default</span><br />0%</p>
            <p className="mb-4"><span className="font-bold">Nama Pemilik / Owner</span><br />beastbeeme2</p>
            <p className="mb-4"><span className="font-bold">Nomor Telepon</span><br />+62085707896575</p>
          </div>

          {/* Lokasi */}
          <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6 mt-6">
            <p className="mb-4"><span className="font-bold">Negara</span><br />Indonesia</p>
            <p className="mb-4"><span className="font-bold">Provinsi</span><br />JAMBI</p>
            <p className="mb-4"><span className="font-bold">Kota</span><br />KABUPATEN KERINCI</p>
            <p className="mb-4"><span className="font-bold">Detail Lokasi</span><br />-</p>
          </div>

          {/* Bahasa & Mata Uang */}
          <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6 mt-6">
            <p className="mb-4"><span className="font-bold">Bahasa</span><br />Bahasa Indonesia</p>
            <p className="mb-4"><span className="font-bold">Mata Uang</span><br />Indonesian Rupiah</p>
            <p className="mb-4"><span className="font-bold">Motto</span><br />Melayani dengan sepenuh hati</p>
            <p className="mb-4"><span className="font-bold">Metode Akuntansi</span><br />Kas</p>
            <p className="mb-4"><span className="font-bold">Status Olshopin</span><br />Aktif</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformasiToko;
