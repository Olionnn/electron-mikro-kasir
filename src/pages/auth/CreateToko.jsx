import { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useNavbar } from "../../hooks/useNavbar";
import MapPinField from "../../component/MapsPin"; // pastikan path ini benar
import { useToko } from "../../hooks/useToko";
import { useUser } from "../../hooks/useUser";
import Alert from "../../component/Alert";
import { setFlash } from "../../utils/utils";
import { useNavigate } from "react-router-dom";



async function toImagePayload(file) {
  if (!file || !(file instanceof File)) return null;
  const dataUrl = await fileToBase64(file);
  // pisahkan header dataURL
  const [, base64] = (dataUrl || "").split(",");
  return {
    name: file.name,
    type: file.type,
    dataBase64: base64 || null,
  };
}

async function fileToBase64(file) {
  if (!file) return null;
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file); // menghasilkan "data:<mime>;base64,XXXXX"
  });
}


/** ----------------------- Ikon util kecil ----------------------- */
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    info: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.285 6.708l-11.4 11.4-5.657-5.657 1.414-1.414 4.243 4.243 9.986-9.986z" />
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  defaultValue = "",
  helper,
  error,
  rightAddon,
  className = "",
  ...rest
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-app">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          defaultValue={defaultValue}
          className="w-full bg-surface text-app border border-app rounded-lg px-3 py-2 focus:outline-none focus:ring-2
                     transition-shadow duration-150 ease-out
                     focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)]"
          style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.02)" }}
          {...rest}
        />
        {rightAddon && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--primary-700)]">
            {rightAddon}
          </span>
        )}
      </div>
      {helper && !error && <p className="text-xs text-[color:var(--muted)]">{helper}</p>}
      {error && <p className="text-xs text-[color:var(--danger)]">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, required = false, helper, error, children, className = "", ...rest }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-app">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      <select
        name={name}
        aria-invalid={!!error}
        className="w-full bg-surface text-app border border-app rounded-lg px-3 py-2 focus:outline-none 
                   focus:ring-2 focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)] 
                   transition-shadow duration-150 ease-out"
        {...rest}
      >
        {children}
      </select>
      {helper && !error && <p className="text-xs text-[color:var(--muted)]">{helper}</p>}
      {error && <p className="text-xs text-[color:var(--danger)]">{error}</p>}
    </div>
  );
}

