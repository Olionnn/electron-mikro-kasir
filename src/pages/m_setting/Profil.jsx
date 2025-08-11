import React from "react";

const ProfilePage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      

      {/* Konten Profil */}
      <div className="flex-1 p-10">
        <div className="flex items-center justify-between border-b pb-6 mb-8">
          <h2 className="text-3xl font-semibold">PROFIL</h2>
          <a href="#" className="text-green-600 font-bold text-xl">
            Edit Profil
          </a>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            className="w-28 h-28 mb-8"
            alt="Profile"
          />
          <div className="w-full max-w-xl bg-gray-100 rounded-xl p-6 text-xl">
            <p>
              <span className="font-semibold">Nama</span>
              <br />
              beastbeeme2
            </p>
            <p className="mt-6">
              <span className="font-semibold">Kode Referral</span>
              <br />-
            </p>
            <p className="mt-6">
              <span className="font-semibold">Role User</span>
              <br />
              Owner
            </p>
            <p className="mt-6">
              <span className="font-semibold">Email</span>
              <br />
              beastbeeme2@gmail.com
            </p>
            <p className="mt-6">
              <span className="font-semibold">Telepon</span>
              <br />
              +62085707896575
            </p>
            <p className="mt-6">
              <span className="font-semibold">Alamat</span>
              <br />-
            </p>
          </div>

          {/* Tombol Logout dan Nonaktif */}
          <div className="mt-8 space-y-4 w-full max-w-xl">
            <button className="w-full bg-white border border-gray-300 text-green-600 font-bold py-3 rounded-xl flex items-center justify-center gap-3 text-xl">
              <span className="material-icons text-[28px]">logout</span> Logout Aplikasi
            </button>
            <button className="w-full bg-red-100 text-red-600 border border-red-300 py-3 rounded-xl flex items-center justify-center gap-3 text-xl">
              <span className="material-icons text-[28px]">block</span> Nonaktifkan Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
