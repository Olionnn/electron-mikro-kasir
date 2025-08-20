import React, { act } from "react";
import { MdEdit, MdLogout, MdBlock, MdEmail, MdPhone, MdPerson, MdLocationOn, MdCode } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar"; // Assuming you have a custom hook for navbar

const ProfilePage = () => {
  const profileInfo = [
    { label: "Nama", value: "beastbeeme2", icon: <MdPerson /> },
    { label: "Kode Referral", value: "-", icon: <MdCode /> },
    { label: "Role User", value: "Owner", icon: <MdPerson /> },
    { label: "Email", value: "beastbeeme2@gmail.com", icon: <MdEmail /> },
    { label: "Telepon", value: "+62085707896575", icon: <MdPhone /> },
    { label: "Alamat", value: "-", icon: <MdLocationOn /> },
  ];

  // Set navbar for this page
  useNavbar({
    variant: "page",
    title: "Profil",
    backTo: null, 
    actions: [
      {
        type: "link",
        title: "Edit Profil",
        to: "/pengaturan/editprofil",
        className: "bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2",
        icon: <MdEdit className="text-lg" />,
      },
    ],
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-50 to-white">

      <div className="flex flex-col items-center py-8 relative">
        <div className="relative group">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-violet-100 shadow-lg transform group-hover:scale-105 transition-transform"
            alt="Profile"
          />
          <span className="absolute bottom-0 right-0 bg-violet-500 text-white p-2 rounded-full shadow-md">
            <MdEdit />
          </span>
        </div>
        <p className="mt-4 text-lg font-bold text-gray-800">beastbeeme2</p>
        <p className="text-sm text-gray-500">Owner</p>
      </div>

      {/* Info Profil */}
      <div className="flex-1 px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden divide-y">
          {profileInfo.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-violet-600 text-2xl">{item.icon}</span>
              <div>
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="font-semibold text-gray-900">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="px-6 py-8 space-y-4">
        <button
          className="w-full bg-white border border-gray-300 text-violet-700 hover:bg-violet-50 hover:shadow font-semibold py-3 rounded-xl flex items-center justify-center gap-3 text-lg transition-all"
        >
          <MdLogout className="text-2xl" />
          Logout Aplikasi
        </button>
        <button
          className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow font-semibold py-3 rounded-xl flex items-center justify-center gap-3 text-lg transition-all"
        >
          <MdBlock className="text-2xl" />
          Nonaktifkan Akun
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
