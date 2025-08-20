import React, { useState, useEffect } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { useNavigate } from "react-router-dom";

export default function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(98); // 1 menit 38 detik

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Fungsi handle input
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus ke input berikutnya
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleClear = () => {
    setOtp(Array(6).fill(""));
    document.getElementById("otp-0").focus();
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    alert("Kode OTP dimasukkan: " + otpCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6">
        <h1 className="text-lg font-semibold text-center mb-4">VERIFIKASI</h1>
        <p className="text-center text-gray-600 mb-2">
          Demi keamanan akun dan informasi terkait, silahkan masukkan kode OTP
          yang dikirim melalui WhatsApp ke nomor Anda
          <br />
          <span className="font-medium">(+62088217707877)</span>
        </p>

        <p className="text-center font-medium mt-4">
          Masukkan 6 Digit OTP
        </p>
        <p className="text-center text-gray-500 mb-4">
          Kode OTP yang dikirim, valid dalam{" "}
          <span className="font-semibold">
            {Math.floor(timeLeft / 60)} Menit {timeLeft % 60} Detik
          </span>
        </p>

        {/* Input OTP */}
        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          ))}
        </div>

        <div className="text-center text-red-500 mb-4 cursor-pointer" onClick={handleClear}>
          Hapus OTP
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-violet-500 text-white font-semibold hover:bg-violet-600 transition"
        >
          VERIFIKASI
        </button>
      </div>
    </div>
  );
}
