// src/pages/EditParentProfile.jsx
import React, { useState, useCallback } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { useNavigate } from "react-router-dom";

const EditParentProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("beastbeeme2");
  const [address, setAddress] = useState("");

  const onBack = useCallback(() => navigate(-1), [navigate]);

  useNavbar(
    {
      variant: "page",
      title: "Edit Profil",
      backTo: onBack,
      actions: [
        {
          label: "Simpan",
          onClick: () => {
            console.log("Data disimpan:", { name, address });
            alert("Perubahan berhasil disimpan!");
          },
          className:
            "bg-green-600 text-white px-5 py-2 rounded-full shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm font-semibold",
        },
      ],
    },
    [name, address]
  );
  return (
    <div className="bg-white-50 dark:bg-white-400 text-violet-400 dark:text-gray-100 min-h-full flex flex-col">
      {/* Konten scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10">
        
        {/* Foto Profil */}
        <section className="flex flex-col items-center">
          <div className="relative group">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white dark:border-violet-800 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              aria-label="Ganti Foto"
              className="absolute bottom-2 right-2 bg-white dark:bg-violet-800 border dark:border-violet-700 rounded-full p-2 shadow-md hover:shadow-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            >
              <span className="material-icons text-white-600 dark:text-white-400">
                image
              </span>
            </button>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-white font-medium">Ganti Foto</span>
            </div>
          </div>
        </section>

        {/* Form */}
        <form className="mt-10 space-y-6">
          {/* Nama */}
          <div className="bg-white dark:bg-violet-800 rounded-xl p-5 shadow-sm ring-1 ring-violet-200 dark:ring-violet-700 transition hover:shadow-md">
            <label
              htmlFor="name"
              className="block mb-2 font-semibold text-violet-700 dark:text-violet-200"
            >
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-violet-300 dark:border-violet-600 rounded-lg px-4 py-3 text-lg bg-white dark:bg-violet-400 focus:ring-2 focus:ring-blue-700 focus:outline-none shadow-sm transition"
            />
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-violet-800 rounded-xl p-5 shadow-sm ring-1 ring-violet-200 dark:ring-violet-700">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-violet-700 dark:text-violet-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value="beastbeeme2@gmail.com"
              disabled
              className="w-full border border-violet-300 dark:border-violet-700 rounded-lg px-4 py-3 bg-violet-100 dark:bg-violet-400 text-lg cursor-not-allowed shadow-sm text-black-500 dark:text-violet-300"
            />
          </div>

          {/* Telepon */}
          <div className="bg-white dark:bg-violet-800 rounded-xl p-5 shadow-sm ring-1 ring-violet-200 dark:ring-violet-700">
            <label
              htmlFor="phone"
              className="block mb-2 font-semibold text-violet-700 dark:text-violet-200"
            >
              No. Telepon
            </label>
            <input
              id="phone"
              type="text"
              value="+62085707896575"
              disabled
              className="w-full border border-violet-300 dark:border-violet-700 rounded-lg px-4 py-3 bg-violet-100 dark:bg-violet-400 text-lg cursor-not-allowed shadow-sm text-violet-500 dark:text-violet-300"
            />
          </div>

          {/* Alamat */}
          <div className="bg-white dark:bg-violet-800 rounded-xl p-5 shadow-sm ring-1 ring-violet-200 dark:ring-violet-700 hover:shadow-md transition">
            <label
              htmlFor="address"
              className="block mb-2 font-semibold text-violet-700 dark:text-violet-200"
            >
              Alamat
            </label>
            <input
              id="address"
              type="text"
              placeholder="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-violet-300 dark:border-violet-600 rounded-lg px-4 py-3 text-lg bg-white dark:bg-violet-400 focus:ring-2 focus:ring-blue-700 focus:outline-none shadow-sm transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditParentProfile;
