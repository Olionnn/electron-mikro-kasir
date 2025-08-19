import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  FiRefreshCw, FiFilter, FiMail, FiPhone, FiMapPin, FiUser, FiHash
} from "react-icons/fi";
import { MdAdd, MdRefresh, MdFilterList, MdEdit } from "react-icons/md";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";

const cx = (...a) => a.filter(Boolean).join(" ");
const toInt = (v) => (v === "" || v === null || v === undefined ? "" : Number(String(v).replace(/\D/g, "")));
const toStr = (v) => (v ?? "");
const today = () => new Date().toISOString().slice(0, 10);

const emptySupplier = {
  id: null,
  toko_id: 1,
  nama: "",
  email: "",
  no_telp: "",
  alamat: "",
  image: "",
  created_by: 1,
  updated_by: 1,
  sync_at: null,
  status: true,
  created_at: today(),
  updated_at: today(),
};

export default function SupplierPage() {
  // ----- DUMMY DATA (sesuai model) -----
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      toko_id: 10,
      nama: "PT Maju Jaya",
      email: "info@majujaya.com",
      no_telp: "021-123456",
      alamat: "Jl. Industri No. 5, Jakarta",
      image: "",
      created_by: 1,
      updated_by: 2,
      sync_at: "2025-08-01",
      status: true,
      created_at: "2025-07-10",
      updated_at: "2025-08-08",
      kode: "SUP001", // opsional di UI (bukan di model), bisa dihitung/ditampilkan jika kamu punya.
    },
    {
      id: 2,
      toko_id: 12,
      nama: "CV Sumber Makmur",
      email: "sumbermakmur@mail.com",
      no_telp: "022-987654",
      alamat: "Jl. Pasar Baru No. 12, Bandung",
      image: "",
      created_by: 1,
      updated_by: 1,
      sync_at: null,
      status: false,
      created_at: "2025-07-15",
      updated_at: "2025-08-07",
      kode: "SUP002",
    },
  ]);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  // modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // forms
  const [formAdd, setFormAdd] = useState(emptySupplier);
  const [formEdit, setFormEdit] = useState(emptySupplier);

  // filter
  const [filter, setFilter] = useState({
    status: "", // "", "true", "false"
    hasEmail: "", // "", "true", "false"
    toko_id: "",
  });

  // handlers stabil untuk Navbar
  const doRefresh = useCallback(() => {
    // dummy refresh: reset selection
    setSelected(null);
  }, []);
  const openTambah = useCallback(() => {
    const nextId = Math.max(0, ...suppliers.map((s) => s.id || 0)) + 1;
    setFormAdd({ ...emptySupplier, id: nextId });
    setOpenAdd(true);
  }, [suppliers]);
  const openFilterModal = useCallback(() => setOpenFilter(true), []);

  // Navbar actions
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter",
        onClick: openFilterModal,
        className:
          "inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50",
        icon: <MdFilterList size={20} />,
      },
      {
        type: "button",
        title: "Tambah Supplier",
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
    [openFilterModal, openTambah, doRefresh]
  );

  useNavbar({ variant: "page", title: "Supplier", backTo: "/management", actions }, [actions]);

  // list hasil filter + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = suppliers;

    if (q) {
      arr = arr.filter(
        (s) =>
          (s.nama || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.no_telp || "").toLowerCase().includes(q) ||
          (s.kode || "").toLowerCase().includes(q)
      );
    }
    if (filter.status !== "") arr = arr.filter((s) => String(s.status) === filter.status);
    if (filter.hasEmail !== "") arr = arr.filter((s) => (filter.hasEmail === "true" ? !!s.email : !s.email));
    if (filter.toko_id) arr = arr.filter((s) => String(s.toko_id || "") === String(filter.toko_id));
    return arr;
  }, [suppliers, search, filter]);

  // edit
  const handleOpenEdit = useCallback(() => {
    if (!selected) return;
    setFormEdit({ ...emptySupplier, ...selected });
    setOpenEdit(true);
  }, [selected]);

  const handleSaveAdd = useCallback(() => {
    setSuppliers((prev) => [formAdd, ...prev]);
    setSelected(formAdd);
    setOpenAdd(false);
  }, [formAdd]);

  const handleSaveEdit = useCallback(() => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === formEdit.id ? { ...s, ...formEdit, updated_at: today() } : s
      )
    );
    setSelected({ ...formEdit });
    setOpenEdit(false);
  }, [formEdit]);

  const clearFilters = useCallback(() => setFilter({ status: "", hasEmail: "", toko_id: "" }), []);

  // focus refs (dipakai Modal untuk autofocus pertama kali buka)
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);

  return (
    <div className="flex h-full bg-gray-50">
      {/* KIRI: Header kecil + Search + List (list scrollable) */}
      <div className="w-1/2 border-r flex flex-col bg-white">

        {/* Search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama / email / telp / kode…"
              className="w-full h-11 pl-4 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
              >
                Bersihkan
              </button>
            )}
            <button
              onClick={openFilterModal}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border text-violet-700 bg-white hover:bg-green-50"
              title="Filter"
            >
              <FiFilter />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Menampilkan <b>{filtered.length}</b> dari {suppliers.length} supplier
          </div>
        </div>

        {/* List (scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Tidak ada supplier yang cocok.
            </div>
          ) : (
            filtered.map((sup) => {
              const active = selected?.id === sup.id;
              return (
                <button
                  key={sup.id}
                  type="button"
                  onClick={() => setSelected(sup)}
                  className={cx(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active
                      ? "border-violet-500 ring-1 ring-violet-500 bg-violet-50"
                      : "border-gray-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div
                      className={cx(
                        "w-1.5 rounded-l-xl",
                        active ? "bg-violet-500" : "bg-gradient-to-b from-violet-400 to-blue-500"
                      )}
                    />
                    <div className="flex-1 flex items-center gap-3 p-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-md flex items-center justify-center">
                        <span className="text-violet-600 font-bold">
                          {(sup.nama || "S").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-800 truncate">
                          {sup.nama}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {sup.email || sup.no_telp || "-"}
                        </div>
                      </div>
                      <span
                        className={cx(
                          "text-xs px-2 py-1 rounded-full",
                          sup.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        )}
                      >
                        {sup.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* KANAN: DETAIL TANPA CARD */}
      <div className="w-1/2 p-6">
        {selected ? (
          <div className="space-y-6">
            {/* Header: foto + nama + tombol edit */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.nama}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-3xl text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold">{selected.nama}</div>
                  {/* kode opsional */}
                  {selected.kode && (
                    <div className="text-gray-600">Kode: {selected.kode}</div>
                  )}
                </div>
              </div>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 bg-white border border-violet-500 text-violet-700 px-3 py-2 rounded-lg hover:bg-violet-50"
              >
                <MdEdit size={18} /> Edit
              </button>
            </div>

            {/* Status */}
            <div>
              <span
                className={cx(
                  "text-xs px-2 py-1 rounded-full",
                  selected.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}
              >
                {selected.status ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Info grid */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Informasi Utama
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoPlain icon={<FiHash className="text-violet-600" />} label="Toko ID" value={selected.toko_id} />
                <InfoPlain icon={<FiMail className="text-violet-600" />} label="Email" value={selected.email || "-"} />
                <InfoPlain icon={<FiPhone className="text-violet-600" />} label="No. Telp" value={selected.no_telp || "-"} />
                <InfoPlain icon={<FiMapPin className="text-violet-600" />} label="Alamat" value={selected.alamat || "-"} wide />
              </div>
            </section>

            {/* Meta */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoPlain label="Dibuat" value={selected.created_at || "-"} />
                <InfoPlain label="Diupdate" value={selected.updated_at || "-"} />
                {selected.created_by != null && (
                  <InfoPlain label="Created by (ID)" value={selected.created_by} />
                )}
                {selected.updated_by != null && (
                  <InfoPlain label="Updated by (ID)" value={selected.updated_by} />
                )}
                {selected.sync_at && (
                  <InfoPlain label="Sync" value={selected.sync_at} wide />
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Belum ada data supplier terpilih
          </div>
        )}
      </div>

      {/* MODAL: Tambah Supplier */}
      <Modal open={openAdd} title="Tambah Supplier" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <SupplierForm
          form={formAdd}
          setForm={setFormAdd}
          onSubmit={handleSaveAdd}
          submitText="Simpan"
          initialFocusRef={addFocusRef}
        />
      </Modal>

      {/* MODAL: Edit Supplier */}
      <Modal open={openEdit} title="Edit Supplier" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <SupplierForm
          form={formEdit}
          setForm={setFormEdit}
          onSubmit={handleSaveEdit}
          submitText="Update"
          initialFocusRef={editFocusRef}
        />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Supplier" onClose={() => setOpenFilter(false)}>
        <div className="grid grid-cols-1 gap-3">
          <Labeled label="Status">
            <select
              value={filter.status}
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
            >
              <option value="">Semua</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </Labeled>

          <Labeled label="Memiliki Email">
            <select
              value={filter.hasEmail}
              onChange={(e) => setFilter((f) => ({ ...f, hasEmail: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
            >
              <option value="">Semua</option>
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </Labeled>

          <Labeled label="Toko ID">
            <input
              value={filter.toko_id}
              onChange={(e) =>
                setFilter((f) => ({ ...f, toko_id: e.target.value.replace(/\D/g, "") }))
              }
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
              placeholder="cth: 10"
            />
          </Labeled>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setOpenFilter(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => setOpenFilter(false)}
                className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600"
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

/* ---------- Subcomponents ---------- */

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function InfoPlain({ icon, label, value, wide = false }) {
  return (
    <div className={cx("rounded-lg border border-gray-200 p-3", wide && "md:col-span-2")}>
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
        {icon} <span>{label}</span>
      </div>
      <div className="font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
}

function SupplierForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef }) {
  const txt = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const num = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === "" ? "" : toInt(e.target.value) }));
  const chk = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!toStr(form.nama).trim()) return alert("Nama wajib diisi");
        if (!form.toko_id) return alert("Toko ID wajib diisi");
        onSubmit?.();
      }}
      className="grid grid-cols-1 gap-3"
    >
      <Labeled label="Nama *">
        <input
          ref={initialFocusRef}
          value={toStr(form.nama)}
          onChange={txt("nama")}
          placeholder="Nama supplier"
          className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          data-autofocus
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Toko ID *">
          <input
            value={toInt(form.toko_id)}
            onChange={num("toko_id")}
            inputMode="numeric"
            placeholder="cth: 10"
            className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          />
        </Labeled>
        <Labeled label="Email">
          <input
            value={toStr(form.email)}
            onChange={txt("email")}
            type="email"
            placeholder="email@contoh.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="No. Telp">
          <input
            value={toStr(form.no_telp)}
            onChange={txt("no_telp")}
            placeholder="021-xxxxx / 08xxxx"
            className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          />
        </Labeled>
        <Labeled label="Status Aktif">
          <div className="h-10 flex items-center px-3 border rounded-lg">
            <input type="checkbox" checked={!!form.status} onChange={chk("status")} />
            <span className="ml-2">Aktif</span>
          </div>
        </Labeled>
      </div>

      <Labeled label="Alamat">
        <input
          value={toStr(form.alamat)}
          onChange={txt("alamat")}
          placeholder="Alamat supplier"
          className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
        />
      </Labeled>

      <Labeled label="URL Logo / Foto (opsional)">
        <input
          value={toStr(form.image)}
          onChange={txt("image")}
          placeholder="https://…"
          className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Created By (ID)">
          <input value={toInt(form.created_by)} onChange={num("created_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
        <Labeled label="Updated By (ID)">
          <input value={toInt(form.updated_by)} onChange={num("updated_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
      </div>

      <Labeled label="Sync At (ISO Date)">
        <input
          value={toStr(form.sync_at || "")}
          onChange={txt("sync_at")}
          placeholder="2025-08-01"
          className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
        />
      </Labeled>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => history.back()}>
          Batal
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600">
          {submitText}
        </button>
      </div>
    </form>
  );
}