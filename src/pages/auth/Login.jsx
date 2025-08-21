// pages/auth/Login.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo/logo.png";
import { useAuth, useAuthController } from "../../hooks/useAuth";
import Alert from "../../component/Alert";        // ⬅️ pastikan path
import { getFlash, clearFlash } from "../../utils/utils";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function Login() {
  const { login, loading, error } = useAuth();
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [flash, setFlash] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginOk } = useAuthController();

  useEffect(() => { document.title = "Masuk | Aplikasi"; }, []);

  // tampilkan flash dari Register (jika ada)
  useEffect(() => {
    const f = getFlash();
    if (f) {
      setFlash(f);
      const t = setTimeout(() => { setFlash(null); clearFlash(); }, 4000);
      return () => clearTimeout(t);
    }
  }, []);

  // sinkron error dari hook ke alert lokal
  useEffect(() => { if (error) setLocalError(error); }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.email || !form.password) {
      setLocalError("Email dan password wajib diisi.");
      return;
    }

    try {
      const data = await login({ email: form.email.trim(), password: form.password });
      loginOk(data);
      const to = (history.state && history.state.usr && history.state.usr.from?.pathname) || "/pos";
      nav(to, { replace: true });
      nav.bind("/pos");
    } catch (err) {
      setLocalError(err?.message || "Gagal login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <style>{`
        :root {
          --purple-200: #B2B0E8;
          --blue-300: #7A85C1;
          --blue-700: #3B38A0;
          --navy-800: #1A2A80;
        }
      `}</style>

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT / BRAND PANEL */}
        <div
          className="relative hidden items-center justify-center overflow-hidden lg:flex"
          style={{ background: "linear-gradient(135deg, var(--blue-700) 0%, var(--navy-800) 60%)" }}
        >
          <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(closest-side, var(--purple-200), transparent)" }} />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(closest-side, var(--blue-300), transparent)" }} />
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
          <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, var(--purple-200), var(--blue-300))" }} />

          <div className="mx-auto w-full max-w-xl">
            {/* Alert (flash dan error lokal) */}
            <div className="space-y-3">
              {flash?.message && (
                <Alert type={flash.type} onClose={() => { setFlash(null); clearFlash(); }}>
                  {flash.message}
                </Alert>
              )}
              {localError && (
                <Alert type="error" onClose={() => setLocalError(null)}>
                  {localError}
                </Alert>
              )}
            </div>

            <div className="mb-6 mt-4 flex items-center justify-between">
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

            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
              {/* Subheader */}
              <p className="mb-6 text-sm text-slate-600">
                Kamu dapat masuk sebagai <strong>Owner</strong> ataupun <strong>Staff</strong>
              </p>

              {/* Email */}
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <div className="relative mb-4">
                <input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-base outline-none transition focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
                <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-40 peer-focus:opacity-70" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 7.5L10.8 13.2C11.523 13.682 12.477 13.682 13.2 13.2L22 7.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>

              {/* Password */}
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium" style={{ color: "var(--blue-700)" }}>
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
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--purple-200)]/60"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? 
                   <IoMdEyeOff /> : 
                   <IoMdEye />
                   }
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mb-2 inline-flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-4 text-base font-semibold text-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
              >
                <span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(90deg, var(--purple-200), var(--blue-300))" }} />
                {loading ? "Memproses..." : "Masuk"}
              </button>

              <div className="relative py-3 text-center">
                <span className="bg-white px-3 text-xs uppercase tracking-widest text-slate-400">
                  atau
                </span>
                <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-slate-200" />
              </div>
              {/* Google */}
              <div className="flex justify-center">
                <button type="button" className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--purple-200)]/40">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                  Masuk dengan Google
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>© {new Date().getFullYear()} Perusahaan Anda</span>
              <div className="flex items-center gap-3">
                <Link to="#" className="hover:text-slate-600">Privasi</Link>
                <span aria-hidden>•</span>
                <Link to="#" className="hover:text-slate-600">Syarat</Link>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-slate-600">
              Belum punya akun?
              <Link to="/register" className="ml-1 font-semibold" style={{ color: "var(--blue-700)" }}>
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
