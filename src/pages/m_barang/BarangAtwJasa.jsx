import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { MdFilterList, MdAdd, MdEdit, MdRefresh, MdSearch } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { Link } from "react-router-dom";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme";
import { useBarang } from "../../hooks/useBarang";  // Assuming you have useBarang imported

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
  const { token } = useTheme?.() || { token: () => "" };
  const primary700 = token("--primary-700") || "#3B38A0";
  const primary200 = token("--primary-200") || "#B2B0E8";
  const accent700 = token("--accent-700") || "#1A2A80";
  const card = token("--card") || "#FFFFFF";
  const appBg = token("--app-bg") || "#F7F8FC";
  const border = token("--border") || "#E6E8F0";
  const text = token("--text") || "#1F2A37";
  const textMuted = token("--text-muted") || "#64748B";

  // Using the useBarang hook to manage CRUD operations
  const {
    items,
    pagination,
    loading,
    error,
    alert,
    refresh,
    create,
    update,
    remove,
    setAlert,
  } = useBarang();

  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(items.find((i) => i.selected)?.id ?? items[0]?.id ?? null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [formAdd, setFormAdd] = useState(emptyBarang);
  const [formEdit, setFormEdit] = useState(emptyBarang);

  const [filter, setFilter] = useState({
    kategori_id: "",
    stokMin: "",
    stokMax: "",
    status: "",
    show_transaksi: "",
    use_stok: "",
  });

  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);
  const filterFocusRef = useRef(null);

  useNavbar({ variant: "page", title: "Barang & Jasa", backTo: "/management", actions: [] }, []);

  useEffect(() => {
    document.title = "Barang & Jasa | Aplikasi";
  }, []);

  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .filter((it) => {
        const matchText =
          !term || it.nama.toLowerCase().includes(term) || (it.kode || "").toLowerCase().includes(term);
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

  const selected = useMemo(() => items.find((it) => it.id === selectedId) || null, [items, selectedId]);

  const handleSelect = useCallback((id) => setSelectedId(id), []);

  const handleOpenEdit = useCallback(() => {
    if (!selected) return;
    setFormEdit({ ...emptyBarang, ...selected });
    setOpenEdit(true);
  }, [selected]);

  const handleSaveEdit = useCallback(() => {
    update(formEdit.id, formEdit);
    setOpenEdit(false);
  }, [formEdit, update]);

  const handleOpenAdd = useCallback(() => {
    setFormAdd((prev) => ({ ...prev, id: Math.max(0, ...items.map((i) => i.id || 0)) + 1 }));
    setOpenAdd(true);
  }, [items]);

  const handleSaveAdd = useCallback(() => {
    create(formAdd);
    setOpenAdd(false);
  }, [formAdd, create]);

  const handleApplyFilter = useCallback(() => setOpenFilter(false), []);
  const handleResetFilter = useCallback(() => setFilter({ kategori_id: "", stokMin: "", stokMax: "", status: "", show_transaksi: "", use_stok: "" }), []);
  const handleRefresh = useCallback(() => refresh(), [refresh]);
  const handleCloseAdd = useCallback(() => setOpenAdd(false), []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: appBg }}>
      {variant === "B" ? renderLayoutB() : variant === "C" ? renderLayoutC() : renderLayoutA()}

      <Modal open={openAdd} title="Tambah Barang" onClose={handleCloseAdd} initialFocusRef={addFocusRef}>
        <BarangForm
          form={formAdd}
          setForm={setFormAdd}
          onClose={handleCloseAdd}
          onSubmit={handleSaveAdd}
          submitText="Simpan"
          initialFocusRef={addFocusRef}
          tokens={{ primary700, accent700, primary200, border }}
        />
      </Modal>

      <Modal open={openEdit} title="Edit Barang" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <BarangForm
          form={formEdit}
          setForm={setFormEdit}
          onSubmit={handleSaveEdit}
          submitText="Update"
          initialFocusRef={editFocusRef}
          tokens={{ primary700, accent700, primary200, border }}
        />
      </Modal>

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
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 rounded-lg border hover:opacity-90"
              style={{ borderColor: border }}
            >
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setOpenFilter(false)}
                className="px-4 py-2 rounded-lg border hover:opacity-90"
                style={{ borderColor: border }}
              >
                Batal
              </button>
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 rounded-lg text-white hover:opacity-95"
                style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );

  function renderLayoutA() {
    return (
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* LEFT - LIST */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden" style={{ background: card, borderRight: `1px solid ${border}` }}>
          <HeaderSearch q={q} setQ={setQ} onClear={() => setQ("")} primary700={primary700} primary200={primary200} border={border} text={text} />
          <CategoryChips primary200={primary200} accent700={accent700} border={border} text={text} textMuted={textMuted} />
          <ListItems items={filteredItems} selectedId={selectedId} onSelect={handleSelect} primary200={primary200} primary700={primary700} border={border} text={text} />
          <div className="p-4" style={{ background: card, borderTop: `1px solid ${border}` }}>
            <button
              onClick={handleOpenAdd}
              className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
              style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}
            >
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
                <button
                  onClick={handleOpenAdd}
                  className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
                  style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}
                >
                  TAMBAH BARANG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderLayoutC() {
    return (
      <div className="flex flex-1 flex-col lg:flex-row-reverse overflow-hidden">
        {/* RIGHT (list) */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden" style={{ background: card, borderLeft: `1px solid ${border}` }}>
          <HeaderSearch q={q} setQ={setQ} onClear={() => setQ("")} primary700={primary700} primary200={primary200} border={border} text={text} />
          <CategoryChips primary200={primary200} accent700={accent700} border={border} text={text} textMuted={textMuted} />
          <ListItems items={filteredItems} selectedId={selectedId} onSelect={handleSelect} primary200={primary200} primary700={primary700} border={border} text={text} />
          <div className="p-4" style={{ background: card, borderTop: `1px solid ${border}` }}>
            <button
              onClick={handleOpenAdd}
              className="w-full rounded-xl py-3 text-white font-semibold hover:opacity-95"
              style={{ background: `linear-gradient(90deg, ${primary700}, ${accent700})` }}
            >
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
