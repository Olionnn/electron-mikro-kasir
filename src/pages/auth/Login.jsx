import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo/logo.png"; // Sesuaikan path

/**
 * Login Page (Revamp + 3 Variants)
 * Palette:
 *  - Ungu Muda:  #B2B0E8
 *  - Biru Abu:   #7A85C1
 *  - Biru Tua:   #3B38A0
 *  - Navy Gelap: #1A2A80
 *
 * Catatan:
 * - Fungsi tidak diubah (tetap ada toggle show/hide password, CTA ke "/pos", tombol Google, link register, dan bendera ID).
 * - Production-ready, responsive, aksesibel, dan konsisten warna via CSS variables.
 * - Tersedia 3 alternatif layout: "A" (Split), "B" (Centered Card), "C" (Reversed Split).
 * - Pakai: <Login variant="A"/> atau "B"/"C". Default: "A".
 */

export default function Login({ variant = "A" }) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Masuk | Aplikasi";
  }, []);

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

      {variant === "B" ? (
        <LoginLayoutB showPassword={showPassword} setShowPassword={setShowPassword} />
      ) : variant === "C" ? (
        <LoginLayoutC showPassword={showPassword} setShowPassword={setShowPassword} />
      ) : (
        <LoginLayoutA showPassword={showPassword} setShowPassword={setShowPassword} />
      )}
    </div>
  );
}

/* ---------------------------- SHARED FIELDS ---------------------------- */
function FormFields({ showPassword, setShowPassword }) {
  return (
    <>
      {/* Subheader */}
      <p className="mb-6 text-sm text-slate-600">
        Kamu dapat masuk sebagai <strong>Owner</strong> ataupun <strong>Staff</strong>
      </p>

      {/* Email */}
      <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-600">
        Email
      </label>
      <div className="relative mb-4">
        <input
          id="email"
          type="email"
          placeholder="nama@perusahaan.com"
          className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
          autoComplete="email"
          required
        />
        {/* Icon kiri */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 7.5L10.8 13.2C11.523 13.682 12.477 13.682 13.2 13.2L22 7.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Password */}
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor="password" className="block text-sm font-medium text-slate-600">
          Password
        </label>
        <Link to="#" className="text-xs font-medium" style={{ color: "var(--blue-700)" }}>
          Lupa Password?
        </Link>
      </div>
      <div className="relative mb-6">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 pr-12 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--purple-200)]/60"
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.143 2.31a.75.75 0 0 1 1.047-.167l14.5 10.5a.75.75 0 1 1-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 0 1 .143 2.31Zm1.536 5.622A.12.12 0 0 0 1.657 8c0 .021.006.045..022.068c.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 0 1 6.058 7.52L3.529 5.688a14.207 14.207 0 0 0-1.85 2.244ZM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 1 1-.473-1.423A6.207 6.207 0 0 1 8 2c1.981 0 3.67.992 4.933 2.078c1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.11.166-.248.365-.41.587a.75.75 0 1 1-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 0 0 0-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 12.001V12c.003-.016.017-.104.095-.277c.086-.191.225-.431.424-.708c.398-.553.993-1.192 1.745-1.798C7.777 7.996 9.812 7 12 7c2.188 0 4.223.996 5.736 2.216c.752.606 1.347 1.245 1.745 1.798c.2.277.338.517.424.708c.078.173.092.261.095.277V12c-.003.016-.017.104-.095.277a4.251 4.251 0 0 1-.424.708c-.398.553-.993 1.192-1.745 1.798C16.224 16.004 14.188 17 12 17c-2.188 0-4.223-.996-5.736-2.216c-.752-.606-1.347-1.245-1.745-1.798a4.226 4.226 0 0 1-.424-.708A1.115 1.115 0 0 1 4 12.001ZM12 5C9.217 5 6.752 6.254 5.009 7.659c-.877.706-1.6 1.474-2.113 2.187a6.157 6.157 0 0 0-.625 1.055C2.123 11.23 2 11.611 2 12c0 .388.123.771.27 1.099c.155.342.37.7.626 1.055c.513.713 1.236 1.48 2.113 2.187C6.752 17.746 9.217 19 12 19c2.783 0 5.248-1.254 6.991-2.659c.877-.706 1.6-1.474 2.113-2.187c.257-.356.471-.713.625-1.055c.148-.328.271-.71.271-1.099c0-.388-.123-.771-.27-1.099a6.197 6.197 0 0 0-.626-1.055c-.513-.713-1.236-1.48-2.113-2.187C17.248 6.254 14.783 5 12 5Zm-1 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"/>
            </svg>
          )}
        </button>
      </div>

      {/* CTA */}
      <Link
        to="/pos"
        className="group relative mb-6 inline-flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-4 text-base font-semibold text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/50"
        style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
      >
        <span
          className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100"
          style={{ background: "linear-gradient(90deg, var(--purple-200), var(--blue-300))" }}
        />
        Masuk
      </Link>

      {/* Google */}
      <div className="mb-6 flex justify-center">
        <button type="button" className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/40">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Masuk dengan Google
        </button>
      </div>

      {/* Register */}
      <p className="text-center text-sm text-slate-600">
        Belum punya akun?
        <Link to="/register" className="ml-1 font-semibold" style={{ color: "var(--blue-700)" }}>
          Daftar di sini
        </Link>
      </p>
    </>
  );
}

