import React, {useState, useEffect} from "react";

export default function cx(...a) {
   return a.filter(Boolean).join(" ");
} 

export function normalizeRow(r) {
  return r && typeof r === 'object' && r.dataValues ? r.dataValues : r;
}


export function useDebouncedValue(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}


export function Highlight({ text = "", query = "" }) {
  if (!query) return text;
  const q = query.trim();
  return text
    .split(new RegExp(`(${q})`, "gi"))
    .map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-yellow-100 rounded px-0.5">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
}


export function fmtDate(v) {
  if (!v) return "-";
  try {
    const d = new Date(v);
    return `${d.toLocaleDateString("id-ID")} ${d.toLocaleTimeString("id-ID")}`;
  } catch {
    return String(v);
  }
}
