import jwt from "jsonwebtoken";

const JWT_SECRET = "adawdasdinaowidnaoisnion2-1w0eoqw0oeq0wdkq-w0dkq-w0kdq-0wdkq-w0kdq-w0dkq-w0dkq-w0kdq0-wdkq-0wkdq-w0dq-0wk0-qw";
const ACCESS_TTL = "2h"; // contoh: 2h / 30m

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
}
export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}