/* ---------------------------- LAYOUT A (Split) ---------------------------- */
function LoginLayoutA({ showPassword, setShowPassword }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT / BRAND PANEL */}
      <div
        className="relative hidden items-center justify-center overflow-hidden lg:flex"
        style={{ background: "linear-gradient(135deg, var(--blue-700) 0%, var(--navy-800) 60%)" }}
      >
        <div
          className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(closest-side, var(--purple-200), transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(closest-side, var(--blue-300), transparent)" }}
        />

        <div className="relative z-10 max-w-xl px-10 text-center text-white">
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <img src={Logo} alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">Tersedia Untuk iOS, Mac, & Desktop</h1>
          <p className="mt-4 text-white/80">Kelola operasional secara profesional dengan antarmuka modern dan performa responsif.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">iOS</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">macOS</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">Desktop</span>
          </div>
        </div>
      </div>

      {/* RIGHT / FORM PANEL */}
      <div className="relative flex items-center justify-center px-6 py-10 lg:px-16">
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: "linear-gradient(90deg, var(--purple-200), var(--blue-300))" }}
        />

        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={Logo} alt="Logo" className="h-14 w-14 rounded-xl" />
              <div>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--navy-800)" }}>Masuk</h2>
                <p className="text-xs text-slate-500">Antarmuka B2B yang elegan, futuristik, dan profesional.</p>
              </div>
            </div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg"
              alt="Indonesian Flag"
              className="h-10 w-10 rounded-full ring-1 ring-slate-200"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <FormFields showPassword={showPassword} setShowPassword={setShowPassword} />
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
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
  );
}

/* ------------------------- LAYOUT B (Centered Card) ------------------------- */
function LoginLayoutB({ showPassword, setShowPassword }) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-100px] top-[-80px] h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(closest-side, var(--purple-200), transparent)" }} />
        <div className="absolute right-[-120px] bottom-[-120px] h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(closest-side, var(--blue-300), transparent)" }} />
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Brand Side */}
        <div className="order-2 flex flex-col items-center justify-center text-center lg:order-1 lg:col-span-2">
          <img src={Logo} alt="Logo" className="mb-4 h-16 w-16" />
          <h1 className="text-2xl font-bold" style={{ color: "var(--navy-800)" }}>Selamat Datang</h1>
          <p className="mt-2 max-w-xs text-xs text-slate-500">Masuk untuk melanjutkan pekerjaan Anda dengan efisien.</p>
        </div>

        {/* Card */}
        <div className="order-1 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur lg:order-2 lg:col-span-3">
          {/* Header minimal */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--blue-700)" }}>Masuk</h2>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg"
              alt="Indonesian Flag"
              className="h-8 w-8 rounded-full ring-1 ring-slate-200"
            />
          </div>

          <FormFields showPassword={showPassword} setShowPassword={setShowPassword} />
        </div>
      </div>
    </div>
  );
}

/* --------------------- LAYOUT C (Reversed Split / Hero) --------------------- */
function LoginLayoutC({ showPassword, setShowPassword }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT / FORM PANEL */}
      <div className="relative order-2 flex items-center justify-center px-6 py-10 lg:order-1 lg:px-16">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-12 w-12 rounded-xl" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--navy-800)" }}>Masuk</h2>
              <p className="text-xs text-slate-500">Akses fitur bisnis Anda dengan cepat dan aman.</p>
            </div>
            <div className="ml-auto">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg"
                alt="Indonesian Flag"
                className="h-9 w-9 rounded-full ring-1 ring-slate-200"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <FormFields showPassword={showPassword} setShowPassword={setShowPassword} />
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} Perusahaan Anda</p>
        </div>
      </div>

      {/* RIGHT / ILLUSTRATION PANEL */}
      <div className="relative order-1 hidden overflow-hidden lg:block">
        {/* Gradient base */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--navy-800), var(--blue-700))" }} />
        {/* Accent wave */}
        <div className="absolute -left-24 bottom-[-80px] h-[420px] w-[420px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(closest-side, var(--purple-200), transparent)" }} />
        <div className="absolute -right-24 top-[-80px] h-[520px] w-[520px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(closest-side, var(--blue-300), transparent)" }} />

        {/* Center content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="mb-8 rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/20 backdrop-blur">
            <h3 className="text-2xl font-semibold">Tersedia Untuk iOS, Mac, & Desktop</h3>
          </div>
          <img src={Logo} alt="Logo" className="h-28 w-28 opacity-95" />
          <p className="mt-6 max-w-md text-white/85">Desain futuristik yang mencerminkan keandalan dan profesionalitas bisnis Anda.</p>
        </div>
      </div>
    </div>
  );
}
