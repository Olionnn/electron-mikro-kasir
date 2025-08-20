import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link dikirim ke:", email);
  };

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
      <div className="bg-gray-50 shadow rounded-2xl w-full max-w-md p-6">
        <h2 className="text-center text-lg font-bold mb-4">Lupa Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Alamat Email</label>
            <input
              type="email"
              placeholder="Masukkan email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-violet-300"
              required
            />
          </div>

          {/* Captcha Dummy */}
          <div className="flex items-center justify-between border rounded-md p-3 bg-white">
            <div className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Saya bukan robot</span>
            </div>
            <img src="/recaptcha.png" alt="captcha" className="h-8" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-full hover:bg-violet-700 transition"
          >
            Kirim tautan atur ulang password
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-500">Batal lupa password?</p>
          <a href="/login" className="text-violet-600 hover:underline">
            &lt; Kembali ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  );
}



 
