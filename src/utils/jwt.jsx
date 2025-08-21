export const AU_LS_KEY = "au"; // konsisten dgn useAuth kamu

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(AU_LS_KEY) || "null"); }
  catch { return null; }
}

export function setAuth(data) {
  if (!data) return localStorage.removeItem(AU_LS_KEY);
  localStorage.setItem(AU_LS_KEY, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(AU_LS_KEY);
}

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

export function isTokenExpired(token) {
  const p = parseJwt(token);
  if (!p?.exp) return true; // if no exp, consider expired for security
  const now = Math.floor(Date.now() / 1000);
  return p.exp <= now;
}

export function isAuthenticated() {
  const au = getAuth();
  const token = au?.accesstoken; // matches your localStorage structure
  if (!token) return false;
  return !isTokenExpired(token);
}

export function getAccessToken() {
  const au = getAuth();
  return au?.accesstoken || null; // matches your localStorage structure
}