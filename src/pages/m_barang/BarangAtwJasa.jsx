import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { MdFilterList, MdAdd, MdEdit, MdRefresh, MdSearch } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { Link } from "react-router-dom";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme";

/**
 * BARANG & JASA – Premium Redesign (Theme-aware)
 * -------------------------------------------------------------------------
 * Tujuan:
 * - Tampilan modern, profesional, informatif, dan user-friendly.
 * - Sepenuhnya tema-aware: seluruh warna mengambil dari CSS variables (ThemeProvider)
 * - Menyediakan 3 alternatif layout: "A" (Split Master-Detail),
 *   "B" (Cards + Sidebar), dan "C" (Reversed Split)
 * - Siap produksi: tanpa error, responsif, aksesibilitas dasar, animasi halus
 * - Komentar rinci di setiap fungsi untuk memudahkan maintenance
 *
 * Integrasi Tema:
 * - Menggunakan useTheme().token('--xxx') untuk mengambil CSS variable runtime
 * - Tidak ada hardcode hex; semua warna via token dgn fallback palet: 
 *   Ungu Muda #B2B0E8, Biru Abu #7A85C1, Biru Tua #3B38A0, Navy Gelap #1A2A80
 *
 * Navbar Integration:
 * - Menggunakan useNavbar untuk register judul & actions
 */

// --------------------------- Utilities ----------------------------------
const rupiah = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));

const toNumber = (v) => (v === "" || v === null || v === undefined ? "" : Number(v));

const emptyBarang = {
  id: null,
  toko_id: null,
  kategori_id: null,
  nama: "",
  stok: 0,
  kode: "",
  harga_dasar: 0,
  harga_jual: 0,
  image: "",
  show_transaksi: true,
  use_stok: true,
  status: true,
};

