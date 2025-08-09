import React from 'react';

export default function ManajemenStaff() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b">
        <div className="flex items-center gap-6">
          <span className="text-3xl text-green-600 cursor-pointer">&larr;</span>
          <h1 className="text-2xl font-bold">MANAJEMEN STAFF</h1>
        </div>
        <div className="text-green-600 text-2xl cursor-pointer">ℹ️</div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Panel */}
        <div className="w-2/5 border-r relative flex flex-col">
          {/* Info */}
          <div className="bg-gray-100 text-base text-gray-700 px-6 py-5">
            Untuk mengatur hak akses staff yang lebih lengkap
            <br />
            <a
              href="http://kasirpintar.co.id"
              className="text-green-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://kasirpintar.co.id
            </a>
          </div>

          {/* Placeholder daftar staff */}
          <div className="flex-1"></div>

          {/* Tombol Tambah Staff */}
          <div className="p-6">
            <button className="w-full bg-green-600 text-white py-4 text-lg rounded-full font-semibold shadow-md hover:bg-green-700 transition">
              Tambah Staff
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-3/5 bg-white"></div>
      </div>
    </div>
  );
}
