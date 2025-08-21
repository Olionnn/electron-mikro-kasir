// src/auth/RouteGuards.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthController } from "../hooks/useAuth";
import { isTokenExpired } from "../utils/jwt";

export function RequireAuth({ redirect = "/" }) {
  const { ready, auth } = useAuthController();
  const loc = useLocation();

  if (!ready) return null; 
  const token = auth?.accesstoken;
  if (!token || isTokenExpired(token)) {
    return <Navigate to={redirect} replace state={{ from: loc }} />;
  }
  return <Outlet />;
}

export function PublicOnly({ redirect = "/dashboard" }) {
  const { ready, auth } = useAuthController();
  if (!ready) return null;
  const token = auth?.accesstoken;
  if (token && !isTokenExpired(token)) {
    return <Navigate to={redirect} replace />;
  }
  return <Outlet />;
}