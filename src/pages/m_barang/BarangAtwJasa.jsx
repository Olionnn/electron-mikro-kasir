// src/pages/management/BarangJasa.jsx
import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { MdFilterList, MdAdd, MdEdit, MdRefresh, MdSearch } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { Link } from "react-router-dom";

import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { useBarang } from "../../hooks/useBarang";
import Alert from "../../component/Alert"; // ← pakai komponen Alert kamu

// Helper tampilan
const rupiah = (v) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Number(v || 0));
const toNumber = (v) => (v === "" || v === null || v === undefined ? "" : Number(v));

// State awal form
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

export default function BarangJasa() {
  // Hook data barang (sudah urus loading, alert, pagination)
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
    getById,
    setAlert,
  } = useBarang({
    pagination: { page: 1, limit: 10 },
    filter: { search: "", status: "" },
  });

  // UI state sederhana
  const [q, setQ] = useState("");               // pencarian
  const [selectedId, setSelectedId] = useState(null); // item terpilih (panel kanan)
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [formAdd, setFormAdd] = useState(emptyBarang);
  const [formEdit, setFormEdit] = useState(emptyBarang);
  const [filter, setFilter] = useState({ status: "" }); // filter sederhana

  // focus input saat modal dibuka
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);
  const filterFocusRef = useRef(null);

  // ambil toko dari localStorage (biar FK toko_id valid)
  const au = JSON.parse(localStorage.getItem("au") || "null");

  // Navbar sederhana
  const actions = useMemo(
    () => [
      { title: "Filter",   onClick: () => setOpenFilter(true), icon: <MdFilterList size={18} /> },
      { title: "Tambah",   onClick: () => setOpenAdd(true),    icon: <MdAdd size={18} /> },
      { title: "Refresh",  onClick: () => refresh({ pagination: { page: 1, limit: pagination.limit || 10 }, filter: { search: q, status: filter.status } }), icon: <MdRefresh size={18} /> },
    ],
    [q, filter.status, pagination.limit, refresh]
  );
  useNavbar({ variant: "page", title: "Barang & Jasa", backTo: "/management", actions }, [actions]);

  useEffect(() => { document.title = "Barang & Jasa | Aplikasi"; }, []);

  // pilih item
  const selected = useMemo(() => items.find((it) => it.id === selectedId) || null, [items, selectedId]);
  const handleSelect = (id) => setSelectedId(id);

  // pencarian (debounce sederhana)
  useEffect(() => {
    const t = setTimeout(() => {
      refresh({ pagination: { page: 1, limit: pagination.limit || 10 }, filter: { search: q, status: filter.status } });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // filter
  const applyFilter = () => {
    refresh({ pagination: { page: 1, limit: pagination.limit || 10 }, filter: { search: q, status: filter.status } });
    setOpenFilter(false);
  };
  const resetFilter = () => setFilter({ status: "" });

  // CRUD
  const saveAdd = async () => {
    try {
      await create({ ...formAdd, toko_id: au?.user?.toko_id ?? null });
      setOpenAdd(false);
    } catch {}
  };

  const handleOpenEdit = async () => {
    if (!selectedId) return;
    try {
      const detail = await getById(selectedId);
      setFormEdit({ ...emptyBarang, ...detail });
      setOpenEdit(true);
    } catch {
      setAlert({ type: "error", message: "Gagal mengambil detail barang" });
    }
  };

  const saveEdit = async () => {
    if (!formEdit?.id) return;
    try {
      await update(formEdit.id, formEdit);
      setOpenEdit(false);
    } catch {}
  };

  const doDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm("Hapus barang ini?")) return;
    try {
      await remove(selectedId);
      setSelectedId(null);
    } catch {}
  };

  // pagination
  const goPage = (next) => {
    const page = Math.min(Math.max(1, next), pagination.pages || 1);
    refresh({ pagination: { page, limit: pagination.limit || 10 }, filter: { search: q, status: filter.status } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC]">
      {/* ALERT: pakai komponen kamu */}
      {alert?.message && (
        <Alert type={alert?.type || "info"} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      {error && !alert?.message && (
        <Alert type="error" onClose={() => setAlert(null)}>
          {String(error?.message || "Terjadi kesalahan")}
        </Alert>
      )}

      {/* Layout A: kiri list, kanan detail */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden mt-4">
        {/* KIRI: List + pencarian + pagination */}
        <div className="w-full lg:w-[60%] flex flex-col bg-white border-r border-[#E6E8F0]">
          {/* Pencarian */}
          <div className="flex gap-3 p-4 border-b border-[#E6E8F0]">
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                disabled={loading}
                placeholder="Cari nama / kode barang…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E6E8F0] outline-none"
              />
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" size={18} />
            </div>
            <button onClick={() => setQ("")} disabled={loading} className="rounded-lg border px-4 text-sm">
              Bersihkan
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="p-6 text-center text-sm">Memuat data…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">Tidak ada barang.</div>
          ) : (
            <div className="overflow-y-auto p-4 space-y-3">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => handleSelect(it.id)}
                  className={`w-full text-left p-4 rounded-xl border transition shadow-sm hover:shadow-md ${
                    selectedId === it.id ? "bg-violet-50 border-violet-600" : "bg-white border-[#E6E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {it.image ? (
                        <img src={it.image} alt={it.nama} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg grid place-items-center font-bold bg-[#F2F4F7] border border-[#E6E8F0]">
                          {String(it.nama || "?").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{it.nama}</div>
                        <div className="text-xs text-slate-600">Kode: {it.kode || "-"}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Stok: <b>{it.stok}</b></div>
                      <div>{rupiah(it.harga_dasar)} - {rupiah(it.harga_jual)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination + Tambah */}
          <div className="p-4 border-t border-[#E6E8F0] space-y-3">
            <Pagination pagination={pagination} onPrev={() => goPage(pagination.page - 1)} onNext={() => goPage(pagination.page + 1)} disabled={loading} />
            <button
              onClick={() => { setFormAdd(emptyBarang); setOpenAdd(true); }}
              disabled={loading}
              className="w-full rounded-xl py-3 text-white font-semibold bg-gradient-to-r from-violet-700 to-indigo-800 disabled:opacity-60"
            >
              TAMBAH BARANG
            </button>
          </div>
        </div>

        {/* KANAN: Detail */}
        <div className="w-full lg:w-[40%] overflow-y-auto p-4 lg:p-6">
          {selected ? (
            <Detail
              data={selected}
              onEdit={handleOpenEdit}
              onDelete={doDelete}
              loading={loading}
            />
          ) : (
            <div className="rounded-2xl border border-dashed p-6 text-center text-slate-500 bg-white">
              Pilih salah satu barang untuk melihat detailnya.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Tambah */}
      <Modal open={openAdd} title="Tambah Barang" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <BarangForm
          form={formAdd}
          setForm={setFormAdd}
          onClose={() => setOpenAdd(false)}
          onSubmit={saveAdd}
          submitText={loading ? "Menyimpan..." : "Simpan"}
          initialFocusRef={addFocusRef}
          disabled={loading}
        />
      </Modal>

      {/* MODAL: Edit */}
      <Modal open={openEdit} title="Edit Barang" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <BarangForm
          form={formEdit}
          setForm={setFormEdit}
          onSubmit={saveEdit}
          submitText={loading ? "Menyimpan..." : "Update"}
          initialFocusRef={editFocusRef}
          disabled={loading}
        />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Barang" onClose={() => setOpenFilter(false)} initialFocusRef={filterFocusRef}>
        <div className="grid gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-600">Status</span>
            <select
              ref={filterFocusRef}
              value={filter.status}
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#E6E8F0] outline-none"
            >
              <option value="">Semua</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </label>

          <div className="flex items-center justify-between pt-2">
            <button onClick={resetFilter} className="px-4 py-2 rounded-lg border border-[#E6E8F0]">Reset</button>
            <div className="flex gap-2">
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg border border-[#E6E8F0]">Batal</button>
              <button onClick={applyFilter} className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-violet-700 to-indigo-800">
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ==== KOMPONEN KECIL (simple & mudah dibaca) ==== */

function Detail({ data, onEdit, onDelete, loading }) {
  return (
    <div className="rounded-2xl p-4 lg:p-6 shadow-sm bg-white border border-[#E6E8F0]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {data.image ? (
            <img src={data.image} alt={data.nama} className="w-14 h-14 object-cover rounded-lg" />
          ) : (
            <div className="w-14 h-14 rounded-lg grid place-items-center font-bold text-2xl bg-violet-50 text-violet-700">
              {String(data.nama || "?").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-2xl font-bold">{data.nama}</div>
            <div className="text-sm text-slate-600">Kode: {data.kode || "-"}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-400 bg-red-50 text-red-700 disabled:opacity-60"
            title="Hapus"
          >
            <VscTrash size={18} />
          </button>
          <button
            onClick={onEdit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-700 text-violet-700 bg-violet-50 disabled:opacity-60"
            title="Edit"
          >
            <MdEdit size={18} /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
        <Info label="Harga Dasar" value={<b>{rupiah(data.harga_dasar)}</b>} />
        <Info label="Harga Jual" value={<b>{rupiah(data.harga_jual)}</b>} />
        <Info label="Stok" value={data.stok} />
        <Info label="Kategori" value={data.kategori_id ?? "-"} />
        <Info label="Tampil di Transaksi" value={data.show_transaksi ? "Ya" : "Tidak"} />
        <Info label="Gunakan Manajemen Stok" value={data.use_stok ? "Ya" : "Tidak"} />
        <Info label="Status" value={data.status ? "Aktif" : "Nonaktif"} />
      </div>

      <Link
        to={`/stok/${data.id}`}
        className="mt-6 block w-full rounded-xl text-center font-medium py-3 bg-violet-100 hover:bg-violet-200 text-violet-900"
      >
        ➔ LIHAT DETAIL STOK
      </Link>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl p-3 border border-[#E6E8F0] bg-white">
      <div className="text-xs mb-1 text-slate-500">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function Pagination({ pagination, onPrev, onNext, disabled }) {
  const { page = 1, pages = 1, total = 0 } = pagination || {};
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Halaman <b className="text-slate-800">{page}</b> dari <b className="text-slate-800">{pages}</b> • Total <b className="text-slate-800">{total}</b> data
      </div>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={disabled || page <= 1} className="px-3 py-2 rounded-lg border border-[#E6E8F0] disabled:opacity-60">
          Prev
        </button>
        <button onClick={onNext} disabled={disabled || page >= pages} className="px-3 py-2 rounded-lg border border-[#E6E8F0] disabled:opacity-60">
          Next
        </button>
      </div>
    </div>
  );
}

function BarangForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef, onClose, disabled }) {
  const numField = (key, placeholder) => (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-600">{key.replace("_", " ").toUpperCase()}</span>
      <input
        value={toNumber(form[key])}
        onChange={(e) => {
          const raw = e.target.value;
          const cleaned = typeof raw === "string" ? raw.replace(/\D/g, "") : raw;
          setForm((f) => ({ ...f, [key]: cleaned === "" ? "" : Number(cleaned) }));
        }}
        inputMode="numeric"
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg border border-[#E6E8F0] outline-none disabled:opacity-60"
      />
    </label>
  );

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (!disabled) onSubmit?.(); }}
      className="grid gap-3"
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm text-slate-600">NAMA</span>
        <input
          ref={initialFocusRef}
          value={form.nama}
          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
          placeholder="Nama barang"
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg border border-[#E6E8F0] outline-none disabled:opacity-60"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-600">KODE</span>
          <input
            value={form.kode}
            onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))}
            placeholder="Kode unik"
            disabled={disabled}
            className="w-full px-3 py-2 rounded-lg border border-[#E6E8F0] outline-none disabled:opacity-60"
          />
        </label>
        {numField("kategori_id", "Contoh: 10")}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {numField("harga_dasar", "11000")}
        {numField("harga_jual", "13000")}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {numField("stok", "0")}
        <label className="flex items-center gap-3 h-10 px-3 rounded-lg border border-[#E6E8F0]">
          <input
            type="checkbox"
            checked={!!form.show_transaksi}
            onChange={(e) => setForm((f) => ({ ...f, show_transaksi: e.target.checked }))}
            disabled={disabled}
          />
          <span className="text-sm">Tampil di Transaksi</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-3 h-10 px-3 rounded-lg border border-[#E6E8F0]">
          <input
            type="checkbox"
            checked={!!form.use_stok}
            onChange={(e) => setForm((f) => ({ ...f, use_stok: e.target.checked }))}
            disabled={disabled}
          />
          <span className="text-sm">Gunakan Manajemen Stok</span>
        </label>
        <label className="flex items-center gap-3 h-10 px-3 rounded-lg border border-[#E6E8F0]">
          <input
            type="checkbox"
            checked={!!form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))}
            disabled={disabled}
          />
          <span className="text-sm">Status Aktif</span>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-slate-600">URL GAMBAR (opsional)</span>
        <input
          value={form.image || ""}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          placeholder="https://…"
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg border border-[#E6E8F0] outline-none disabled:opacity-60"
        />
      </label>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} disabled={disabled} className="px-4 py-2 rounded-lg border border-[#E6E8F0] hover:bg-slate-50">
          Batal
        </button>
        <button type="submit" disabled={disabled} className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-violet-700 to-indigo-800 disabled:opacity-60">
          {submitText}
        </button>
      </div>
    </form>
  );
}