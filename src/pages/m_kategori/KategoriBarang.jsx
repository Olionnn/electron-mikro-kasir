import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdSearch, MdClose, MdEdit, MdToggleOn, MdToggleOff } from "react-icons/md";
import { MdSettings } from "react-icons/md";

/**
 * =========================================================
 * Kategori Barang (Revamp + 3 Variants) — PREMIUM UI
 * =========================================================
 * Palette / CSS Tokens (dipakai lintas komponen):
 *  - Ungu Muda  : #B2B0E8 → var(--purple-200)
 *  - Biru Abu   : #7A85C1 → var(--blue-300)
 *  - Biru Tua   : #3B38A0 → var(--blue-700)
 *  - Navy Gelap : #1A2A80 → var(--navy-800)
 *
 * Catatan Implementasi:
 * - Tersedia 3 alternatif layout: "A" (Master–Detail split),
 *   "B" (Cards + Sidebar), "C" (Table-lite + Drawer feel).
 *   Gunakan: <KategoriBarangPage variant="A"/> / "B" / "C" (default: "A").
 * - Semua fungsi asli dipertahankan: search (debounce & highlight),
 *   tambah kategori (modal), preview + toggle status (dummy), refresh.
 * - Desain modern: spacing rapi, tipografi, hover & transition lembut.
 * - Production-ready: responsif, aksesibel, tanpa dependency ekstra.
 */

/**
 * nowIso
 * — Utility: mengembalikan timestamp ISO saat ini.
 *   Dipakai untuk field created_at / updated_at dummy.
 */
const nowIso = () => new Date().toISOString();

/**
 * DUMMY
 * — Data kategori mock untuk ilustrasi UI (tidak mengubah logic app).
 *   id/created_by/updated_by/sync_at/status dibuat realistis.
 */
const DUMMY = [
  { id: 1, toko_id: 1, nama: "Elektronik", created_by: 1, updated_by: 1, sync_at: null, status: true, created_at: nowIso(), updated_at: nowIso() },
  { id: 2, toko_id: 1, nama: "Pakaian", created_by: 2, updated_by: 2, sync_at: null, status: true, created_at: nowIso(), updated_at: nowIso() },
  { id: 3, toko_id: 1, nama: "Alat Tulis", created_by: 1, updated_by: 1, sync_at: null, status: true, created_at: nowIso(), updated_at: nowIso() },
  { id: 4, toko_id: 1, nama: "Makanan", created_by: 3, updated_by: 3, sync_at: null, status: false, created_at: nowIso(), updated_at: nowIso() },
  { id: 5, toko_id: 1, nama: "Minuman", created_by: 3, updated_by: 3, sync_at: null, status: true, created_at: nowIso(), updated_at: nowIso() },
];

/**
 * formatDate
 * — Utility: memformat ISO string → tanggal & jam lokal (id-ID).
 *   Aman untuk input null/invalid.
 */
function formatDate(v) {
  if (!v) return "-";
  try {
    const d = new Date(v);
    return `${d.toLocaleDateString("id-ID")} ${d.toLocaleTimeString("id-ID")}`;
  } catch {
    return String(v);
  }
}

/**
 * cn
 * — Utility sederhana untuk menggabungkan className secara kondisional.
 */
function cn(...xs) { return xs.filter(Boolean).join(" "); }

/**
 * Highlighted
 * — Komponen teks dengan kemampuan highlight substring (case-insensitive)
 *   sesuai query. Dipakai untuk menyorot hasil pencarian.
 */
