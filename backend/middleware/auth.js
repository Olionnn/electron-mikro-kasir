// backend/middleware/auth.js
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(fn) {
  return async (event, args = {}) => {
    try {
      const token = (args?.token || "").replace(/^Bearer\s+/i, "").trim();
      if (!token) throw new Error("Token tidak ditemukan");
      const decoded = verifyAccessToken(token);
      return await fn(event, { ...args, auth: decoded });
    } catch (e) {
      console.error("Authentication error:", e);
      return { success: false, error: e.message || "Unauthorized", code: 401 };
    }
  };
}