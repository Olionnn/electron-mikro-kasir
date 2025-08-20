// src/pages/FormToko.jsx
import React, { useState, useCallback } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { useNavigate } from "react-router-dom";


const FormToko = () => {
  const navigate = useNavigate();
  const [namaToko, setNamaToko] = useState("Abror G4nteng");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [pajak, setPajak] = useState(0);
  const [pemilik, setPemilik] = useState("beastbeeme2");
  const [address, setAddress] = useState("");

     const onBack = useCallback(() => navigate(-1), [navigate]);
  useNavbar({
    variant: "page",
    title: "Edit Toko",
    backTo: onBack,
    actions: [
      {
        label: "Simpan",
        onClick: () => {
          console.log("Data toko:", { namaToko, jenisUsaha, pajak, pemilik });
          alert("Perubahan toko berhasil disimpan!");
        },
        className:
          "bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 transition text-sm font-semibold",
      },
    ],
  }, [namaToko, jenisUsaha, pajak, pemilik]);

  return (
    <div className="bg-violet-100 text-gray-800 min-h-screen flex flex-col">
      {/* Konten scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        {/* Foto Profil Toko */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src="https://via.placeholder.com/150"
              alt="Foto Toko"
              className="w-32 h-32 rounded-full border-4 border-violet-500 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button className="absolute bottom-2 right-2 bg-violet-400  rounded-full p-2 shadow-md hover:shadow-lg transition">
              <span className=" text-white">image</span>
            </button>

            {/* Overlay ganti foto */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-white font-semibold">Ganti Foto</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="mt-10 space-y-6 text-lg">
          {/* Jenis Usaha */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Jenis Usaha</label>
            <select
              value={jenisUsaha}
              onChange={(e) => setJenisUsaha(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow-sm"
            >
              <option value="">Pilih jenis usaha...</option>
              <option value="makanan">Makanan</option>
              <option value="fashion">Fashion</option>
              <option value="elektronik">Elektronik</option>
            </select>
          </div>

          {/* Nama Toko */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Nama Toko</label>
            <input
              type="text"
              value={namaToko}
              onChange={(e) => setNamaToko(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* Pajak */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Pajak Default (%)</label>
            <input
              type="number"
              value={pajak}
              onChange={(e) => setPajak(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* Pemilik */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Nama Pemilik</label>
            <input
              type="text"
              value={pemilik}
              onChange={(e) => setPemilik(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* No. Telepon */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">No. Telepon</label>
            <input
              type="text"
              value="+62085707896575"
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-white text-lg cursor-not-allowed shadow-sm"
            />
            <p className="text-sm text-red-600 mt-1">*Belum Verifikasi</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormToko;
