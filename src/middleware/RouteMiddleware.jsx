// src/auth/RouteMiddleware.jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { useAuthController } from "../hooks/useAuth";
import { isTokenExpired } from "../utils/jwt";

/**
 * RequireAuth
 * - Render child apabila token valid & user.status truthy
 * - Redirect via useEffect (bukan <Navigate/>) + anti double-redirect
 */
export function RequireAuth({ redirect = "/" }) {
  const { ready, auth } = useAuthController();
  const navigate = useNavigate();
  const loc = useLocation();
  const hasRedirectedRef = useRef(false);

  const token = auth?.accesstoken ?? null;
  const userStatus = auth?.user?.status ?? null;
  const tokenExpired = useMemo(() => (token ? isTokenExpired(token) : true), [token]);

  const isAtCreateToko = loc.pathname === "/create-toko";
  const isAtRedirect = loc.pathname === redirect;

  useEffect(() => {
    if (!ready || hasRedirectedRef.current) return;

    // 1) Token tidak ada / expired -> keluar ke redirect (login/home)
    if (!token || tokenExpired) {
      if (!isAtRedirect) {
        hasRedirectedRef.current = true;
        navigate(redirect, { replace: true, state: { from: loc } });
      }
      return;
    }

    // 2) Belum punya profil toko -> arahkan ke /create-toko (kecuali sudah di sana)
    if (!userStatus && !isAtCreateToko) {
      hasRedirectedRef.current = true;
      navigate("/create-toko", { replace: true, state: { from: loc } });
    }
  }, [ready, token, tokenExpired, userStatus, isAtCreateToko, isAtRedirect, navigate, loc, redirect]);

  // ---- RENDER (jangan blokir /create-toko saat userStatus falsy) ----
  if (!ready) return null;                 // tunggu auth siap
  if (!token || tokenExpired) return null; // sedang diarahkan ke login/home
  if (!userStatus && !isAtCreateToko) return null; // sedang diarahkan ke /create-toko

  return <Outlet />; // token valid; jika userStatus falsy, hanya /create-toko yang lolos
}

/**
 * PublicOnly
 * - Untuk halaman login/register.
 * - Jika sudah punya token valid, alihkan ke /pos (default).
 * - Tidak ada hook yang dipanggil secara kondisional.
 */
export function PublicOnly({ redirect = "/pos" }) {
  // --- SELALU panggil hook di atas ---
  const { ready, auth } = useAuthController();
  const navigate = useNavigate();
  const loc = useLocation();
  const hasRedirectedRef = useRef(false);

  const token = auth?.accesstoken ?? null;
  const tokenValid = useMemo(() => !!token && !isTokenExpired(token), [token]);
  const isAtRedirect = loc.pathname === redirect;

  useEffect(() => {
    if (!ready || hasRedirectedRef.current) return;
    if (tokenValid && !isAtRedirect) {
      hasRedirectedRef.current = true;
      navigate(redirect, { replace: true });
    }
  }, [ready, tokenValid, isAtRedirect, navigate, redirect]);

  // --- RETURN setalah SEMUA hook dipanggil ---
  if (!ready) return null;
  if (tokenValid) return null; // sedang diarahkan
  return <Outlet />;
}