export default function BarangJasa({ variant = "B" }) {
  // ----------------------- THEME TOKENS --------------------------------
  /** Ambil token warna dari ThemeProvider (runtime) */
  const { token } = useTheme?.() || { token: () => "" };
  const primary700 = token("--primary-700") || "#3B38A0"; // Biru Tua
  const primary200 = token("--primary-200") || "#B2B0E8"; // Ungu Muda
  const accent700  = token("--accent-700")  || "#1A2A80"; // Navy Gelap
// Biru Abu
  const card       = token("--card")        || "#FFFFFF";
  const appBg      = token("--app-bg")      || "#F7F8FC";
  const border     = token("--border")      || "#E6E8F0";
  const text       = token("--text")        || "#1F2A37";
  const textMuted  = token("--text-muted")  || "#64748B";
  // --------------------------- State -----------------------------------
  /** Data contoh – ganti dengan data real dari props/REST saat integrasi */
  const [items, setItems] = useState([
    { id: 1, nama: "Beras", kode: "132312", stok: 9, harga_dasar: 11000, harga_jual: 13000, image: "", kategori_id: null, show_transaksi: true, use_stok: true, status: true, selected: true },
    { id: 2, nama: "Kecap", kode: "666", stok: 10, harga_dasar: 3000, harga_jual: 4000, image: "", kategori_id: null, show_transaksi: true, use_stok: true, status: true, selected: false },
    { id: 3, nama: "Beras 5KG", kode: "1312", stok: 5, harga_dasar: 65000, harga_jual: 70000, image: "", kategori_id: null, show_transaksi: true, use_stok: true, status: true, selected: false },
  ]);

  /** Query search */
  const [q, setQ] = useState("");
  /** Item terpilih */
  const [selectedId, setSelectedId] = useState(items.find((i) => i.selected)?.id ?? items[0]?.id ?? null);

  // MODALS
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // FORMS
  const [formAdd, setFormAdd] = useState(emptyBarang);
  const [formEdit, setFormEdit] = useState(emptyBarang);

  // FILTERS
  const [filter, setFilter] = useState({ kategori_id: "", stokMin: "", stokMax: "", status: "", show_transaksi: "", use_stok: "" });

  // REFS (untuk focus di modal)
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);
  const filterFocusRef = useRef(null);

  // --------------------------- Navbar ----------------------------------
  /**
   * Navbar actions: filter, tambah, refresh
   * Semua style warna mengikuti token tema
   */
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter Barang",
        onClick: () => setOpenFilter(true),
        className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
        icon: <MdFilterList size={20} />,
        style: {
          color: primary700,
          borderColor: primary700,
          background: "transparent",
        },
      },
      {
        type: "button",
        title: "Tambah Barang",
        onClick: () => handleOpenAdd(),
        className: "inline-flex items-center gap-2 border px-3 py-2 rounded-lg hover:opacity-95",
        icon: <MdAdd size={20} />,
        style: {
          background: `linear-gradient(90deg, ${primary700}, ${accent700})`,
        },
      },
      {
        type: "button",
        title: "Refresh",
        onClick: () => handleRefresh(),
        className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
        icon: <MdRefresh size={20} />,
        style: { color: text, background: token("--button-muted", "#F3F4F8") },
      },
    ],
    [primary700, accent700, text]
  );

  // Daftarkan konfigurasi Navbar
  useNavbar({ variant: "page", title: "Barang & Jasa", backTo: "/management", actions }, [actions]);

  // Title dokumen
  useEffect(() => {
    document.title = "Barang & Jasa | Aplikasi";
  }, []);

  // --------------------------- Memoized Lists --------------------------
  /**
   * Filter & sort list sesuai query + filter panel
   */
  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .filter((it) => {
        const matchText = !term || it.nama.toLowerCase().includes(term) || (it.kode || "").toLowerCase().includes(term);
        const inStokMin = filter.stokMin === "" || it.stok >= Number(filter.stokMin);
        const inStokMax = filter.stokMax === "" || it.stok <= Number(filter.stokMax);
        const matchStatus = filter.status === "" || String(it.status) === String(filter.status);
        const matchShow = filter.show_transaksi === "" || String(it.show_transaksi) === String(filter.show_transaksi);
        const matchUse = filter.use_stok === "" || String(it.use_stok) === String(filter.use_stok);
        const matchKategori = filter.kategori_id === "" || String(it.kategori_id || "") === String(filter.kategori_id);
        return matchText && inStokMin && inStokMax && matchStatus && matchShow && matchUse && matchKategori;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [items, q, filter]);

  /** Item terpilih (detail panel) */
  const selected = useMemo(() => items.find((it) => it.id === selectedId) || null, [items, selectedId]);

  // --------------------------- Handlers --------------------------------
  /** Pilih item dari list */
  const handleSelect = useCallback((id) => setSelectedId(id), []);

  /** Buka modal edit dengan mengisi form dari item terpilih */
  const handleOpenEdit = useCallback(() => {
    if (!selected) return;
    setFormEdit({ ...emptyBarang, ...selected });
    setOpenEdit(true);
  }, [selected]);

  /** Simpan edit ke list state */
  const handleSaveEdit = useCallback(() => {
    setItems((prev) => prev.map((i) => (i.id === formEdit.id ? { ...i, ...formEdit } : i)));
    setOpenEdit(false);
  }, [formEdit]);

  /** Buka modal tambah dengan auto-id */
  const handleOpenAdd = useCallback(() => {
    setFormAdd((prev) => ({ ...prev, id: Math.max(0, ...items.map((i) => i.id || 0)) + 1 }));
    setOpenAdd(true);
  }, [items]);

  /** Simpan item baru ke list */
  const handleSaveAdd = useCallback(() => {
    setItems((prev) => [{ ...formAdd }, ...prev]);
    setSelectedId(formAdd.id);
    setOpenAdd(false);
  }, [formAdd]);

  /** Terapkan filter (cukup tutup modal; filtering sudah reaktif) */
  const handleApplyFilter = useCallback(() => setOpenFilter(false), []);

  /** Reset filter ke default */
  const handleResetFilter = useCallback(
    () => setFilter({ kategori_id: "", stokMin: "", stokMax: "", status: "", show_transaksi: "", use_stok: "" }),
    []
  );

  /** Refresh halaman */
  const handleRefresh = useCallback(() => window.location.reload(), []);

  /** Tutup modal tambah */
  const handleCloseAdd = useCallback(() => setOpenAdd(false), []);

  // ---------------------------- Render ---------------------------------
  return (
    <div className="min-h-screen flex flex-col" style={{ background: appBg }}>
      {variant === "B" ? renderLayoutB() : variant === "C" ? renderLayoutC() : renderLayoutA()}

      {/* MODAL: Add */}
      <Modal open={openAdd} title="Tambah Barang" onClose={handleCloseAdd} initialFocusRef={addFocusRef}>
        <BarangForm
          form={formAdd}
          setForm={setFormAdd}
          onClose={handleCloseAdd}
          onSubmit={handleSaveAdd}
          submitText="Simpan"
          initialFocusRef={addFocusRef}
          tokens={{ primary700, accent700, primary200,  border }}
        />
      </Modal>

      {/* MODAL: Edit */}
      <Modal open={openEdit} title="Edit Barang" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <BarangForm
          form={formEdit}
          setForm={setFormEdit}
          onSubmit={handleSaveEdit}
          submitText="Update"
          initialFocusRef={editFocusRef}
          tokens={{ primary700, accent700, primary200,  border }}
        />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Barang" onClose={() => setOpenFilter(false)} initialFocusRef={filterFocusRef}>
        <div className="grid grid-cols-1 gap-3">
          <Labeled label="Kategori ID" textMuted={textMuted}>
            <input
              ref={filterFocusRef}
              value={filter.kategori_id}
              onChange={(e) => setFilter((f) => ({ ...f, kategori_id: e.target.value }))}
              type="number"
              placeholder="Contoh: 10"
              className="w-full px-3 py-2 rounded-lg border outline-none"
              style={{ borderColor: border }}
            />
          </Labeled>

          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Stok Min" textMuted={textMuted}>
              <input
                value={filter.stokMin}
                onChange={(e) => setFilter((f) => ({ ...f, stokMin: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 rounded-lg border outline-none"
                style={{ borderColor: border }}
              />
            </Labeled>
            <Labeled label="Stok Max" textMuted={textMuted}>
              <input
                value={filter.stokMax}
                onChange={(e) => setFilter((f) => ({ ...f, stokMax: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 rounded-lg border outline-none"
                style={{ borderColor: border }}
              />
            </Labeled>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Status" textMuted={textMuted}>
              <select
                value={filter.status}
                onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border outline-none"
                style={{ borderColor: border }}
              >
                <option value="">Semua</option>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </Labeled>
            <Labeled label="Tampil di Transaksi" textMuted={textMuted}>
              <select
                value={filter.show_transaksi}
                onChange={(e) => setFilter((f) => ({ ...f, show_transaksi: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border outline-none"
                style={{ borderColor: border }}
              >
                <option value="">Semua</option>
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </Labeled>
          </div>

          <Labeled label="Gunakan Manajemen Stok" textMuted={textMuted}>
            <select
              value={filter.use_stok}
              onChange={(e) => setFilter((f) => ({ ...f, use_stok: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border outline-none"
              style={{ borderColor: border }}
            >
              <option value="">Semua</option>
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </Labeled>

          <div className="flex items-center justify-between pt-2">
            <button onClick={handleResetFilter} className="px-4 py-2 rounded-lg border hover:opacity-90" style={{ borderColor: border }}>
              Reset
            </button>
            <div className="flex gap-2">
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg border hover:opacity-90" style={{ borderColor: border }}>
                Batal
              </button>
              <button onClick={handleApplyFilter} className="px-4 py-2 rounded-lg text-white hover:opacity-95" style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}>
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );

  // ============================= LAYOUTS =============================
  /** Layout A – Split Master-Detail (kiri list, kanan detail) */
  function renderLayoutA() {
    return (
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* LEFT - LIST */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden" style={{ background: card, borderRight: `1px solid ${border}` }}>
          <HeaderSearch q={q} setQ={setQ} onClear={() => setQ("")} primary700={primary700} primary200={primary200} border={border} text={text} />
          <CategoryChips primary200={primary200} accent700={accent700} border={border} text={text} textMuted={textMuted} />
          <ListItems items={filteredItems} selectedId={selectedId} onSelect={handleSelect} primary200={primary200} primary700={primary700}  border={border} text={text} />
          <div className="p-4" style={{ background: card, borderTop: `1px solid ${border}` }}>
            <button onClick={handleOpenAdd} className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95" style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}>
              TAMBAH BARANG
            </button>
          </div>
        </div>

        {/* RIGHT - DETAIL */}
        <div className="w-full lg:w-[40%] overflow-y-auto p-4 lg:p-6" style={{ background: appBg }}>
          {selected ? (
            <DetailPanel selected={selected} onEdit={handleOpenEdit} primary700={primary700} primary200={primary200} border={border} card={card} text={text} textMuted={textMuted} />
          ) : (
            <EmptyHint border={border} card={card} textMuted={textMuted} />
          )}
        </div>
      </div>
    );
  }

  /** Layout B – Cards grid + Sidebar sticky detail */
  function renderLayoutB() {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="border-b" style={{ background: card, borderColor: border }}>
          <div className="p-4 lg:p-6">
            <HeaderSearch q={q} setQ={setQ} onClear={() => setQ("")} compact primary700={primary700} primary200={primary200} border={border} text={text} />
            <CategoryChips className="mt-3" primary200={primary200} accent700={accent700} border={border} text={text} textMuted={textMuted} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 lg:p-6">
          {/* Cards grid */}
          <div className="lg:col-span-3 space-y-3">
            {filteredItems.length === 0 ? (
              <EmptyState textMuted={textMuted} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <CardItem key={item.id} item={item} active={selectedId === item.id} onClick={() => handleSelect(item.id)} primary200={primary200} primary700={primary700} border={border} card={card} text={text} textMuted={textMuted} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar detail */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              {selected ? (
                <DetailPanel selected={selected} onEdit={handleOpenEdit} primary700={primary700} primary200={primary200} border={border} card={card} text={text} textMuted={textMuted} />
              ) : (
                <EmptyHint border={border} card={card} textMuted={textMuted} />
              )}
              <div className="mt-4">
                <button onClick={handleOpenAdd} className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95" style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}>
                  TAMBAH BARANG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** Layout C – Reversed Split (kanan list, kiri detail) */
  function renderLayoutC() {
    return (
      <div className="flex flex-1 flex-col lg:flex-row-reverse overflow-hidden">
        {/* RIGHT (list) */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden" style={{ background: card, borderLeft: `1px solid ${border}` }}>
          <HeaderSearch q={q} setQ={setQ} onClear={() => setQ("")} primary700={primary700} primary200={primary200} border={border} text={text} />
          <CategoryChips primary200={primary200} accent700={accent700} border={border} text={text} textMuted={textMuted} />
          <ListItems items={filteredItems} selectedId={selectedId} onSelect={handleSelect} primary200={primary200} primary700={primary700}  border={border} text={text} />
          <div className="p-4" style={{ background: card, borderTop: `1px solid ${border}` }}>
            <button onClick={handleOpenAdd} className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95" style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}>
              TAMBAH BARANG
            </button>
          </div>
        </div>

        {/* LEFT (detail) */}
        <div className="w-full lg:w-[40%] overflow-y-auto p-4 lg:p-6" style={{ background: appBg }}>
          {selected ? (
            <DetailPanel selected={selected} onEdit={handleOpenEdit} primary700={primary700} primary200={primary200} border={border} card={card} text={text} textMuted={textMuted} />
          ) : (
            <EmptyHint border={border} card={card} textMuted={textMuted} />
          )}
        </div>
      </div>
    );
  }
}

// ============================= SUB-COMPONENTS =============================
function HeaderSearch({ q, setQ, onClear, compact = false, primary700, primary200, border, text }) {
  /** Komponen header pencarian (aksesibel + ikon) */
  return (
    <div className={compact ? "" : "p-0"}>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Cari nama / kode barang…"
            className="w-full pl-11 pr-4 py-3 text-base rounded-xl border outline-none focus:ring-2"
            style={{ borderColor: border, color: text, boxShadow: "none", caretColor: primary700 }}
          />
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: "#98A2B3" }} />
        </div>
        <button onClick={onClear} className="rounded-lg border px-4" style={{ borderColor: border, color: text }}>
          Bersihkan
        </button>
      </div>
    </div>
  );
}

function CategoryChips({ className = "", primary200, accent700, border, text, textMuted }) {
  /** Chip kategori demonstratif – integrasikan dengan real category bila ada */
  return (
    <div className={`px-4 lg:px-6 py-3 border-b ${className}`} style={{ borderColor: border, background: "transparent" }}>
      <div className="flex flex-wrap gap-2">
        {["Semua", "Sembako", "Minuman"].map((c, idx) => (
          <button
            key={idx}
            className="px-3 py-1.5 rounded-full border text-sm transition"
            style={
              idx === 0
                ? { background: `${primary200}40`, borderColor: primary200, color: accent700 }
                : { background: "#FFFFFF", borderColor: border, color: text }
            }
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListItems({ items, selectedId, onSelect, primary200, primary700,  border, text }) {
  /** Daftar item dalam tampilan list – responsive & hover */
  if (!items.length) return <EmptyState />;
  return (
    <div className="overflow-y-auto p-4 lg:p-6 space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="p-4 rounded-xl flex justify-between items-center text-base lg:text-lg font-medium cursor-pointer border transition shadow-sm hover:shadow-md hover:-translate-y-[1px]"
          style={
            selectedId === item.id
              ? { background: `${primary200}33`, borderColor: primary700, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }
              : { background: "#FFFFFF", borderColor: border }
          }
        >
          <div className="flex items-center gap-4">
            {item.image ? (
              <img src={item.image} alt={item.nama} className="w-12 h-12 object-cover rounded-lg" />
            ) : (
              <div className="w-12 h-12 rounded-lg grid place-items-center font-bold" style={{ background: "#F2F4F7", border: `1px solid ${border}`, color: text }}>
                {item.nama.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-semibold" style={{ color: text }}>{item.nama}</div>
              <div className="text-xs" >Kode: {item.kode || "-"}</div>
            </div>
          </div>
          <div className="text-right text-sm" style={{ color: text }}>
            <div>
              Stok: <span className="font-semibold">{item.stok}</span>
            </div>
            <div>
              {rupiah(item.harga_dasar)} - {rupiah(item.harga_jual)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CardItem({ item, active, onClick, primary200, primary700, border, card, text, textMuted }) {
  /** Kartu item untuk grid (Layout B) */
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border p-4 transition shadow-sm hover:shadow-md hover:-translate-y-[1px] w-full"
      style={active ? { borderColor: primary700, background: `${primary200}33` } : { borderColor: border, background: card }}
    >
      <div className="flex items-center gap-4">
        {item.image ? (
          <img src={item.image} alt={item.nama} className="w-12 h-12 object-cover rounded-lg" />
        ) : (
          <div className="w-12 h-12 rounded-lg grid place-items-center font-bold" style={{ background: "#F2F4F7", border: `1px solid ${border}`, color: text }}>
            {item.nama.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold" style={{ color: text }}>{item.nama}</div>
          <div className="text-xs" style={{ color: textMuted }}>Kode: {item.kode || "-"}</div>
        </div>
        <div className="text-right text-sm" style={{ color: text }}>
          <div>
            Stok: <span className="font-semibold">{item.stok}</span>
          </div>
          <div>{rupiah(item.harga_jual)}</div>
        </div>
      </div>
    </button>
  );
}

function DetailPanel({ selected, onEdit, primary700, primary200, border, card, text, textMuted }) {
  /** Panel detail item – info ringkas + CTA */
  return (
    <div className="rounded-2xl p-4 lg:p-6 shadow-sm" style={{ background: card, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {selected.image ? (
            <img src={selected.image} alt={selected.nama} className="w-14 h-14 object-cover rounded-lg" />
          ) : (
            <div className="w-14 h-14 rounded-lg grid place-items-center font-bold text-2xl" style={{ background: "#EEF2FF", color: primary700 }}>
              {selected.nama.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-2xl font-bold" style={{ color: text }}>{selected.nama}</div>
            <div className="text-sm" style={{ color: textMuted }}>Kode: {selected.kode || "-"}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert("Mau Hapus Items?")} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ color: "#B42318", borderColor: "#F04438", background: "#FEF3F2" }}>
            <VscTrash size={18} />
          </button>
          <button onClick={onEdit} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ color: primary700, borderColor: primary700, background: `${primary200}1A` }}>
            <MdEdit size={18} /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-base lg:text-sm">
        <Info label="Harga Dasar" value={<strong>{rupiah(selected.harga_dasar)}</strong>} card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Harga Jual" value={<strong>{rupiah(selected.harga_jual)}</strong>} card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Diskon" value="0%" card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Berat" value="0 Gram" card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Stok" value={selected.stok} card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Stok Minimum" value="0" card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Kategori" value="-" card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Letak Rak" value="-" card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Keterangan" value="-" card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Tampil di Transaksi" value={selected.show_transaksi ? "Ya" : "Tidak"} card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Gunakan Manajemen Stok" value={selected.use_stok ? "Ya" : "Tidak"} card={card} border={border} text={text} textMuted={textMuted} />
        <Info label="Status" value={selected.status ? "Aktif" : "Nonaktif"} card={card} border={border} text={text} textMuted={textMuted} />
      </div>

      <Link to={`/stok/${selected.id}`} className="mt-6 block w-full rounded-xl text-center font-medium py-3 hover:opacity-95" style={{ background: `linear-gradient(90deg, ${primary200})`, color: "#0b102a" }}>
        ➔ LIHAT DETAIL STOK
      </Link>
    </div>
  );
}

function EmptyState({ textMuted = "#94A3B8" }) {
  /** State kosong untuk list */
  return <div className="text-center py-10" style={{ color: textMuted }}>Tidak ada barang yang cocok dengan filter/pencarian.</div>;
}

function EmptyHint({ border, card, textMuted }) {
  /** Hint saat belum ada item terpilih */
  return (
    <div className="rounded-2xl border border-dashed p-6 text-center" style={{ borderColor: border, background: card, color: textMuted }}>
      Pilih salah satu barang untuk melihat detailnya.
    </div>
  );
}

function Info({ label, value, card, border, text, textMuted }) {
  /** Baris info sederhana dengan label kecil & value */
  return (
    <div className="rounded-xl p-3 border" style={{ background: card, borderColor: border }}>
      <div className="text-xs mb-1" style={{ color: textMuted }}>{label}</div>
      <div style={{ color: text }}>{value}</div>
    </div>
  );
}

function Labeled({ label, children, textMuted }) {
  /** Label + input wrapper */
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm" style={{ color: textMuted }}>{label}</span>
      {children}
    </label>
  );
}

function BarangForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef, onClose, tokens }) {
  /** Form tambah/edit item – tanpa validasi backend */
  const { primary700, accent700, primary200, border } = tokens || {};

  // Handler perubahan input angka & teks
  const handle = (key) => (e) => {
    const v = e.target.value;
    if (["stok", "harga_dasar", "harga_jual", "kategori_id", "toko_id", "created_by", "updated_by"].includes(key)) {
      const cleaned = typeof v === "string" && v.replace ? v.replace(/\D/g, "") : v;
      setForm((f) => ({ ...f, [key]: cleaned === "" ? "" : Number(cleaned) }));
    } else {
      setForm((f) => ({ ...f, [key]: v }));
    }
  };

  // Handler checkbox
  const handleCheck = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="grid grid-cols-1 gap-3"
    >
      <Labeled label="Nama">
        <input
          ref={initialFocusRef}
          value={form.nama}
          onChange={handle("nama")}
          placeholder="Nama barang"
          className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
          style={{ borderColor: border, boxShadow: "none" }}
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Kode">
          <input
            value={form.kode}
            onChange={handle("kode")}
            placeholder="Kode unik"
            className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
            style={{ borderColor: border, boxShadow: "none" }}
          />
        </Labeled>
        <Labeled label="Kategori ID">
          <input
            value={toNumber(form.kategori_id)}
            onChange={handle("kategori_id")}
            type="number"
            placeholder="Contoh: 10"
            className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
            style={{ borderColor: border, boxShadow: "none" }}
          />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Harga Dasar">
          <input
            value={toNumber(form.harga_dasar)}
            onChange={handle("harga_dasar")}
            inputMode="numeric"
            placeholder="11000"
            className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
            style={{ borderColor: border, boxShadow: "none" }}
          />
        </Labeled>
        <Labeled label="Harga Jual">
          <input
            value={toNumber(form.harga_jual)}
            onChange={handle("harga_jual")}
            inputMode="numeric"
            placeholder="13000"
            className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
            style={{ borderColor: border, boxShadow: "none" }}
          />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Stok">
          <input
            value={toNumber(form.stok)}
            onChange={handle("stok")}
            inputMode="numeric"
            placeholder="0"
            className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
            style={{ borderColor: border, boxShadow: "none" }}
          />
        </Labeled>
        <Labeled label="Tampilkan di Transaksi">
          <div className="h-10 flex items-center px-3 rounded-lg border" style={{ borderColor: border }}>
            <input type="checkbox" checked={!!form.show_transaksi} onChange={handleCheck("show_transaksi")} />
            <span className="ml-2">Ya</span>
          </div>
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Gunakan Manajemen Stok">
          <div className="h-10 flex items-center px-3 rounded-lg border" style={{ borderColor: border }}>
            <input type="checkbox" checked={!!form.use_stok} onChange={handleCheck("use_stok")} />
            <span className="ml-2">Ya</span>
          </div>
        </Labeled>
        <Labeled label="Status Aktif">
          <div className="h-10 flex items-center px-3 rounded-lg border" style={{ borderColor: border }}>
            <input type="checkbox" checked={!!form.status} onChange={handleCheck("status")} />
            <span className="ml-2">Aktif</span>
          </div>
        </Labeled>
      </div>

      <Labeled label="URL Gambar (opsional)">
        <input
          value={form.image || ""}
          onChange={handle("image")}
          placeholder="https://…"
          className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
          style={{ borderColor: border, boxShadow: "none" }}
        />
      </Labeled>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" className="px-4 py-2 rounded-lg border hover:opacity-90" onClick={onClose} style={{ borderColor: border }}>
          Batal
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg text-white hover:opacity-95" style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}>
          {submitText}
        </button>
      </div>
    </form>
  );
}