function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`bg-surface border border-app rounded-2xl p-5 transition-all duration-200 hover:shadow-md ${className}`}
      style={{ boxShadow: "0 8px 30px rgba(0,0,0,.04)" }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-base font-semibold text-app">{title}</h2>}
          {subtitle && <p className="text-sm text-[color:var(--muted)]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function PrimaryButton({ children, className = "", ...rest }) {
  return (
    <button
      className={`w-full rounded-full font-semibold py-3 text-white transition-transform duration-150 
                  hover:-translate-y-[1px] active:translate-y-0 ${className}`}
      style={{ background: "linear-gradient(90deg, var(--primary-700), var(--primary-800))", boxShadow: "0 6px 20px rgba(59,56,160,0.25)" }}
      {...rest}
    >
      {children}
    </button>
  );
}

function Badge({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
      style={{ backgroundColor: "color-mix(in oklab, var(--primary-200) 35%, white)", color: "var(--primary-800)", border: "1px solid var(--border)" }}
    >
      <Icon name="spark" className="w-3.5 h-3.5" />
      {children}
    </span>
  );
}

/** Kecil untuk progress status */
function ProgressRow({ label, done = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-app">{label}</span>
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${
          done ? "bg-[color:var(--success)] border-transparent text-white" : "border-app text-[color:var(--muted)]"
        }`}
      >
        {done ? <Icon name="check" className="w-4 h-4" /> : "•"}
      </span>
    </div>
  );
}

/* --------------------- FIELDS yang selaras DB toko --------------------- */
/**
 * TokoFormFields
 * - Satu-satunya tempat render field sesuai kolom DB:
 *   nama_toko (required), nama_pemilik (required), jenis_toko_id, tampilan_id,
 *   alamat_toko (via MapPinField), no_telp, image (file), status (checkbox)
 * - State:
 *   form: { nama_toko, nama_pemilik, jenis_toko_id, tampilan_id, no_telp, image, status }
 *   lokasi: { address, lat, lng }  -> alamat_toko = lokasi.address
 */
function TokoFormFields({ form, setForm, lokasi, setLokasi, compact = false }) {
  // preview untuk image (jika perlu)
  const [preview, setPreview] = useState("");

  function handleFile(e) {
    const f = e.target.files?.[0];
    setForm((s) => ({ ...s, image: f || null }));
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview("");
    }
  }

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem("au") || "{}");
      if (local?.user) {
        setForm((s) => ({
          ...s,
          id: local.user.toko_id || "",
          nama_pemilik: local.user.nama || "",
          no_telp: local.user.no_telp || "",
        }));
      }
    } catch {
      // ignore parsing error
    }
  }, []);



 
  return (
    <div className={`grid ${compact ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
      {/* nama_toko */}
      <Field
        label="Nama Toko"
        name="nama_toko"
        required
        placeholder="Contoh: Kopi Kenangan Indah"
        value={form.nama_toko}
        onChange={(e) => setForm((s) => ({ ...s, nama_toko: e.target.value }))}
      />

      {/* nama_pemilik */}
      <Field
        label="Nama Pemilik"
        name="nama_pemilik"
        required
        placeholder="Nama lengkap pemilik"
        value={form.nama_pemilik}
        onChange={(e) => setForm((s) => ({ ...s, nama_pemilik: e.target.value }))}
      />

      {/* jenis_toko_id -> mapping contoh */}
      <SelectField
        label="Jenis Toko"
        name="jenis_toko_id"
        value={form.jenis_toko_id}
        onChange={(e) => setForm((s) => ({ ...s, jenis_toko_id: Number(e.target.value) }))}
      >
        <option value={0}>Pilih jenis...</option>
        <option value={1}>Retail</option>
        <option value={2}>Kuliner</option>
        <option value={3}>Fashion</option>
      </SelectField>

      {/* tampilan_id -> mapping contoh */}
      {/* <SelectField
        label="Tampilan UI"
        name="tampilan_id"
        value={form.tampilan_id}
        onChange={(e) => setForm((s) => ({ ...s, tampilan_id: Number(e.target.value) }))}
      >
        <option value={0}>Default</option>
        <option value={1}>Modern</option>
        <option value={2}>Compact</option>
      </SelectField> */}

      {/* no_telp */}
      <Field
        label="No. Telepon"
        name="no_telp"
        placeholder="08xxxxxxxxxx"
        value={form.no_telp}
        onChange={(e) => setForm((s) => ({ ...s, no_telp: e.target.value }))}
      />

      {/* image */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-app">Logo/Gambar Toko</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full bg-surface text-app border border-app rounded-lg px-3 py-2 focus:outline-none focus:ring-2
                     focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)]"
        />
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="preview toko" className="h-24 w-24 object-cover rounded-lg border border-app" />
          </div>
        )}
      </div>

      {/* alamat_toko via MapPinField */}
      <div className={`${compact ? "md:col-span-3" : "md:col-span-2"}`}>
        <MapPinField
          value={lokasi}
          onChange={setLokasi}
          label="Alamat Toko"
        />
        {!lokasi.address && (
          <p className="mt-2 text-xs text-[color:var(--danger)]">
            Pin lokasi toko belum diatur — klik ikon 📍 untuk memilih.
          </p>
        )}
      </div>

      {/* status */}
      {/* <div className="flex items-center gap-2">
        <input
          id="status_toko"
          type="checkbox"
          checked={form.status}
          onChange={(e) => setForm((s) => ({ ...s, status: e.target.checked }))}
        />
        <label htmlFor="status_toko" className="text-sm text-app">Aktif</label>
      </div> */}
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function DataTokoForm({ variant = "card" }) {
  const {
    update: updateToko,
  } = useToko();

  const { 
    update: updateUser,
    getById: getUserById
   } = useUser();
  const { token } = useTheme();
  const [localError, setLocalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  useNavbar({ title: "Data Toko / Usaha", variant: "page", uiPreset: "solid", actions: [] }, []);
  const navigate = useNavigate();

  // State form selaras DB
  const [form, setForm] = useState({
    id: 0,
    nama_toko: "",
    nama_pemilik: "",
    tampilan_id: 0,
    jenis_toko_id: 0,
    no_telp: "",
    image: null, // File
    status: 1,
  });

  // Alamat via MapPinField
  const [lokasi, setLokasi] = useState({
    address: "",           // => akan dipetakan ke alamat_toko
    lat: -6.200000,        // simpan untuk keperluan lain (belum ada kolom di DB)
    lng: 106.816666,
  });

  const accent = useMemo(() => token("--primary-700") || "#3B38A0", [token]);

  /** Submit → payload 100% sama dengan kolom DB */
  async function handleSubmit(e) {
  e.preventDefault();

  
  const au = JSON.parse(localStorage.getItem("au") || "{}");

  // siapkan payload toko
  const imagePayload = await toImagePayload(form.image); // form.image adalah File
  const payloadToko = {
    nama_toko: form.nama_toko,
    nama_pemilik: form.nama_pemilik,
    tampilan_id: Number(form.tampilan_id) || 0,
    jenis_toko_id: Number(form.jenis_toko_id) || 0,
    alamat_toko: lokasi.address || "",
    no_telp: form.no_telp || null,
    image: imagePayload, // <-- kirim format yang diharapkan IPC
    status: !!form.status,
  };

  try {
    const resToko = await updateToko(form.id, payloadToko);
    const updatedToko =
      resToko?.data?.data || 
      resToko?.data ||      
      resToko || null;       

    await updateUser(au?.user?.id, { status: true });

    const freshUser = await getUserById(au?.user?.id);

    const nextAu = {
      ...au,
      user: freshUser ? {
        ...au?.user,
        ...freshUser,
      } : au?.user,
      toko: updatedToko ? {
        ...au?.toko,
        ...updatedToko,
      } : au?.toko,
    };
    localStorage.setItem("au", JSON.stringify(nextAu));

    setSuccessMsg("Toko berhasil dibuat!");
    setFlash("Toko berhasil dibuat!", "success");

    setForm({
      id: 0,
      nama_toko: "",
      nama_pemilik: "",
      tampilan_id: 0,
      jenis_toko_id: 0,
      no_telp: "",
      image: null,
      status: true,
    });
    setLokasi({
      address: "",
      lat: -6.200000,
      lng: 106.816666,
    });

    if (navigate) {
      navigate("/ujicoba");
    } else if (window?.location) {
      window.location.href = "/ujicoba";
    }
  } catch (error) {
    setFlash(error?.message || "Gagal membuat toko. Silakan coba lagi.", "error");
    setLocalError(error?.message || "Gagal membuat toko. Silakan coba lagi.");
  }
}

  // ---------- RENDER VARIAN ----------
  const render = {
    card: (
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="rounded-2xl p-6 brand-gradient text-white flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Data Toko</h1>
            <p className="text-sm opacity-90">Lengkapi data agar toko siap dipublikasikan dan digunakan.</p>
          </div>
          <Badge>Profil Bisnis</Badge>
        </div>

        <SectionCard title="Informasi Toko" subtitle="Semua field di bawah mengikuti kolom database">
          {/* garis aksen halus */}
          <span aria-hidden className="block h-0.5 w-24 rounded-full mb-4" style={{ backgroundColor: accent }} />
          <TokoFormFields form={form} setForm={setForm} lokasi={lokasi} setLokasi={setLokasi} />
        </SectionCard>

        <PrimaryButton type="submit">SIMPAN</PrimaryButton>
      </form>
    ),

    split: (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Panel kiri info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-6 brand-gradient text-white">
            <h2 className="text-xl font-semibold">Bangun Kepercayaan</h2>
            <p className="text-sm opacity-90 mt-2">Alamat jelas & logo rapi bikin pelanggan makin yakin.</p>
            <ul className="text-sm mt-4 space-y-2 opacity-95 list-disc list-inside">
              <li>Gunakan nama toko konsisten di semua platform.</li>
              <li>Tambahkan pin lokasi agar mudah ditemukan.</li>
              <li>Pastikan nomor telepon bisa dihubungi.</li>
            </ul>
          </div>

          <SectionCard title="Status Kelengkapan">
            <div className="space-y-3">
              <ProgressRow label="Nama Toko & Pemilik" done={!!(form.nama_toko && form.nama_pemilik)} />
              <ProgressRow label="Alamat & Lokasi" done={!!lokasi.address} />
              <ProgressRow label="Kontak & Logo" done={!!(form.no_telp || form.image)} />
            </div>
          </SectionCard>
        </div>

        {/* Panel kanan form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SectionCard title="Form Toko" subtitle="Selaras dengan kolom tabel `toko`">
              <TokoFormFields form={form} setForm={setForm} lokasi={lokasi} setLokasi={setLokasi} />
            </SectionCard>
            <PrimaryButton type="submit">SIMPAN</PrimaryButton>
          </form>
        </div>
      </div>
    ),

    compact: (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: "color-mix(in oklab, var(--primary-200) 20%, var(--surface))", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Icon name="info" />
            <span className="text-sm text-app">Mode ringkas — tetap lengkap & cepat diisi</span>
          </div>
          <Badge>Compact</Badge>
        </div>

        <SectionCard title="Data Toko">
          <TokoFormFields form={form} setForm={setForm} lokasi={lokasi} setLokasi={setLokasi} compact />
        </SectionCard>

        <PrimaryButton type="submit">SIMPAN</PrimaryButton>
      </form>
    ),
  }[variant];

  return (
    <div className="bg-app h-full">
      {localError && (
        <Alert type="error" onClose={() => setLocalError(null)}>
          {localError}
        </Alert>
      )}
      {successMsg && (
        <Alert type="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}
      <div className="max-w-5xl mx-auto px-4 py-8">{render}</div>
    </div>
  );
}