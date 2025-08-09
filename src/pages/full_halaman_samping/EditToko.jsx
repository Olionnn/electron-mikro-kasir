import React from 'react';

const FormToko = () => {
  return (
    <div className="w-full h-full p-8">
      {/* Judul */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="material-icons text-[28px]">arrow_back</span>
          <h1 className="text-3xl font-bold">TOKO</h1>
        </div>
      </div>
      <hr className="mb-6" />

      {/* Gambar Profil */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-green-100"></div>
          <span className="material-icons absolute top-[35%] left-[35%] text-5xl text-green-700">image</span>
        </div>
      </div>

      {/* Olshopin */}
      <div className="bg-gray-100 rounded-xl p-6 mb-8 w-full">
        <h2 className="font-semibold text-2xl mb-2">Olshopin</h2>
        <p className="text-gray-600 text-[20px] mb-4">
          Pilih "Tampilkan" agar pembeli dapat mengakses toko anda melalui marketplace{' '}
          <span className="text-green-600 font-semibold">olshopin.</span>
        </p>
        <div className="space-y-4 text-[20px]">
          <label className="flex items-center gap-3">
            <input type="radio" name="olshopin" className="w-5 h-5" />
            Tampilkan sebagai Katalog
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="olshopin" defaultChecked className="w-5 h-5" />
            Tampilkan Katalog dan Terima Order
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="olshopin" className="w-5 h-5" />
            Nonaktifkan Olshopin
          </label>
        </div>
      </div>

      {/* Form Data Usaha */}
      <div className="bg-gray-100 rounded-xl p-6 mb-10 text-[20px]">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jenis Usaha */}
          <div>
            <label className="block font-semibold mb-1">Jenis Usaha</label>
            <select className="w-full p-4 border rounded-lg">
              <option>pilih jenis usaha ...</option>
            </select>
          </div>

          {/* Nama Toko */}
          <div>
            <label className="block font-semibold mb-1">Nama Toko/Usaha</label>
            <input type="text" className="w-full p-4 border rounded-lg" defaultValue="Abror G4nteng" />
          </div>

          {/* Pajak Default */}
          <div>
            <label className="block font-semibold mb-1">Pajak Default %</label>
            <input type="number" className="w-full p-4 border rounded-lg" defaultValue="0" />
          </div>

          {/* Nama Pemilik */}
          <div>
            <label className="block font-semibold mb-1">Nama Pemilik/Owner</label>
            <input type="text" className="w-full p-4 border rounded-lg" defaultValue="beastbeeme2" />
          </div>

          {/* No. Telepon */}
          <div className="col-span-2 flex gap-4 items-start">
            <div className="flex-1">
              <label className="block font-semibold mb-1">No. Telepon</label>
              <input
                type="text"
                className="w-full p-4 border rounded-lg bg-gray-100"
                defaultValue="+62085707896575"
                disabled
              />
              <p className="text-sm text-red-600 mt-1">*Belum Verifikasi</p>
            </div>
            <button className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold border border-green-300 mt-8">
              Verifikasi
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="w-full">
        <button className="w-full bg-green-600 text-white py-5 rounded-full text-2xl font-bold">
          Simpan
        </button>
      </div>
    </div>
  );
};

export default FormToko;
