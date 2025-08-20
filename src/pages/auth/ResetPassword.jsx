import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function UpdatePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password Baru:", password);
    console.log("Konfirmasi Password:", confirmPassword);
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
        <h2 className="text-center text-lg font-bold mb-6">Perbarui Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Alamat Email</label>
            <input
              type="email"
              placeholder="Masukkan email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-violet-300"
              required
            />
          </div>

          {/* Password Baru */}
          <div className="relative">
            <label className="block mb-1 font-semibold">Password Baru</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md p-2 pr-10 focus:outline-none focus:ring focus:ring-violet-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Konfirmasi Password */}
          <div className="relative">
            <label className="block mb-1 font-semibold">Konfirmasi Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md p-2 pr-10 focus:outline-none focus:ring focus:ring-violet-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition"
          >
            Perbarui Password
          </button>
        </form>
      </div>
    </div>
  );
}
