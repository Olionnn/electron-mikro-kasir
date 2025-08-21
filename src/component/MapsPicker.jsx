import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../hooks/useTheme";

/**
 * ------------------------------------------------------------
 * MapPickerModal
 * - Modal peta untuk memilih lokasi (lat,lng) + alamat.
 * - Fitur:
 *   • Drag marker / klik peta untuk set lokasi
 *   • Search alamat (Nominatim) dengan debounce
 *   • Reverse geocoding saat marker pindah
 * - Integrasi tema: warna tombol/outline dari CSS variables.
 * ------------------------------------------------------------
 */

/* Fix default icon path (Vite/Webpack/Electron) */
const DefaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/** util debounce sederhana */
function useDebouncedValue(value, delay = 400) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

/** Komponen internal untuk handle click/drag di peta */
function MarkerController({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const m = e.target;
          const p = m.getLatLng();
          onChange({ lat: p.lat, lng: p.lng });
        },
      }}
    >
      <Popup>Geser atau klik peta untuk memindahkan pin.</Popup>
    </Marker>
  );
}

export default function MapPickerModal({
  open,
  onClose,
  value, // { lat, lng, address }
  onChange, // (next) => void
}) {
  const { token } = useTheme();

  const [center, setCenter] = useState({
    lat: value?.lat ?? -6.200000, // Jakarta
    lng: value?.lng ?? 106.816666,
  });
  const [marker, setMarker] = useState({
    lat: value?.lat ?? -6.200000,
    lng: value?.lng ?? 106.816666,
  });
  const [address, setAddress] = useState(value?.address ?? "");
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 500);
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingReverse, setLoadingReverse] = useState(false);
  const mounted = useRef(false);

  // warna dari token theme
  const primary700 = useMemo(() => token("--primary-700") || "#3B38A0", [token]);

  /** Fetch search (Nominatim) */
  useEffect(() => {
    if (!debouncedQ) {
      setResults([]);
      return;
    }
    let stop = false;
    (async () => {
      try {
        setLoadingSearch(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedQ
        )}&addressdetails=1&limit=5`;
        const res = await fetch(url, { headers: { "Accept-Language": "id" } });
        const json = await res.json();
        if (!stop) setResults(json || []);
      } catch (e) {
        console.error("[MapPicker] search error", e);
      } finally {
        if (!stop) setLoadingSearch(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [debouncedQ]);

  /** Reverse geocoding saat marker berubah */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    let stop = false;
    (async () => {
      try {
        setLoadingReverse(true);
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${marker.lat}&lon=${marker.lng}&addressdetails=1`;
        const res = await fetch(url, { headers: { "Accept-Language": "id" } });
        const json = await res.json();
        if (!stop) {
          const display = json?.display_name || "";
          setAddress(display);
        }
      } catch (e) {
        console.error("[MapPicker] reverse error", e);
      } finally {
        if (!stop) setLoadingReverse(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [marker.lat, marker.lng]);

  /** Handle pilih hasil pencarian -> pindah center & marker */
  function handlePickSearch(item) {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setCenter({ lat, lng });
    setMarker({ lat, lng });
    setAddress(item.display_name || "");
    setResults([]);
    setQ(item.display_name || "");
  }

  /** Simpan ke parent */
  function handleSave() {
    onChange?.({ lat: marker.lat, lng: marker.lng, address });
    onClose?.();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        backgroundColor: "color-mix(in oklab, black 50%, transparent)",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface border border-app rounded-2xl w-[95vw] max-w-3xl overflow-hidden shadow-xl"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,.45)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3"
             style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 className="text-app font-semibold">Pilih Lokasi Toko</h3>
            <p className="text-xs text-[color:var(--muted)]">
              Geser pin atau cari alamat. Data akan disimpan ke formulir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          >
            Tutup
          </button>
        </div>

        {/* Search */}
        <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari alamat, gedung, area..."
              className="w-full bg-surface text-app border border-app rounded-lg px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)]"
            />
            <span className="absolute right-3 top-2 text-xs text-[color:var(--muted)]">
              {loadingSearch ? "mencari..." : results.length ? `${results.length} hasil` : ""}
            </span>
          </div>

          {/* Dropdown hasil */}
          {!!results.length && (
            <div
              className="mt-2 max-h-48 overflow-auto rounded-lg text-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              {results.map((r) => (
                <button
                  key={`${r.lat}-${r.lon}-${r.place_id}`}
                  onClick={() => handlePickSearch(r)}
                  className="block w-full text-left px-3 py-2 hover:bg-[color:var(--bg)]"
                >
                  {r.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="h-[55vh]">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerController
              position={[marker.lat, marker.lng]}
              onChange={(p) => {
                setMarker(p);
              }}
            />
          </MapContainer>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-5 py-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="text-xs text-[color:var(--muted)]">
            {loadingReverse ? "Mengambil alamat..." : address || "Alamat belum tersedia"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full text-white"
              style={{
                background: `linear-gradient(90deg, var(--primary-700), var(--primary-800))`,
                boxShadow: "0 6px 20px rgba(59,56,160,.25)",
              }}
            >
              Gunakan Lokasi Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}