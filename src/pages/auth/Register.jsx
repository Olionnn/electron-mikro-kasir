import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Alert from "../../component/Alert";
import { setFlash } from "../../utils/utils";

export default function Register() {
  const { register, loading, error } = useAuth();
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    username: "",
    no_telp: "",
    alamat: "",
    role: 1,
    status: 0,
  });

  useEffect(() => { document.title = "Daftar Akun | Aplikasi"; }, []);
  useEffect(() => { setLocalError(error); }, [error]);


  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await register({
        nama: form.nama,
        email: form.email,
        password: form.password,
        username: form.username,
        no_telp: form.no_telp,
        alamat: form.alamat,
        role: "owner",
        status: form.status ? 1 : 0,
      });
      setSuccessMsg("Registrasi berhasil! Mengarahkan ke halaman masuk...");
      // set flash untuk halaman login
      setFlash("success", "Registrasi berhasil. Silakan masuk dengan kredensial Anda.");
      // setTimeout(() => nav("/"), 900);

      
      nav("/create-toko");
    } catch (e2) {
      setFlash(e2?.message || "Gagal registrasi", "error");
      setLocalError(e2?.message || "Gagal registrasi");
    }
  };

  
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Color Tokens */}
      <style>{`
        :root {
          --purple-200: #B2B0E8; /* Ungu Muda */
          --blue-300: #7A85C1;  /* Biru Abu */
          --blue-700: #3B38A0;  /* Biru Tua */
          --navy-800: #1A2A80;  /* Navy Gelap */
        }
      `}</style>

    <div className="grid h-full grid-cols-1 lg:grid-cols-2">
      {/* LEFT / BRAND PANEL */}
      <div
        className="relative hidden items-center justify-center overflow-hidden lg:flex"
        style={{
          background:
            "linear-gradient(135deg, var(--blue-700) 0%, var(--navy-800) 60%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, var(--purple-200), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(closest-side, var(--blue-300), transparent)",
          }}
        />

        <div className="relative z-10 max-w-xl px-10 text-center text-white">
          <div className="mx-auto mb-8 inline-flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/20 backdrop-blur">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10h10M7 14h7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-lg font-semibold">Buat Akun Baru</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Mulai perjalanan bisnismu
          </h2>
          <p className="mt-4 text-white/80">
            Antarmuka modern, performa responsif, dan pengalaman onboarding yang
            halus.
          </p>
        </div>
      </div>

      {/* RIGHT / FORM PANEL */}
           <div className="relative flex h-full flex-col px-6 py-10 lg:px-16">
        {/* Alerts */}
          <div className="mx-auto mt-3 w-full max-w-2xl space-y-3">
            {localError && (
              <Alert type="error" onClose={() => setLocalError(null)}>
                {localError}
              </Alert>
            )}
            {successMsg && (
              <Alert type="success" onClose={() => setSuccessMsg(null)}>
                {successMsg}
              </Alert>
            )}
          </div>
        {/* area scroll */}
        <div className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-6 mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold" style={{ color:"var(--blue-700)" }}>Pendaftaran</h3>
                <p className="text-xs text-slate-500">Isi data berikut untuk membuat akun baru.</p>
              </div>
              <img src="https://flagcdn.com/w40/id.png" alt="ID" className="h-8 w-12 rounded-md ring-1 ring-slate-200" />
            </div>

            {/* FORM dimulai di sini */}
            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
              <SharedFields
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                form={form}
                setForm={setForm}
                loading={loading}
              />
            </form>

            {/* footer kecil */}
            <div className="mt-6 mb-10 flex items-center justify-between text-xs text-slate-400">
              <span>© {new Date().getFullYear()} Perusahaan Anda</span>
              <div className="flex items-center gap-3">
                <Link to="#" className="hover:text-slate-600">Privasi</Link>
                <span aria-hidden>•</span>
                <Link to="#" className="hover:text-slate-600">Syarat</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function SharedFields({ showPassword, setShowPassword, form, setForm, loading }) {
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* Grid fields */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Nama Lengkap */}
        <div>
          <label
            htmlFor="nama"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Nama Lengkap
          </label>
          <input
            id="nama"
            type="text"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChange={(e) => handleInputChange('nama', e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="mt-5">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-600"
        >
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="nama@perusahaan.com"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            autoComplete="email"
            required
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 7.5L10.8 13.2C11.523 13.682 12.477 13.682 13.2 13.2L22 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          *Harap gunakan email sebenarnya
        </p>
      </div>

      {/* Password */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-600"
          >
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 pr-12 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--purple-200)]/60"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M.143 2.31a.75.75 0 0 1 1.047-.167l14.5 10.5a.75.75 0 1 1-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 0 1 .143 2.31Zm1.536 5.622A.12.12 0 0 0 1.657 8c0 .021.006.045.022.068c.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 0 1 6.058 7.52L3.529 5.688a14.207 14.207 0 0 0-1.85 2.244ZM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 1 1-.473-1.423A6.207 6.207 0 0 1 8 2c1.981 0 3.67.992 4.933 2.078c1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.11.166-.248.365-.41.587a.75.75 0 1 1-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 0 0 0-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 12.001V12c.003-.016.017-.104.095-.277c.086-.191.225-.431.424-.708c.398-.553.993-1.192 1.745-1.798C7.777 7.996 9.812 7 12 7c2.188 0 4.223.996 5.736 2.216c.752.606 1.347 1.245 1.745 1.798c.2.277.338.517.424.708c.078.173.092.261.095.277V12c-.003.016-.017.104-.095.277a4.251 4.251 0 0 1-.424.708c-.398.553-.993 1.192-1.745 1.798C16.224 16.004 14.188 17 12 17c-2.188 0-4.223-.996-5.736-2.216c-.752-.606-1.347-1.245-1.745-1.798a4.226 4.226 0 0 1-.424-.708A1.115 1.115 0 0 1 4 12.001ZM12 5C9.217 5 6.752 6.254 5.009 7.659c-.877.706-1.6 1.474-2.113 2.187a6.157 6.157 0 0 0-.625 1.055C2.123 11.23 2 11.611 2 12c0 .388.123.771.27 1.099c.155.342.37.7.626 1.055c.513.713 1.236 1.48 2.113 2.187C6.752 17.746 9.217 19 12 19c2.783 0 5.248-1.254 6.991-2.659c.877-.706 1.6-1.474 2.113-2.187c.257-.356.471-.713.625-1.055c.148-.328.271-.71.271-1.099c0-.388-.123-.771-.27-1.099a6.197 6.197 0 0 0-.626-1.055c-.513-.713-1.236-1.48-2.113-2.187C17.248 6.254 14.783 5 12 5Zm-1 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Nomor Telepon
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-[color:var(--purple-200)]/60 focus-within:border-[color:var(--blue-700)]">
          {/* <img
            src="https://flagcdn.com/w40/id.png"
            alt="ID"
            className="h-6 w-9 rounded-md ring-1 ring-slate-200"
          />
          <span className="select-none text-sm text-slate-600">+62</span> */}
          <input
            type="tel"
            inputMode="numeric"
            placeholder="0812-3456-7890"
            value={form.no_telp}
            onChange={(e) => handleInputChange('no_telp', e.target.value)}
            className="flex-1 border-0 bg-transparent px-2 py-2 text-base outline-none placeholder:text-slate-400"
            pattern="[0-9\-\s]+"
            required
          />
        </div>
      </div>

      {/* Alamat */}
      <div className="mt-5">
        <label
          htmlFor="alamat"
          className="mb-2 block text-sm font-medium text-slate-600"
        >
          Alamat
        </label>
        <textarea
          id="alamat"
          placeholder="Masukkan alamat lengkap"
          value={form.alamat}
          onChange={(e) => handleInputChange('alamat', e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60 resize-none"
        />
      </div>

      {/* Terms */}
      <div className="mt-5 flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[color:var(--blue-700)] focus:ring-[color:var(--purple-200)]/60"
          required
        />
        <label htmlFor="terms" className="text-sm text-slate-600">
          Saya telah membaca dan menyetujui{" "}
          <Link
            to="#"
            className="font-semibold"
            style={{ color: "var(--blue-700)" }}
          >
            Syarat & Ketentuan
          </Link>{" "}
          dan{" "}
          <Link
            to="#"
            className="font-semibold"
            style={{ color: "var(--blue-700)" }}
          >
            Kebijakan Privasi
          </Link>
          .
        </label>
      </div>

      {/* CTA */}
        <button
        type="submit"
        disabled={loading}
        className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-4 text-base font-semibold text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/50 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background:"linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
      >
        <span
          className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100"
          style={{ background:"linear-gradient(90deg, var(--purple-200), var(--blue-300))" }}
        />
        {loading ? "Memproses..." : "Daftar"}
      </button>

      {/* Divider */}
      <div className="relative py-3 text-center">
        <span className="bg-white px-3 text-xs uppercase tracking-widest text-slate-400">
          atau
        </span>
        <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-slate-200" />
      </div>

      {/* Google */}
      <div className="mb-2 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/40"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Daftar dengan Google
        </button>
      </div>

      {/* Login Link */}
      <p className="pt-2 text-center text-sm text-slate-600">
        Sudah punya akun?
        <Link
          to="/"
          className="ml-1 font-semibold"
          style={{ color: "var(--blue-700)" }}
        >
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
