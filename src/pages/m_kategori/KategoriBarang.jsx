import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import {
  MdAdd,
  MdRefresh,
  MdSearch,
  MdClose,
  MdEdit,
  MdToggleOn,
  MdToggleOff,
} from "react-icons/md";
import { useKategori } from "../../hooks/useKategori";
import cx, { useDebouncedValue, Highlighted, formatDate } from "../../utils/utils";
import { ModalAddKategori, ModalEditKategori } from "./ModalKategori";

export default function KategoriBarangPage({ variant = "A" }) {
  const {
    items: kategoriItems,
    pagination,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  } = useKategori();

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [namaBaru, setNamaBaru] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saving, setSaving] = useState(false);

  const q = useDebouncedValue(search, 250);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return kategoriItems;
    return kategoriItems.filter((it) =>
      (it.nama || "").toLowerCase().includes(s)
    );
  }, [kategoriItems, q]);

  useEffect(() => {
    if (!selectedId && filtered.length) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((x) => x.id === selectedId) || null;

  const openTambah = useCallback(() => setIsAddModalOpen(true), []);

  const doRefresh = useCallback(() => {
    refresh();
    setSearch("");
  }, []);

  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Tambah Kategori",
        onClick: openTambah,
        className:
          "inline-flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:opacity-95",
        icon: <MdAdd size={20} />,
        style: {
          background:
            "linear-gradient(90deg, var(--blue-700), var(--navy-800))",
        },
      },
      {
        type: "button",
        title: "Refresh",
        onClick: doRefresh,
        className:
          "inline-flex items-center gap-2 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100",
        icon: <MdRefresh size={20} />,
      },
    ],
    [openTambah, doRefresh]
  );

  useNavbar(
    {
      variant: "page",
      uiPreset: "translucent", // coba: 'solid' / 'translucent' / 'compact'
      title: "Kategori Barang",
      backTo: "/management",
      actions: actions,
    },
    [actions] // deps
  );

  const addKategori = async (e) => {
    e.preventDefault();
    const nama = namaBaru.trim();
    if (!nama) return;
    setSaving(true);
    try {
      await create({ nama, status: true, toko_id: 1 });
      setNamaBaru("");
      setOpen(false);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const updateKategori = async (e) => {
    e.preventDefault();
    const nama = selected?.nama?.trim();
    if (!nama) return;
    setSaving(true);
    try {
      await update(selected.id, { 
        nama: nama, 
      });
      setOpen(false);
      refresh();
    } finally {
      setSaving(false);
    }
  };


  const toggleStatus = () => {
    if (!selected) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, status: !c.status, updated_at: nowIso() }
          : c
      )
    );
  };


  useEffect(() => {
    document.title = "Kategori Barang | Aplikasi";
  }, []);

  return (
    <div className="h-full w-full flex overflow-hidden bg-slate-50">
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

      <ModalAddKategori isModalOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen} newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName} addKategori={addKategori} saving={saving} />
      <ModalEditKategori isModalOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen} selectedCategory={selected} updateKategori={updateKategori} saving={saving} />
    </div>
  );
}

/* ============================= LAYOUTS ============================= */
/**
 * LayoutA
 * — Master–Detail split: kiri (list) & kanan (preview).
 *   Optim untuk kecepatan navigasi item pada desktop.
 */
function LayoutA({
  search,
  setSearch,
  filtered,
  selected,
  selectedId,
  setSelectedId,
  openTambah,
  toggleStatus,
}) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
      {/* LEFT - list */}
      <div className="w-full lg:w-1/2 h-full flex flex-col border-r border-slate-200 bg-white">
        <StickySearch
          search={search}
          setSearch={setSearch}
          count={filtered.length}
          totalHint
        />
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
                  className={cx(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active
                      ? "border-[color:var(--blue-700)] ring-1 ring-[color:var(--blue-700)] bg-[color:var(--purple-200)]/20"
                      : "border-slate-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div
                      className={cx(
                        "w-1.5 rounded-l-xl",
                        active
                          ? "bg-[color:var(--blue-700)]"
                          : "bg-[color:var(--purple-200)]/60"
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
                        className={cx(
                          "text-xs px-2 py-1 rounded-full",
                          c.status
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
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
            style={{
              background:
                "linear-gradient(90deg, var(--blue-700), var(--navy-800))",
            }}
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
function LayoutB({
  search,
  setSearch,
  filtered,
  selected,
  selectedId,
  setSelectedId,
  openTambah,
  toggleStatus,
}) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="border-b bg-white">
        <div className="p-4 lg:p-6">
          <SearchBar search={search} setSearch={setSearch} compact />
          <div className="mt-2 text-xs text-slate-500">
            Menampilkan <b>{filtered.length}</b> kategori
          </div>
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
                    className={cx(
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
                        className={cx(
                          "text-xs px-2 py-1 rounded-full",
                          c.status
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
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
            {!selected ? (
              <EmptyHint />
            ) : (
              <PreviewCard selected={selected} toggleStatus={toggleStatus} />
            )}
            <div className="mt-4">
              <button
                onClick={openTambah}
                className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
                style={{
                  background:
                    "linear-gradient(90deg, var(--blue-700), var(--navy-800))",
                }}
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
function LayoutC({
  search,
  setSearch,
  filtered,
  selected,
  selectedId,
  setSelectedId,
  openTambah,
  toggleStatus,
}) {
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
                        className={cx(
                          "border-t",
                          active
                            ? "bg-[color:var(--purple-200)]/10"
                            : "hover:bg-slate-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedId(c.id)}
                            className="inline-flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-[color:var(--purple-200)]/30 rounded-md flex items-center justify-center">
                              <span className="text-[color:var(--blue-700)] font-bold">
                                {(c.nama || "K").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">
                              <Highlighted
                                text={c.nama || "-"}
                                query={search}
                              />
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cx(
                              "text-xs px-2 py-1 rounded-full",
                              c.status
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {c.status ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(c.updated_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          {!selected ? (
            <EmptyHint />
          ) : (
            <PreviewCard selected={selected} toggleStatus={toggleStatus} />
          )}
          <div className="mt-4">
            <button
              onClick={openTambah}
              className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
              style={{
                background:
                  "linear-gradient(90deg, var(--blue-700), var(--navy-800))",
              }}
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
            <>
              Menampilkan <b>{count}</b> kategori
            </>
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
        <MdSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
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
              <input
                type="checkbox"
                checked={selected.status}
                onChange={toggleStatus}
                className="hidden"
              />
              <span
                className={cx(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg transition",
                  selected.status
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                )}
                title="Toggle Status"
                aria-label="Ubah status aktif"
              >
                {selected.status ? (
                  <MdToggleOn size={20} />
                ) : (
                  <MdToggleOff size={20} />
                )}
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
          <span
            className={cx(
              "px-2.5 py-1 rounded-full text-xs",
              selected.status
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-700"
            )}
          >
            {selected.status ? "Aktif" : "Nonaktif"}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
            Toko #{selected.toko_id ?? "-"}
          </span>
        </div>
        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <Field label="Toko ID" value={selected.toko_id ?? "-"} />
          <Field label="Created By" value={selected.created_by ?? "-"} />
          <Field label="Updated By" value={selected.updated_by ?? "-"} />
          <Field
            label="Sync At"
            value={selected.sync_at ? formatDate(selected.sync_at) : "-"}
          />
          <Field label="Created At" value={formatDate(selected.created_at)} />
          <Field label="Updated At" value={formatDate(selected.updated_at)} />
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
          style={{
            background:
              "linear-gradient(90deg, var(--blue-700), var(--navy-800))",
          }}
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
