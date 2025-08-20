import React, { useState } from "react";


export default function DataTokoForm() {
  const [showOptional, setShowOptional] = useState(false);

  return (
    <div className="flex justify-center min-h-screen bg-white py-8">
      <div className="w-full max-w-2xl p-6">
        <h1 className="text-lg font-semibold text-center mb-6">
          Data Toko atau Usaha
        </h1>

        <form className="space-y-4">
          {/* Jenis Usaha & Nama Toko */}
          <div className="grid grid-cols-2 gap-4">
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Pilih jenis usaha ...</option>
              <option>Retail</option>
              <option>Kuliner</option>
              <option>Fashion</option>
            </select>
            <input
              type="text"
              placeholder="Nama Toko"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Negara */}
          <div>
            <label className="block text-sm mb-1">Negara</label>
            <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Indonesia</option>
              <option>Malaysia</option>
              <option>Singapura</option>
            </select>
          </div>

          {/* Provinsi & Kota */}
          <div className="grid grid-cols-2 gap-4">
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Pilih Provinsi</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Pilih Kota</option>
            </select>
          </div>

          {/* Alamat */}
          <div className="relative">
            <input
              type="text"
              placeholder="Alamat"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <span className="absolute right-3 top-2.5 text-violet-500 cursor-pointer">
              📍
            </span>
          </div>
          <p className="text-red-500 text-sm">Pin lokasi toko belum diatur</p>

          {/* Checkbox tampilkan toko */}
          <div className="flex items-start space-x-2">
            <input type="checkbox" defaultChecked className="mt-1" />
            <span className="text-sm">
              Tampilkan toko di olshopin
              <br />
              <span className="text-gray-500 text-xs">
                Agar pembeli dapat mengakses toko Anda melalui marketplace
                Olshopin.com
              </span>
            </span>
          </div>

          {/* Dari mana tahu & Lama usaha */}
          <div className="grid grid-cols-2 gap-4">
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Pilih Jawaban</option>
              <option>Teman</option>
              <option>Iklan</option>
              <option>Media Sosial</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Pilih Jawaban</option>
              <option>&lt; 1 tahun</option>
              <option>1 - 3 tahun</option>
              <option>&gt; 3 tahun</option>
            </select>
          </div>

          {/* Data lainnya (opsional) */}
          {/* <div className="text-center">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="text-violet-600 font-medium"
            >
              Data Lainnya (Opsional) {showOptional ? "▲" : "▼"}
            </button>
          </div> */}
          {/* {showOptional && (
            <div className="border p-4 rounded-md">
              <input
                type="text"
                placeholder="Opsional Field 1"
                className="w-full mb-2 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                placeholder="Opsional Field 2"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )} */}

          {/* Button simpan */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="w-full bg-violet-500 text-white py-3 rounded-full font-semibold hover:bg-violet-600 transition"
            >
              SIMPAN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

