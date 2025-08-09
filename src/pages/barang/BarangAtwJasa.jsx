import React from "react";
import { MdFilterList } from "react-icons/md";
import { Link } from "react-router-dom";

export default function BarangJasa() {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/management" className="text-2xl text-gray-700">←</Link>
          <h1 className="text-2xl font-bold">Barang atau Jasa</h1>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-white hover:text-gray-600"
        >
          Refresh (F5)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-[60%] flex flex-col justify-between overflow-hidden bg-white border-r">
          <div className="overflow-y-auto p-6">
            <div className="flex gap-4 mb-4">
              <MdFilterList size={40} className="mx-auto my-auto" color="green" />
              <input
                type="text"
                placeholder="Cari barang..."
                className="flex-1 p-4 text-xl border rounded-xl focus:outline-green-500"
              />
            </div>

            <div className="mb-4 flex gap-2">
              <button className="bg-white text-gray-600 border border-green-400 px-6 py-2 rounded-lg text-lg hover:bg-green-200">
                Semua
              </button>
              <button className="bg-white text-gray-600 border border-green-400 px-6 py-2 rounded-lg text-lg hover:bg-green-200">
                aenfa
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  nama: "Beras",
                  kode: "132312",
                  stok: 9,
                  harga: "Rp 11.000 - Rp 13.000",
                  selected: true,
                  image: "",
                },
                {
                  nama: "Kecap",
                  kode: "666",
                  stok: 10,
                  harga: "Rp 4.000",
                  selected: false,
                  image: "",
                },
                {
                  nama: "Beras 5KG",
                  kode: "1312",
                  stok: 5,
                  harga: "Rp 70.000",
                  selected: false,
                  image: "",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${
                    item.selected
                      ? "bg-green-100 border-green-500"
                      : "bg-white border-gray-300"
                  } p-4 rounded-xl flex justify-between items-center text-xl font-semibold cursor-pointer border`}
                >
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.nama}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="bg-gray-300 w-14 h-14 rounded-md flex items-center justify-center font-bold text-2xl">
                        {item.nama.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div>{item.nama}</div>
                      <div className="text-sm text-gray-500">Kode: {item.kode}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div>Stok: {item.stok}</div>
                    <div>{item.harga}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white border-t-2">
            <button className="w-full bg-green-500 text-white text-2xl py-4 rounded-xl font-bold hover:bg-green-700">
              TAMBAH BARANG
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[40%] overflow-y-auto p-6 bg-gray-50">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-4 text-lg rounded-lg">
            ✏️ Untuk mengubah data barang, silakan buka{' '}
            <span className="text-blue-600 underline cursor-pointer">
              Kasir Pintar Dashboard
            </span>
            .
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-300 w-14 h-14 rounded-md flex items-center justify-center font-bold text-2xl">
              Be
            </div>
            <div>
              <div className="text-2xl font-bold">Beras</div>
              <div className="text-gray-600 text-lg">Kode: 132312</div>
            </div>
          </div>

          <div className="space-y-3 text-xl">
            <div>Harga Dasar: <strong>Rp 11.000</strong></div>
            <div>Harga Jual: <strong>Rp 13.000</strong></div>
            <div>Diskon: 0%</div>
            <div>Berat: 0 Gram</div>
            <div>Stok: 9</div>
            <div>Stok Minimum: 0</div>
            <div>Kategori: -</div>
            <div>Letak Rak: -</div>
            <div>Keterangan: -</div>
          </div>

          <button className="mt-6 w-full bg-blue-200 text-blue-900 text-center py-4 rounded-lg font-medium text-xl hover:bg-blue-300">
            ➔ LIHAT DETAIL STOK
          </button>
        </div>
      </div>
    </div>
  );
}
