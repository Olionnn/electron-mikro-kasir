import React from "react";
import { MdEdit, MdLogout, MdBlock } from "react-icons/md";

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          PROFIL
        </h2>
        <button
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-base md:text-lg transition-colors"
          title="Edit Profil"
        >
          <MdEdit className="text-lg md:text-xl" />
          Edit Profil
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full ring-2 ring-green-100"
          alt="Profile"
        />
      </div>

      {/* Info Profil */}
      <div className="flex-1 text-base md:text-lg">
        {[
          { label: "Nama", value: "beastbeeme2" },
          { label: "Kode Referral", value: "-" },
          { label: "Role User", value: "Owner" },
          { label: "Email", value: "beastbeeme2@gmail.com" },
          { label: "Telepon", value: "+62085707896575" },
          { label: "Alamat", value: "-" },
        ].map((item, idx) => (
          <div key={idx}>
            <div className="px-6 py-4">
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="font-semibold text-gray-900">{item.value}</div>
            </div>
            {idx < 5 && <div className="h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Tombol Aksi */}
      <div className="px-6 py-8 space-y-4">
        <button
          className="w-full bg-white border border-gray-300 text-green-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 text-lg transition-colors"
          title="Logout"
        >
          <MdLogout className="text-2xl" />
          Logout Aplikasi
        </button>
        <button
          className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 text-lg transition-colors"
          title="Nonaktifkan Akun"
        >
          <MdBlock className="text-2xl" />
          Nonaktifkan Akun
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;