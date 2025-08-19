import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Register Page (Revamp + 3 Variants)
 * Palette:
 *  - Ungu Muda:  #B2B0E8
 *  - Biru Abu:   #7A85C1
 *  - Biru Tua:   #3B38A0
 *  - Navy Gelap: #1A2A80
 *
 * Catatan:
 * - Fungsi asli dipertahankan (toggle show/hide password, tombol Google, link Masuk/S&K/Privasi).
 * - Production-ready, responsive, aksesibel, dan konsisten warna via CSS variables.
 * - Tersedia 3 alternatif layout: "A" (Split), "B" (Centered Card), "C" (Reversed Split).
 * - Pakai: <Register variant="A"/> atau "B"/"C". Default: "A".
 */

export default function Register({ variant = "A" }) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Daftar Akun | Aplikasi";
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
        <RegisterLayoutB showPassword={showPassword} setShowPassword={setShowPassword} />
      ) : variant === "C" ? (
        <RegisterLayoutC showPassword={showPassword} setShowPassword={setShowPassword} />
      ) : (
        <RegisterLayoutA showPassword={showPassword} setShowPassword={setShowPassword} />
      )}
    </div>
  );
}

/* ---------------------------- SHARED FIELDS ---------------------------- */
function SharedFields({ showPassword, setShowPassword }) {
  return (
    <>
      {/* Title */}
      <h1 className="mb-2 text-3xl font-bold tracking-tight" style={{ color: "var(--navy-800)" }}>Daftar Akun</h1>
      <p className="mb-6 text-sm text-slate-600">Buat akun baru untuk mulai menggunakan platform.</p>

      {/* Grid fields */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Nama Lengkap */}
        <div>
          <label htmlFor="fullname" className="mb-2 block text-sm font-medium text-slate-600">Nama Lengkap</label>
          <input
            id="fullname"
            type="text"
            placeholder="Nama Lengkap"
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-600">Email</label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="nama@perusahaan.com"
              className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
              autoComplete="email"
              required
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7.5L10.8 13.2C11.523 13.682 12.477 13.682 13.2 13.2L22 7.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <p className="mt-2 text-xs text-slate-500">*Harap gunakan email sebenarnya</p>
        </div>
      </div>

      {/* Password + Phone */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 pr-12 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--purple-200)]/60"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor"><path d="M.143 2.31a.75.75 0 0 1 1.047-.167l14.5 10.5a.75.75 0 1 1-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 0 1 .143 2.31Zm1.536 5.622A.12.12 0 0 0 1.657 8c0 .021.006.045.022.068c.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 0 1 6.058 7.52L3.529 5.688a14.207 14.207 0 0 0-1.85 2.244ZM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 1 1-.473-1.423A6.207 6.207 0 0 1 8 2c1.981 0 3.67.992 4.933 2.078c1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.11.166-.248.365-.41.587a.75.75 0 1 1-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 0 0 0-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12.001V12c.003-.016.017-.104.095-.277c.086-.191.225-.431.424-.708c.398-.553.993-1.192 1.745-1.798C7.777 7.996 9.812 7 12 7c2.188 0 4.223.996 5.736 2.216c.752.606 1.347 1.245 1.745 1.798c.2.277.338.517.424.708c.078.173.092.261.095.277V12c-.003.016-.017.104-.095.277a4.251 4.251 0 0 1-.424.708c-.398.553-.993 1.192-1.745 1.798C16.224 16.004 14.188 17 12 17c-2.188 0-4.223-.996-5.736-2.216c-.752-.606-1.347-1.245-1.745-1.798a4.226 4.226 0 0 1-.424-.708A1.115 1.115 0 0 1 4 12.001ZM12 5C9.217 5 6.752 6.254 5.009 7.659c-.877.706-1.6 1.474-2.113 2.187a6.157 6.157 0 0 0-.625 1.055C2.123 11.23 2 11.611 2 12c0 .388.123.771.27 1.099c.155.342.37.7.626 1.055c.513.713 1.236 1.48 2.113 2.187C6.752 17.746 9.217 19 12 19c2.783 0 5.248-1.254 6.991-2.659c.877-.706 1.6-1.474 2.113-2.187c.257-.356.471-.713.625-1.055c.148-.328.271-.71.271-1.099c0-.388-.123-.771-.27-1.099a6.197 6.197 0 0 0-.626-1.055c-.513-.713-1.236-1.48-2.113-2.187C17.248 6.254 14.783 5 12 5Zm-1 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Nomor Telepon</label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-[color:var(--purple-200)]/60 focus-within:border-[color:var(--blue-700)]">
            <img src="https://flagcdn.com/w40/id.png" alt="ID" className="h-6 w-9 rounded-md ring-1 ring-slate-200" />
            <span className="select-none text-sm text-slate-600">+62</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="812-3456-7890"
              className="flex-1 border-0 bg-transparent px-2 py-2 text-base outline-none placeholder:text-slate-400"
              pattern="[0-9\-\s]+"
              required
            />
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="mt-5">
        <label htmlFor="ref" className="mb-2 block text-sm font-medium text-slate-600">Kode Referral (opsional)</label>
        <input
          id="ref"
          type="text"
          placeholder="Masukkan kode referral (jika ada)"
          className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
        />
      </div>

      {/* Terms */}
      <div className="mt-5 flex items-start gap-3">
        <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-slate-300 text-[color:var(--blue-700)] focus:ring-[color:var(--purple-200)]/60" required />
        <label htmlFor="terms" className="text-sm text-slate-600">
          Saya telah membaca dan menyetujui {" "}
          <Link to="#" className="font-semibold" style={{ color: "var(--blue-700)" }}>Syarat & Ketentuan</Link> {" "}
          dan {" "}
          <Link to="#" className="font-semibold" style={{ color: "var(--blue-700)" }}>Kebijakan Privasi</Link>.
        </label>
      </div>

      {/* CTA */}
      <Link
        to="/"
        className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-4 text-base font-semibold text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/50"
        style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
      >
        <span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(90deg, var(--purple-200), var(--blue-300))" }} />
        Daftar
      </Link>

      {/* Divider */}
      <div className="relative py-3 text-center">
        <span className="bg-white px-3 text-xs uppercase tracking-widest text-slate-400">atau</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-slate-200" />
      </div>

      {/* Google */}
      <div className="mb-2 flex justify-center">
        <button type="button" className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/40">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Daftar dengan Google
        </button>
      </div>

      {/* Login Link */}
      <p className="pt-2 text-center text-sm text-slate-600">
        Sudah punya akun?
        <Link to="/" className="ml-1 font-semibold" style={{ color: "var(--blue-700)" }}>Masuk di sini</Link>
      </p>
    </>
  );
}

