import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdSearch, MdClose, MdEdit, MdToggleOn, MdToggleOff } from "react-icons/md";

const nowIso = () => new Date().toISOString();
const DUMMY = [
  { id: 1, toko_id: 1, nama: "Elektronik", created_by: 1, updated_by: 1, sync_at: null, status: true,  created_at: nowIso(), updated_at: nowIso() },
  { id: 2, toko_id: 1, nama: "Pakaian",    created_by: 2, updated_by: 2, sync_at: null, status: true,  created_at: nowIso(), updated_at: nowIso() },
  { id: 3, toko_id: 1, nama: "Alat Tulis", created_by: 1, updated_by: 1, sync_at: null, status: true,  created_at: nowIso(), updated_at: nowIso() },
  { id: 4, toko_id: 1, nama: "Makanan",    created_by: 3, updated_by: 3, sync_at: null, status: false, created_at: nowIso(), updated_at: nowIso() },
  { id: 5, toko_id: 1, nama: "Minuman",    created_by: 3, updated_by: 3, sync_at: null, status: true,  created_at: nowIso(), updated_at: nowIso() },
];

function formatDate(v) {
  if (!v) return "-";
  try {
    const d = new Date(v);
    return `${d.toLocaleDateString("id-ID")} ${d.toLocaleTimeString("id-ID")}`;
  } catch {
    return String(v);
  }
}
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}
function Highlighted({ text = "", query = "" }) {
  if (!query) return <>{text}</>;
  const q = query.trim();
  const parts = text.split(new RegExp(`(${q})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-yellow-100 text-gray-900 rounded px-0.5">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function KategoriBarangPage() {
  const [categories, setCategories] = useState(DUMMY);
  const [selectedId, setSelectedId] = useState(DUMMY[0]?.id ?? null);

  // Search (dengan debounce & highlight)
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setQ(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    if (!q.trim()) return categories;
    const lower = q.trim().toLowerCase();
    return categories.filter((c) => (c.nama || "").toLowerCase().includes(lower));
  }, [categories, q]);

  const selected = useMemo(
    () => categories.find((c) => c.id === selectedId) || null,
    [categories, selectedId]
  );

  // Navbar
  const openTambah = useCallback(() => setIsModalOpen(true), []);
  const doRefresh = useCallback(() => {
    setCategories(DUMMY);
    setSelectedId(DUMMY[0]?.id ?? null);
    setSearch("");
  }, []);
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Tambah Kategori",
        onClick: openTambah,
        className:
          "inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700",
        icon: <MdAdd size={20} />,
      },
      {
        type: "button",
        title: "Refresh",
        onClick: doRefresh,
        className:
          "inline-flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100",
        icon: <MdRefresh size={20} />,
      },
    ],
    [openTambah, doRefresh]
  );
  useNavbar({ variant: "page", title: "Kategori Barang", backTo: "/management", actions }, [actions]);

  // Modal tambah
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saving, setSaving] = useState(false);
  const addKategori = async (e) => {
    e.preventDefault();
    const nama = newCategoryName.trim();
    if (!nama) return;
    setSaving(true);
    const idBaru = Math.max(0, ...categories.map((c) => c.id)) + 1;
    const row = {
      id: idBaru,
      toko_id: 1,
      nama,
      created_by: 1,
      updated_by: 1,
      sync_at: null,
      status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCategories((prev) => [row, ...prev]);
    setSelectedId(idBaru);
    setNewCategoryName("");
    setSaving(false);
    setIsModalOpen(false);
  };

  // Toggle status di preview
  const toggleStatus = () => {
    if (!selected) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: !c.status, updated_at: new Date().toISOString() } : c
      )
    );
  };

  return (
    <div className="w-full h-screen flex overflow-hidden bg-white">
      {/* LEFT: LIST (dengan search sticky) */}
{/* LEFT: LIST */}
<div className="flex flex-col w-1/2 h-full border-r border-gray-200">
  
  {/* Search bar sticky */}
  <div className="shrink-0 sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
    <div className="px-4 py-3">
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kategori…"
          className="w-full pl-10 pr-10 h-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500"
            title="Bersihkan"
          >
            <MdClose size={18} />
          </button>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Menampilkan <b>{filtered.length}</b> dari {categories.length} kategori
      </div>
    </div>
  </div>

  {/* Scroll hanya di bagian list */}
  <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
    {filtered.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center text-center text-gray-500">
        <div className="mb-3 text-4xl">📁</div>
        Tidak ada kategori yang cocok.
      </div>
    ) : (
      filtered.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedId(c.id)}
            className={cn(
              "text-left rounded-xl border transition focus:outline-none focus:ring-2",
              active
                ? "border-green-500 ring-1 ring-green-500 bg-green-50"
                : "border-gray-200 bg-white hover:shadow-sm"
            )}
          >
            <div className="flex items-stretch">
              <div
                className={cn(
                  "w-1.5 rounded-l-xl",
                  active ? "bg-green-500" : "bg-gradient-to-b from-green-400 to-emerald-500"
                )}
              />
              <div className="flex-1 flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-bold">
                    {(c.nama || "K").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-800 truncate">
                    <Highlighted text={c.nama || "-"} query={q} />
                  </div>
                  <div className="text-gray-500 text-xs">ID: {c.id}</div>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    c.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  )}
                >
                  {c.status ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </button>
        );
      })
    )}
  </div>
</div>

      {/* RIGHT: PREVIEW */}
      <div className="w-1/2 h-full overflow-auto">
        {!selected ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Pilih kategori untuk melihat detail
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Header preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {(selected.nama || "K").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold">{selected.nama || "-"}</div>
                  <div className="text-gray-500 text-sm">ID: {selected.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => alert("Edit dummy")}
                  title="Edit (dummy)"
                >
                  <MdEdit size={18} /> Edit
                </button>
                <button
                  type="button"
                  onClick={toggleStatus}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
                    selected.status
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  )}
                  title="Toggle Status"
                >
                  {selected.status ? <><MdToggleOn size={20}/> Nonaktifkan</> : <><MdToggleOff size={20}/> Aktifkan</>}
                </button>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("px-2.5 py-1 rounded-full text-xs", selected.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>
                {selected.status ? "Aktif" : "Nonaktif"}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Toko #{selected.toko_id ?? "-"}</span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Toko ID" value={selected.toko_id ?? "-"} />
              <Field label="Created By" value={selected.created_by ?? "-"} />
              <Field label="Updated By" value={selected.updated_by ?? "-"} />
              <Field label="Sync At" value={selected.sync_at ? formatDate(selected.sync_at) : "-"} />
              <Field label="Created At" value={formatDate(selected.created_at)} />
              <Field label="Updated At" value={formatDate(selected.updated_at)} />
            </div>

            {/* Note */}
            <div className="p-4 bg-white rounded-xl border">
              <div className="text-xs text-gray-500 mb-1">Catatan</div>
              <div className="text-gray-700">
                Ini preview detail kategori berdasarkan struktur model. Aksi edit/status masih dummy.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah */}
      <Modal open={isModalOpen} title="Tambah Kategori" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={addKategori} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Nama Kategori
            </label>
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="cth: Makanan, Elektronik, ATK..."
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              data-autofocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!newCategoryName.trim() || saving}
              className="rounded-xl px-4 py-2.5 text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ===== Subcomponents ===== */
function Field({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-3 border">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-gray-800">{String(value)}</div>
    </div>
  );
}