import React from "react";

export default function ForgotPasswordSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <img
          src="/logo.png"
          alt="Kasir Pintar"
          className="h-10 mr-2"
        />
        <h1 className="text-xl font-bold text-violet-600">
          Kasir<span className="text-orange-500">Pintar</span>
        </h1>
      </div>

      {/* Card */}
      <div className="bg-gray-50 shadow rounded-2xl w-full max-w-2xl p-6">
        <h2 className="text-center text-lg font-bold mb-4">Lupa Password</h2>

        {/* Success Alert */}
        <div className="bg-violet-100 border border-violet-200 rounded-md p-4">
          <p className="text-violet-700 font-semibold mb-2">
            Permintaan reset password telah dikirim!
          </p>
          <p className="text-gray-700 mb-2">
            Tautan untuk mengatur ulang password Anda telah dikirimkan ke{" "}
            <span className="font-bold">irenazleya@gmail.com</span>
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>
              Mohon untuk mengecek secara berkala dan refresh email anda
            </li>
            <li>
              Jika belum menemukan email tautan, silahkan cek pada kolom tab / kategori:{" "}
              <span className="font-bold">
                Spam, Promotion, Social, Updates
              </span>{" "}
              pada email anda.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a href="/login" className="text-violet-600 hover:underline text-sm">
            &lt; Kembali ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  );
}
