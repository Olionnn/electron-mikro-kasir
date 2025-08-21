import React from "react";
import MapPickerModal from "./MapsPicker";

/**
 * ------------------------------------------------------------
 * MapPinField
 * - Field alamat + tombol 📍 untuk membuka MapPickerModal.
 * - Mengelola state modal dan melempar nilai lat/lng/address ke parent.
 * ------------------------------------------------------------
 */
export default function MapPinField({
  value,             // { address, lat, lng }
  onChange,          // (next) => void
  label = "Alamat",
  placeholder = "Nama jalan, nomor, RT/RW",
  required = false,
  error,
}) {
  const [open, setOpen] = React.useState(false);

  function handlePick(next) {
    // merge alamat/lat/lng ke parent
    onChange?.(next);
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-app">
        {label} {required && <span className="text-[color:var(--danger)]">*</span>}
      </label>
      <div className="relative">
        <input
          readOnly
          value={value?.address ?? ""}
          placeholder={placeholder}
          className="w-full bg-surface text-app border border-app rounded-lg px-3 py-2 pr-10
                     focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)]"
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--primary-700)]"
          title="Set lokasi di peta"
        >
          📍
        </button>
      </div>
      {error && <p className="text-xs text-[color:var(--danger)]">{error}</p>}
      <p className="text-xs text-[color:var(--muted)]">
        Klik ikon 📍 untuk memilih lokasi di peta.
      </p>

      {/* Modal */}
      <MapPickerModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        onChange={handlePick}
      />
    </div>
  );
}