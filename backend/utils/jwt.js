// backend/utils/jwt.js
import jwt from "jsonwebtoken";

// Always resolve a single primary secret, with optional fallbacks (for rotation)
const PRIMARY_SECRET =
  process.env.JWT_SECRET ||
  process.env.APP_JWT_SECRET ||      // optional alias
  "asdasdsadaskdmaosidmaowidoaiwdaw-awdoawndiawnodanwiods";                       // safe default for dev

const FALLBACK_SECRETS = [
  process.env.JWT_SECRET_OLD,        // rotate: put previous secret here if needed
  process.env.APP_JWT_SECRET_OLD,
].filter(Boolean);

/** Sign access token */
export function signAccessToken(payload, opts = {}) {
  // keep algo consistent
  return jwt.sign(payload, PRIMARY_SECRET, {
    algorithm: "HS256",
    expiresIn: opts.expiresIn || "2h",
  });
}

/** Verify access token (try primary, then fallbacks) */
export function verifyAccessToken(token) {
  const candidates = [PRIMARY_SECRET, ...FALLBACK_SECRETS];
  let lastErr;
  for (const secret of candidates) {
    try {
      return jwt.verify(String(token).trim(), secret, { algorithms: ["HS256"] });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr; // preserves JsonWebTokenError: invalid signature
}