/* ---------------------------- LAYOUT A (Split) ---------------------------- */
function RegisterLayoutA({ showPassword, setShowPassword }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT / BRAND PANEL */}
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex" style={{ background: "linear-gradient(135deg, var(--blue-700) 0%, var(--navy-800) 60%)" }}>
        <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(closest-side, var(--purple-200), transparent)" }} />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(closest-side, var(--blue-300), transparent)" }} />

        <div className="relative z-10 max-w-xl px-10 text-center text-white">
          <div className="mx-auto mb-8 inline-flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/20 backdrop-blur">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10h10M7 14h7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="text-lg font-semibold">Buat Akun Baru</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight">Mulai perjalanan bisnismu</h2>
          <p className="mt-4 text-white/80">Antarmuka modern, performa responsif, dan pengalaman onboarding yang halus.</p>
        </div>
      </div>

      {/* RIGHT / FORM PANEL */}
      <div className="relative flex items-center justify-center px-6 py-10 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, var(--purple-200), var(--blue-300))" }} />

        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold" style={{ color: "var(--blue-700)" }}>Pendaftaran</h3>
              <p className="text-xs text-slate-500">Isi data berikut untuk membuat akun baru.</p>
            </div>
            <img src="https://flagcdn.com/w40/id.png" alt="ID" className="h-8 w-12 rounded-md ring-1 ring-slate-200" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <SharedFields showPassword={showPassword} setShowPassword={setShowPassword} />
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
function RegisterLayoutB({ showPassword, setShowPassword }) {
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
          <div className="mb-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[color:var(--navy-800)] shadow-sm">Daftar Akun</div>
          <p className="max-w-xs text-xs text-slate-500">Semakin cepat daftar, semakin cepat produktif.</p>
        </div>

        {/* Card */}
        <div className="order-1 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur lg:order-2 lg:col-span-3">
          <SharedFields showPassword={showPassword} setShowPassword={setShowPassword} />
        </div>
      </div>
    </div>
  );
}

/* --------------------- LAYOUT C (Reversed Split / Hero) --------------------- */
function RegisterLayoutC({ showPassword, setShowPassword }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT / FORM PANEL (reversed) */}
      <div className="relative order-2 flex items-center justify-center px-6 py-10 lg:order-1 lg:px-16">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-6 flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold" style={{ color: "var(--navy-800)" }}>Pendaftaran</h3>
              <p className="text-xs text-slate-500">Daftarkan dirimu, kami urus sisanya.</p>
            </div>
            <div className="ml-auto">
              <img src="https://flagcdn.com/w40/id.png" alt="ID" className="h-8 w-12 rounded-md ring-1 ring-slate-200" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <SharedFields showPassword={showPassword} setShowPassword={setShowPassword} />
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
            <h3 className="text-2xl font-semibold">Onboarding Mulus</h3>
          </div>
          <p className="max-w-md text-white/85">Desain futuristik yang mencerminkan keandalan dan profesionalitas bisnis Anda.</p>
        </div>
      </div>
    </div>
  );
}
