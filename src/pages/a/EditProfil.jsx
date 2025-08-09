import React from "react";

const EditParentProfile = () => {
  return (
    <div className="bg-white text-gray-800 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <span className="material-icons text-3xl cursor-pointer">arrow_back</span>
          <h1 className="text-2xl font-bold">EDIT PROFIL ORANG TUA</h1>
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="flex flex-col items-center">
          {/* Foto Profil */}
          <div className="relative">
            <div className="w-32 h-32 bg-green-100 rounded-full" />
            <button className="absolute bottom-2 right-2 bg-white border rounded-full p-1 shadow">
              <span className="material-icons text-green-600">image</span>
            </button>
          </div>

          {/* Form Input */}
          <form className="w-full max-w-xl mt-10 space-y-6">
            {/* Nama */}
            <div>
              <label className="block mb-2 font-semibold">Nama</label>
              <input
                type="text"
                defaultValue="beastbeeme2"
                className="w-full border rounded-lg px-4 py-3 text-xl"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                defaultValue="beastbeeme2@gmail.com"
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-xl"
                disabled
              />
            </div>

            {/* Telepon */}
            <div className="relative">
              <label className="block mb-2 font-semibold">No. Telepon</label>
              <input
                type="text"
                defaultValue="+62085707896575"
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-xl"
                disabled
              />
              <span className="material-icons absolute right-4 top-[55%] -translate-y-1/2 text-green-500 cursor-pointer">
                edit
              </span>
            </div>

            {/* Alamat */}
            <div>
              <label className="block mb-2 font-semibold">Alamat</label>
              <input
                type="text"
                placeholder="Alamat"
                className="w-full border rounded-lg px-4 py-3 text-xl"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="border-t p-6">
        <button className="w-full bg-green-600 text-white py-4 rounded-full text-xl font-bold">
          Simpan
        </button>
      </div>
    </div>
  );
};

export default EditParentProfile;