function Highlighted({ text = "", query = "" }) {
  if (!query) return <>{text}</>;
  const q = query.trim();
  const parts = text.split(new RegExp(`(${q})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="bg-[color:var(--purple-200)]/40 text-[color:var(--navy-800)] rounded px-0.5"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

/**
 * KategoriBarangPage
 * — Container utama halaman Kategori Barang.
 *   - Mengatur state list kategori, pencarian (dengan debounce),
 *     item terpilih, dan modal tambah.
 *   - Menyediakan 3 varian layout UI (A/B/C) tanpa mengubah fungsi inti.
 */
export default function KategoriBarangPage({ variant = "A" }) {
  // STATE: sumber data kategori untuk UI (dummy)
  const [categories, setCategories] = useState(DUMMY);
  // STATE: id kategori yang sedang dipreview di panel kanan
  const [selectedId, setSelectedId] = useState(DUMMY[0]?.id ?? null);

  // STATE: pencarian (search input) + query yang didebounce untuk efisiensi render
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");

  /**
   * EFFECT: debounce input pencarian selama 250ms sebelum menyalurkan ke query (q)
   */
  useEffect(() => {
    const t = setTimeout(() => setQ(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  /**
   * MEMO: hasil filter berdasarkan query. Sorting/ordering bisa ditambahkan di sini bila dibutuhkan.
   */
  const filtered = useMemo(() => {
    if (!q.trim()) return categories;
    const lower = q.trim().toLowerCase();
    return categories.filter((c) => (c.nama || "").toLowerCase().includes(lower));
  }, [categories, q]);

  /**
   * MEMO: objek kategori yang saat ini terpilih (untuk panel preview).
   */
  const selected = useMemo(() => categories.find((c) => c.id === selectedId) || null, [categories, selectedId]);

  /**
   * CALLBACK: membuka modal tambah kategori.
   */
  const openTambah = useCallback(() => setIsModalOpen(true), []);

  /**
   * CALLBACK: refresh data ke kondisi awal (reset list + pilihan + pencarian).
   */
  const doRefresh = useCallback(() => {
    setCategories(DUMMY);
    setSelectedId(DUMMY[0]?.id ?? null);
    setSearch("");
  }, []);

  /**
   * ACTIONS NAVBAR: konfigurasi tombol aksi di header (Tambah, Refresh).
   *  - Tetap memanfaatkan hook useNavbar dari aplikasi asli.
   */
  const actions = useMemo(() => [
    {
      type: "button",
      title: "Tambah Kategori",
      onClick: openTambah,
      className: "inline-flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:opacity-95",
      icon: <MdAdd size={20} />,
      style: { background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" },
    },
    {
      type: "button",
      title: "Refresh",
      onClick: doRefresh,
      className: "inline-flex items-center gap-2 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100",
      icon: <MdRefresh size={20} />,
    },
  ], [openTambah, doRefresh]);

  // REGISTER NAVBAR: set judul, back, dan actions ke sistem navbar aplikasi
useNavbar(
  {
    variant: "page",
    uiPreset: "translucent", // coba: 'solid' / 'translucent' / 'compact'
    title: "Kategori Barang",
    backTo: "/management",
    actions: actions
  },
  [actions] // deps
);

  // STATE: kontrol modal tambah + form name + flag saving
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  /**
   * HANDLER: submit form tambah kategori (dummy)
   *  - Membuat row baru berdasarkan nama input
   *  - Push ke state categories + set item terpilih + tutup modal
   */
  const addKategori = async (e) => {
    e.preventDefault();
    const nama = newCategoryName.trim();
    if (!nama) return;
    setSaving(true);
    const idBaru = Math.max(0, ...categories.map((c) => c.id)) + 1;
    const row = { id: idBaru, toko_id: 1, nama, created_by: 1, updated_by: 1, sync_at: null, status: true, created_at: nowIso(), updated_at: nowIso() };
    setCategories((prev) => [row, ...prev]);
    setSelectedId(idBaru);
    setNewCategoryName("");
    setSaving(false);
    setIsModalOpen(false);
  };

  /**
   * HANDLER: toggle status aktif/nonaktif pada item terpilih (dummy)
   *  - Update hanya terjadi pada state lokal (tanpa API)
   */
  const toggleStatus = () => {
    if (!selected) return;
    setCategories((prev) => prev.map((c) => (c.id === selected.id ? { ...c, status: !c.status, updated_at: nowIso() } : c)));
  };

  /**
   * EFFECT: set judul dokumen (tab browser) untuk konteks halaman.
   */
  useEffect(() => { document.title = "Kategori Barang | Aplikasi"; }, []);

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-slate-50">
      {/* Color Tokens (dibuat global untuk halaman ini) */}
      <style>{`:root{--purple-200:#B2B0E8;--blue-300:#7A85C1;--blue-700:#3B38A0;--navy-800:#1A2A80}`}</style>

      {/*
        SWITCH LAYOUT: pilih A/B/C tanpa mengubah fungsi
        - A: Split list + preview
        - B: Grid card + sidebar sticky
        - C: Table-lite + panel (drawer feel)
      */}
      {variant === "B" ? (
        <LayoutB
          search={search}
          setSearch={setSearch}
          filtered={filtered}
          selected={selected}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          openTambah={openTambah}
          toggleStatus={toggleStatus}
        />
      ) : variant === "C" ? (
        <LayoutC
          search={search}
          setSearch={setSearch}
          filtered={filtered}
          selected={selected}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          openTambah={openTambah}
          toggleStatus={toggleStatus}
        />
      ) : (
        <LayoutA
          search={search}
          setSearch={setSearch}
          filtered={filtered}
          selected={selected}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          openTambah={openTambah}
          toggleStatus={toggleStatus}
        />
      )}

      {/* MODAL: Tambah Kategori */}
      <Modal open={isModalOpen} title="Tambah Kategori" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={addKategori} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700">
              Nama Kategori
            </label>
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="cth: Makanan, Elektronik, ATK..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
              data-autofocus
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!newCategoryName.trim() || saving}
              className="rounded-xl px-4 py-2.5 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
            >
              {saving ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ============================= LAYOUTS ============================= */
/**
 * LayoutA
 * — Master–Detail split: kiri (list) & kanan (preview).
 *   Optim untuk kecepatan navigasi item pada desktop.
 */
function LayoutA({ search, setSearch, filtered, selected, selectedId, setSelectedId, openTambah, toggleStatus }) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
      {/* LEFT - list */}
      <div className="w-full lg:w-1/2 h-full flex flex-col border-r border-slate-200 bg-white">
        <StickySearch search={search} setSearch={setSearch} count={filtered.length} totalHint />
        {filtered.length === 0 ? (
          <EmptyList openTambah={openTambah} />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active
                      ? "border-[color:var(--blue-700)] ring-1 ring-[color:var(--blue-700)] bg-[color:var(--purple-200)]/20"
                      : "border-slate-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div
                      className={cn(
                        "w-1.5 rounded-l-xl",
                        active ? "bg-[color:var(--blue-700)]" : "bg-[color:var(--purple-200)]/60"
                      )}
                    />
                    <div className="flex-1 flex items-center gap-3 p-4">
                      <div className="w-10 h-10 bg-[color:var(--purple-200)]/30 rounded-md flex items-center justify-center">
                        <span className="text-[color:var(--blue-700)] font-bold">
                          {(c.nama || "K").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800 truncate">
                          <Highlighted text={c.nama || "-"} query={search} />
                        </div>
                        <div className="text-slate-500 text-xs">ID: {c.id}</div>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          c.status ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {c.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <div className="p-4 border-t">
          <button
            onClick={openTambah}
            className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
            style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
          >
            TAMBAH KATEGORI
          </button>
        </div>
      </div>

      {/* RIGHT - preview */}
      <div className="w-full lg:w-1/2 h-full overflow-auto bg-slate-50">
        {!selected ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            Pilih kategori untuk melihat detail
          </div>
        ) : (
          <PreviewCard selected={selected} toggleStatus={toggleStatus} />
        )}
      </div>
    </div>
  );
}

/**
 * LayoutB
 * — Grid card + sidebar sticky: cocok untuk scan banyak kategori cepat,
 *   detail selalu terlihat di sisi kanan.
 */
function LayoutB({ search, setSearch, filtered, selected, selectedId, setSelectedId, openTambah, toggleStatus }) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="border-b bg-white">
        <div className="p-4 lg:p-6">
          <SearchBar search={search} setSearch={setSearch} compact />
          <div className="mt-2 text-xs text-slate-500">Menampilkan <b>{filtered.length}</b> kategori</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 lg:p-6">
        {/* Cards */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <EmptyList openTambah={openTambah} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              {filtered.map((c) => {
                const active = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "text-left rounded-2xl border p-4 transition shadow-sm hover:shadow-md hover:-translate-y-[1px]",
                      active
                        ? "border-[color:var(--blue-700)] ring-1 ring-[color:var(--blue-700)] bg-[color:var(--purple-200)]/20"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[color:var(--purple-200)]/30 rounded-lg flex items-center justify-center">
                        <span className="text-[color:var(--blue-700)] font-bold">
                          {(c.nama || "K").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          <Highlighted text={c.nama || "-"} query={search} />
                        </div>
                        <div className="text-xs text-slate-500">ID: {c.id}</div>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          c.status ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {c.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {/* Sidebar detail */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            {!selected ? <EmptyHint /> : <PreviewCard selected={selected} toggleStatus={toggleStatus} />}
            <div className="mt-4">
              <button
                onClick={openTambah}
                className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
                style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
              >
                TAMBAH KATEGORI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * LayoutC
 * — Table-lite (ringan) + panel kanan (rasa drawer). Fokus pada
 *   keterbacaan data tabular sambil tetap menyediakan detail cepat.
 */
function LayoutC({ search, setSearch, filtered, selected, selectedId, setSelectedId, openTambah, toggleStatus }) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="border-b bg-white">
        <div className="p-4 lg:p-6">
          <SearchBar search={search} setSearch={setSearch} compact />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 lg:p-6">
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <EmptyList openTambah={openTambah} />
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-[color:var(--purple-200)]/20 text-[color:var(--navy-800)]">
                  <tr>
                    <th className="text-left px-4 py-3">Kategori</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Diperbarui</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const active = c.id === selectedId;
                    return (
                      <tr
                        key={c.id}
                        className={cn("border-t", active ? "bg-[color:var(--purple-200)]/10" : "hover:bg-slate-50")}
                      >
                        <td className="px-4 py-3">
                          <button onClick={() => setSelectedId(c.id)} className="inline-flex items-center gap-3">
                            <div className="w-8 h-8 bg-[color:var(--purple-200)]/30 rounded-md flex items-center justify-center">
                              <span className="text-[color:var(--blue-700)] font-bold">
                                {(c.nama || "K").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">
                              <Highlighted text={c.nama || "-"} query={search} />
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              c.status ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {c.status ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(c.updated_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          {!selected ? <EmptyHint /> : <PreviewCard selected={selected} toggleStatus={toggleStatus} />}
          <div className="mt-4">
            <button
              onClick={openTambah}
              className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
              style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
            >
              TAMBAH KATEGORI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= SUB-COMPONENTS ============================= */
/**
 * StickySearch
 * — Header pencarian yang selalu menempel di bagian atas list (sticky),
 *   menampilkan jumlah hasil bila diperlukan.
 */
function StickySearch({ search, setSearch, count, totalHint = false }) {
  return (
    <div className="shrink-0 sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="px-4 py-3">
        <SearchBar search={search} setSearch={setSearch} />
        <div className="mt-2 text-xs text-slate-500">
          {totalHint ? (
            <>Menampilkan <b>{count}</b> kategori</>
          ) : (
            <>&nbsp;</>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * SearchBar
 * — Komponen input pencarian reusable dengan tombol clear.
 *   Properti `compact` disediakan agar mudah dipakai di berbagai layout.
 */
function SearchBar({ search, setSearch, compact = false }) {
  return (
    <div className={compact ? "" : ""}>
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kategori…"
          aria-label="Cari kategori"
          className="w-full pl-10 pr-10 h-11 rounded-xl border border-slate-300 outline-none focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 text-slate-500"
            title="Bersihkan"
            aria-label="Bersihkan pencarian"
          >
            <MdClose size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * PreviewCard
 * — Panel detail untuk kategori terpilih: aksi edit (dummy), toggle status
 *   (dummy), badge status & info metadata, dan catatan.
 */
function PreviewCard({ selected, toggleStatus }) {
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[color:var(--purple-200)]/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[color:var(--blue-700)]">
                {(selected.nama || "K").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold">{selected.nama || "-"}</div>
              <div className="text-slate-500 text-sm">ID: {selected.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50"
              onClick={() => alert("Edit dummy")}
              title="Edit (dummy)"
            >
              <MdEdit size={18} />
            </button>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selected.status} onChange={toggleStatus} className="hidden" />
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg transition",
                  selected.status ? "bg-green-600 text-white hover:bg-green-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                )}
                title="Toggle Status"
                aria-label="Ubah status aktif"
              >
                {selected.status ? <MdToggleOn size={20} /> : <MdToggleOff size={20} />}
              </span>
            </label>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-red-600 hover:bg-red-50"
              onClick={() => alert("Hapus dummy")}
              title="Hapus (dummy)"
            >
              <MdClose size={18} />
            </button>
          </div>
        </div>
        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className={cn("px-2.5 py-1 rounded-full text-xs", selected.status ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700")}>
            {selected.status ? "Aktif" : "Nonaktif"}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700">Toko #{selected.toko_id ?? "-"}</span>
        </div>
        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <Field label="Toko ID" value={selected.toko_id ?? "-"} />
          <Field label="Created By" value={selected.created_by ?? "-"} />
          <Field label="Updated By" value={selected.updated_by ?? "-"} />
          <Field label="Sync At" value={selected.sync_at ? formatDate(selected.sync_at) : "-"} />
          <Field label="Created At" value={formatDate(selected.created_at)} />
          <Field label="Updated At" value={formatDate(selected.updated_at)} />
        </div>
        {/* Note */}
        <div className="p-4 bg-white rounded-xl border mt-4">
          <div className="text-xs text-slate-500 mb-1">Catatan</div>
          <div className="text-slate-700">
            Ini preview detail kategori berdasarkan struktur model. Aksi edit/status masih dummy.
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * EmptyList
 * — Empty state ketika hasil pencarian/list kosong. Menyediakan CTA tambah.
 */
function EmptyList({ openTambah }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full">
        <div className="mb-3 text-4xl">📁</div>
        Tidak ada kategori yang cocok.
        <button
          onClick={openTambah}
          className="mt-4 inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-95"
          style={{ background: "linear-gradient(90deg, var(--blue-700), var(--navy-800))" }}
        >
          <MdAdd size={18} /> Tambah Kategori Baru
        </button>
      </div>
    </div>
  );
}

/**
 * EmptyHint
 * — Hint sederhana pada panel preview ketika belum ada item terpilih.
 */
function EmptyHint() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
      Pilih kategori untuk melihat detailnya.
    </div>
  );
}

/**
 * Field
 * — Komponen kecil untuk menampilkan pasangan label–nilai secara konsisten.
 */
function Field({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-slate-800">{String(value)}</div>
    </div>
  );
}
