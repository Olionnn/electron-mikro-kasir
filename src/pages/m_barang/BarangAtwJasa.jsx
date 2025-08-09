import React, { useMemo, useRef, useState } from "react";
import { MdFilterList, MdAdd, MdEdit, MdRefresh, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from "../../component/Modal"; 

const rupiah = (v) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(v || 0)
  );

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

export default function BarangJasa() {
  // --- demo data (ganti dengan fetch API nanti)
  const [items, setItems] = useState([
    {
      id: 1,
      nama: "Beras",
      kode: "132312",
      stok: 9,
      harga_dasar: 11000,
      harga_jual: 13000,
      image: "",
      kategori_id: null,
      show_transaksi: true,
      use_stok: true,
      status: true,
      selected: true,
    },
    {
      id: 2,
      nama: "Kecap",
      kode: "666",
      stok: 10,
      harga_dasar: 3000,
      harga_jual: 4000,
      image: "",
      kategori_id: null,
      show_transaksi: true,
      use_stok: true,
      status: true,
      selected: false,
    },
    {
      id: 3,
      nama: "Beras 5KG",
      kode: "1312",
      stok: 5,
      harga_dasar: 65000,
      harga_jual: 70000,
      image: "",
      kategori_id: null,
      show_transaksi: true,
      use_stok: true,
      status: true,
      selected: false,
    },
  ]);

  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(items.find((i) => i.selected)?.id ?? items[0]?.id ?? null);

  // --- state modal
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // --- form states
  const [formAdd, setFormAdd] = useState(emptyBarang);
  const [formEdit, setFormEdit] = useState(emptyBarang);

  // --- filter state
  const [filter, setFilter] = useState({
    kategori_id: "",
    stokMin: "",
    stokMax: "",
    status: "",
    show_transaksi: "",
    use_stok: "",
  });

  // --- refs untuk auto focus modal
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);
  const filterFocusRef = useRef(null);

  // --- computed list
  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .filter((it) => {
        const matchText =
          !term ||
          it.nama.toLowerCase().includes(term) ||
          (it.kode || "").toLowerCase().includes(term);

        const inStokMin = filter.stokMin === "" || it.stok >= Number(filter.stokMin);
        const inStokMax = filter.stokMax === "" || it.stok <= Number(filter.stokMax);
        const matchStatus =
          filter.status === "" || String(it.status) === String(filter.status);
        const matchShow =
          filter.show_transaksi === "" ||
          String(it.show_transaksi) === String(filter.show_transaksi);
        const matchUse =
          filter.use_stok === "" || String(it.use_stok) === String(filter.use_stok);
        const matchKategori =
          filter.kategori_id === "" ||
          String(it.kategori_id || "") === String(filter.kategori_id);

        return matchText && inStokMin && inStokMax && matchStatus && matchShow && matchUse && matchKategori;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [items, q, filter]);

  const selected = useMemo(() => items.find((it) => it.id === selectedId) || null, [items, selectedId]);

  // --- handlers
  const handleSelect = (id) => setSelectedId(id);

  const handleOpenEdit = () => {
    if (!selected) return;
    setFormEdit({ ...emptyBarang, ...selected });
    setOpenEdit(true);
  };

  const handleSaveEdit = () => {
    // TODO: ganti ke API PUT / PATCH
    setItems((prev) => prev.map((i) => (i.id === formEdit.id ? { ...i, ...formEdit } : i)));
    setOpenEdit(false);
  };

  const handleOpenAdd = () => {
    setFormAdd({ ...emptyBarang, id: Math.max(0, ...items.map((i) => i.id || 0)) + 1 });
    setOpenAdd(true);
  };

  const handleSaveAdd = () => {
    // TODO: ganti ke API POST
    setItems((prev) => [{ ...formAdd }, ...prev]);
    setSelectedId(formAdd.id);
    setOpenAdd(false);
  };

  const handleApplyFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () =>
    setFilter({ kategori_id: "", stokMin: "", stokMax: "", status: "", show_transaksi: "", use_stok: "" });

  const handleRefresh = () => {
    // TODO: replace dengan refetch API
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* TOP BAR */}
      <div className="bg-white px-4 lg:px-6 py-3 lg:py-4 flex justify-between items-center border-b shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/management" className="text-2xl text-gray-700 hover:text-gray-900">←</Link>
          <h1 className="text-xl lg:text-2xl font-bold">Barang atau Jasa</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenFilter(true)}
            className="inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50"
            title="Filter Barang"
          >
            <MdFilterList size={20} />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
            title="Tambah Barang"
          >
            <MdAdd size={20} />
            <span className="hidden sm:inline">Tambah</span>
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100"
            title="Refresh (F5)"
          >
            <MdRefresh size={20} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* LEFT: LIST */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden bg-white border-r">
          {/* Search + chips */}
          <div className="p-4 lg:p-6 border-b bg-white">
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="text"
                  placeholder="Cari nama / kode barang…"
                  className="w-full pl-11 pr-4 py-3 text-base border rounded-xl focus:outline-green-500"
                />
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={22} />
              </div>
              <button
                className="bg-white text-gray-600 border border-green-400 px-4 rounded-lg hover:bg-green-50"
                onClick={() => setQ("")}
              >
                Bersihkan
              </button>
            </div>

            {/* contoh chip kategori (dummy) */}
            <div className="flex flex-wrap gap-2">
              {["Semua", "Sembako", "Minuman"].map((c, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    idx === 0 ? "bg-green-100 border-green-400 text-green-700" : "bg-white border-green-300 text-gray-700 hover:bg-green-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto p-4 lg:p-6 space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Tidak ada barang yang cocok dengan filter/pencarian.</div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`p-4 rounded-xl flex justify-between items-center text-base lg:text-lg font-medium cursor-pointer border transition
                    ${
                      selectedId === item.id
                        ? "bg-green-50 border-green-500 ring-1 ring-green-500"
                        : "bg-white border-gray-200 hover:border-green-300"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.nama}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="bg-gray-100 border border-gray-200 w-12 h-12 rounded-lg flex items-center justify-center font-bold">
                        {item.nama.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{item.nama}</div>
                      <div className="text-xs text-gray-500">Kode: {item.kode || "-"}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div>Stok: <span className="font-semibold">{item.stok}</span></div>
                    <div className="text-gray-700">{rupiah(item.harga_dasar)} - {rupiah(item.harga_jual)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA bawah */}
          <div className="p-4 bg-white border-t">
            <button
              onClick={handleOpenAdd}
              className="w-full bg-green-500 text-white text-lg lg:text-xl py-3 lg:py-4 rounded-xl font-bold hover:bg-green-600"
            >
              TAMBAH BARANG
            </button>
          </div>
        </div>

        {/* RIGHT: DETAIL */}
        <div className="w-full lg:w-[40%] overflow-y-auto p-4 lg:p-6 bg-gray-50">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-base lg:text-lg rounded-lg">
            ✏️ Untuk mengubah data barang, silakan buka{" "}
            <span className="text-blue-600 underline cursor-pointer">Kasir Pintar Dashboard</span>.
          </div>

          {selected ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {selected.image ? (
                    <img src={selected.image} alt={selected.nama} className="w-14 h-14 object-cover rounded-lg" />
                  ) : (
                    <div className="bg-gray-200 w-14 h-14 rounded-lg flex items-center justify-center font-bold text-2xl">
                      {selected.nama.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold">{selected.nama}</div>
                    <div className="text-gray-600 text-lg">Kode: {selected.kode || "-"}</div>
                  </div>
                </div>

                <button
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50"
                >
                  <MdEdit size={18} /> Edit
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-base lg:text-lg">
                <Info label="Harga Dasar" value={<strong>{rupiah(selected.harga_dasar)}</strong>} />
                <Info label="Harga Jual" value={<strong>{rupiah(selected.harga_jual)}</strong>} />
                <Info label="Diskon" value="0%" />
                <Info label="Berat" value="0 Gram" />
                <Info label="Stok" value={selected.stok} />
                <Info label="Stok Minimum" value="0" />
                <Info label="Kategori" value="-" />
                <Info label="Letak Rak" value="-" />
                <Info label="Keterangan" value="-" />
                <Info label="Tampil di Transaksi" value={selected.show_transaksi ? "Ya" : "Tidak"} />
                <Info label="Gunakan Manajemen Stok" value={selected.use_stok ? "Ya" : "Tidak"} />
                <Info label="Status" value={selected.status ? "Aktif" : "Nonaktif"} />
              </div>

              <button className="mt-6 w-full bg-blue-100 text-blue-900 text-center py-3 rounded-lg font-medium text-lg hover:bg-blue-200">
                ➔ LIHAT DETAIL STOK
              </button>
            </>
          ) : (
            <div className="text-gray-500">Pilih salah satu barang untuk melihat detailnya.</div>
          )}
        </div>
      </div>

      {/* MODAL: Tambah Barang */}
      <Modal open={openAdd} title="Tambah Barang" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <BarangForm
          form={formAdd}
          setForm={setFormAdd}
          onSubmit={handleSaveAdd}
          submitText="Simpan"
          initialFocusRef={addFocusRef}
        />
      </Modal>

      {/* MODAL: Edit Barang */}
      <Modal open={openEdit} title="Edit Barang" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <BarangForm
          form={formEdit}
          setForm={setFormEdit}
          onSubmit={handleSaveEdit}
          submitText="Update"
          initialFocusRef={editFocusRef}
        />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Barang" onClose={() => setOpenFilter(false)} initialFocusRef={filterFocusRef}>
        <div className="grid grid-cols-1 gap-3">
          <Labeled label="Kategori ID">
            <input
              ref={filterFocusRef}
              value={filter.kategori_id}
              onChange={(e) => setFilter((f) => ({ ...f, kategori_id: e.target.value }))}
              type="number"
              placeholder="Contoh: 10"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </Labeled>

          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Stok Min">
              <input
                value={filter.stokMin}
                onChange={(e) => setFilter((f) => ({ ...f, stokMin: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              />
            </Labeled>
            <Labeled label="Stok Max">
              <input
                value={filter.stokMax}
                onChange={(e) => setFilter((f) => ({ ...f, stokMax: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              />
            </Labeled>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Status">
              <select
                value={filter.status}
                onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              >
                <option value="">Semua</option>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </Labeled>
            <Labeled label="Tampil di Transaksi">
              <select
                value={filter.show_transaksi}
                onChange={(e) => setFilter((f) => ({ ...f, show_transaksi: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              >
                <option value="">Semua</option>
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </Labeled>
          </div>

          <Labeled label="Gunakan Manajemen Stok">
            <select
              value={filter.use_stok}
              onChange={(e) => setFilter((f) => ({ ...f, use_stok: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            >
              <option value="">Semua</option>
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </Labeled>

          <div className="flex items-center justify-between pt-2">
            <button onClick={handleResetFilter} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
              Reset
            </button>
            <div className="flex gap-2">
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
                Batal
              </button>
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------------- Sub Components ---------------------- */

function Info({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-3 border">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function BarangForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef }) {
  const handle = (key) => (e) => {
    const v = e.target.value;
    if (["stok", "harga_dasar", "harga_jual", "kategori_id", "toko_id", "created_by", "updated_by"].includes(key)) {
      setForm((f) => ({ ...f, [key]: v === "" ? "" : Number(v.replace?.(/\D/g, "") ?? v) }));
    } else {
      setForm((f) => ({ ...f, [key]: v }));
    }
  };

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
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          data-autofocus
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Kode">
          <input
            value={form.kode}
            onChange={handle("kode")}
            placeholder="Kode unik"
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>
        <Labeled label="Kategori ID">
          <input
            value={toNumber(form.kategori_id)}
            onChange={handle("kategori_id")}
            type="number"
            placeholder="Contoh: 10"
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>
        <Labeled label="Harga Jual">
          <input
            value={toNumber(form.harga_jual)}
            onChange={handle("harga_jual")}
            inputMode="numeric"
            placeholder="13000"
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>
        <Labeled label="Tampilkan di Transaksi">
          <div className="h-10 flex items-center px-3 border rounded-lg">
            <input type="checkbox" checked={!!form.show_transaksi} onChange={handleCheck("show_transaksi")} />
            <span className="ml-2">Ya</span>
          </div>
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Gunakan Manajemen Stok">
          <div className="h-10 flex items-center px-3 border rounded-lg">
            <input type="checkbox" checked={!!form.use_stok} onChange={handleCheck("use_stok")} />
            <span className="ml-2">Ya</span>
          </div>
        </Labeled>
        <Labeled label="Status Aktif">
          <div className="h-10 flex items-center px-3 border rounded-lg">
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
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </Labeled>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => history.back()}>
          Batal
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
          {submitText}
        </button>
      </div>
    </form>
  );
}