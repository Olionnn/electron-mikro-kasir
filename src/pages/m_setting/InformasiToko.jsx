import React from 'react';

const InformasiToko = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-10 py-4 shadow-sm">
        <h1 className="text-2xl font-bold">INFORMASI TOKO</h1>
        <a href="#" className="text-green-600 font-semibold">Edit Toko</a>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto flex flex-col items-center text-[18px]">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
          alt="Store Icon"
          className="w-24 h-24 mb-6"
        />

        {/* Info Toko */}
        <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6 shadow">
          <p className="mb-4"><span className="font-bold">Jenis Usaha</span><br />pilih jenis usaha ...</p>
          <p className="mb-4"><span className="font-bold">Nama Toko</span><br />Abror G4nteng</p>
          <p className="mb-4"><span className="font-bold">Pajak Default</span><br />0%</p>
          <p className="mb-4"><span className="font-bold">Nama Pemilik / Owner</span><br />beastbeeme2</p>
          <p className="mb-4"><span className="font-bold">Nomor Telepon</span><br />+62085707896575</p>
        </div>

        {/* Lokasi */}
        <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6 mt-6 shadow">
          <p className="mb-4"><span className="font-bold">Negara</span><br />Indonesia</p>
          <p className="mb-4"><span className="font-bold">Provinsi</span><br />JAMBI</p>
          <p className="mb-4"><span className="font-bold">Kota</span><br />KABUPATEN KERINCI</p>
          <p className="mb-4"><span className="font-bold">Detail Lokasi</span><br />-</p>
        </div>

        {/* Bahasa & Mata Uang */}
        <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6 mt-6 shadow">
          <p className="mb-4"><span className="font-bold">Bahasa</span><br />Bahasa Indonesia</p>
          <p className="mb-4"><span className="font-bold">Mata Uang</span><br />Indonesian Rupiah</p>
          <p className="mb-4"><span className="font-bold">Motto</span><br />Melayani dengan sepenuh hati</p>
          <p className="mb-4"><span className="font-bold">Metode Akuntansi</span><br />Kas</p>
          <p className="mb-4"><span className="font-bold">Status Olshopin</span><br />Aktif</p>
        </div>
      </div>
    </div>
  );
};

export default InformasiToko;
