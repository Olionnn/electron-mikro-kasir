import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(fn) {
  return async (event, args = {}) => {
    try {
      const token = args?.token;
      if (!token) throw new Error("Token tidak ditemukan");
      const decoded = verifyAccessToken(token);
      // inject user ke args
      return await fn(event, { ...args, auth: decoded });
    } catch (e) {
      return { success: false, error: e.message || "Unauthorized", code: 401 };
    }
  };
}