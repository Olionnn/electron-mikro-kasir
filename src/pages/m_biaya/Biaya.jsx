import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdFilterList, MdEdit } from "react-icons/md";

const toInt = (v) => (v === "" || v == null ? "" : Number(String(v).replace(/\D/g, "")));
const today = () => new Date().toISOString().slice(0, 10);
const cx = (...a) => a.filter(Boolean).join(" ");

const emptyExpense = {
  id: null,
  toko_id: 1,
  nama: "",
  nominal: "",
  created_by: 1,
  updated_by: 1,
  sync_at: null,
  status: true,
  created_at: today(),
  updated_at: today(),
};

export default function BiayaPage() {
  // dummy fallback
  const [expenses, setExpenses] = useState([
    { id: 1, toko_id: 10, nama: "Listrik", nominal: 350000, status: true, created_by: 1, updated_by: 1, created_at: "2025-07-02", updated_at: "2025-08-01", sync_at: null },
    { id: 2, toko_id: 10, nama: "Sewa Toko", nominal: 2500000, status: true, created_by: 1, updated_by: 2, created_at: "2025-07-05", updated_at: "2025-08-05", sync_at: "2025-08-06" },
    { id: 3, toko_id: 12, nama: "Air", nominal: 120000, status: false, created_by: 2, updated_by: 2, created_at: "2025-07-09", updated_at: "2025-08-03", sync_at: null },
  ]);
  const [selected, setSelected] = useState(null);

  // search & filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ toko_id: "", minNom: "", maxNom: "", status: "" });

  // modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // forms
  const [formAdd, setFormAdd] = useState(emptyExpense);
  const [formEdit, setFormEdit] = useState(emptyExpense);

  // fetch (opsional electronAPI)
  const fetchExpenses = useCallback(async () => {
    if (!window.electronAPI?.getBiayaList) return;
    try {
      const result = await window.electronAPI.getBiayaList({
        pagination: { limit: 200, page: 1 },
        filter: { search },
      });
      const items = result?.data?.items || [];
      if (items.length) {
        setExpenses(items);
        setSelected((s) => (s ? items.find((i) => i.id === s.id) || items[0] : items[0] || null));
      }
    } catch (e) {
      console.error("getBiayaList error:", e);
    }
  }, [search]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Navbar actions
  const openTambah = useCallback(() => {
    const nextId = Math.max(0, ...expenses.map((e) => e.id || 0)) + 1;
    setFormAdd({ ...emptyExpense, id: nextId });
    setOpenAdd(true);
  }, [expenses]);

  const doRefresh = useCallback(() => {
    setSelected(null);
    fetchExpenses();
  }, [fetchExpenses]);

  const openFilterModal = useCallback(() => setOpenFilter(true), []);

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
        title: "Tambah Biaya",
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

  useNavbar({ variant: "page", title: "Biaya", backTo: "/management", actions }, [actions]);

  // filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = expenses;
    if (q) arr = arr.filter((e) => (e.nama || "").toLowerCase().includes(q) || String(e.nominal || "").includes(q));
    if (filter.toko_id) arr = arr.filter((e) => String(e.toko_id || "") === String(filter.toko_id));
    if (filter.minNom !== "") arr = arr.filter((e) => Number(e.nominal || 0) >= Number(filter.minNom));
    if (filter.maxNom !== "") arr = arr.filter((e) => Number(e.nominal || 0) <= Number(filter.maxNom));
    if (filter.status !== "") arr = arr.filter((e) => String(e.status) === filter.status);
    return arr;
  }, [expenses, search, filter]);

  // edit
  const handleOpenEdit = useCallback(() => {
    if (!selected) return;
    setFormEdit({ ...emptyExpense, ...selected });
    setOpenEdit(true);
  }, [selected]);

  const handleSaveAdd = useCallback(async () => {
    const payload = {
      ...formAdd,
      nominal: Number(formAdd.nominal || 0),
      updated_at: today(),
    };
    setExpenses((prev) => [payload, ...prev]);
    setSelected(payload);
    setOpenAdd(false);

    try {
      if (window.electronAPI?.createBiaya) {
        await window.electronAPI.createBiaya({
          nama: payload.nama,
          nominal: payload.nominal,
          toko_id: payload.toko_id,
          created_by: payload.created_by,
          updated_by: payload.updated_by,
          status: payload.status,
        });
        await fetchExpenses();
      }
    } catch (e) {
      console.error("createBiaya error:", e);
    }
  }, [formAdd, fetchExpenses]);

  const handleSaveEdit = useCallback(async () => {
    const payload = {
      ...formEdit,
      nominal: Number(formEdit.nominal || 0),
      updated_at: today(),
    };
    setExpenses((prev) => prev.map((e) => (e.id === payload.id ? payload : e)));
    setSelected(payload);
    setOpenEdit(false);

    try {
      if (window.electronAPI?.updateBiaya) {
        await window.electronAPI.updateBiaya(payload.id, {
          nama: payload.nama,
          nominal: payload.nominal,
          toko_id: payload.toko_id,
          updated_by: payload.updated_by,
          status: payload.status,
        });
        await fetchExpenses();
      }
    } catch (e) {
      console.error("updateBiaya error:", e);
    }
  }, [formEdit, fetchExpenses]);

  const clearFilters = useCallback(
    () => setFilter({ toko_id: "", minNom: "", maxNom: "", status: "" }),
    []
  );

  // focus refs
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Kiri: search + list (scrollable only) */}
      <div className="w-1/2 border-r flex flex-col bg-white">
        {/* search */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau nominal…"
              className="w-full h-11 pl-4 pr-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
              >
                Bersihkan
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Menampilkan <b>{filtered.length}</b> dari {expenses.length} biaya
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">Tidak ada biaya yang cocok.</div>
          ) : (
            filtered.map((e) => {
              const active = selected?.id === e.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelected(e)}
                  className={cx(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active ? "border-green-500 ring-1 ring-green-500 bg-green-50" : "border-gray-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div className={cx("w-1.5 rounded-l-xl", active ? "bg-green-500" : "bg-gradient-to-b from-green-400 to-emerald-500")} />
                    <div className="flex-1 flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{e.nama}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Rp {Number(e.nominal || 0).toLocaleString()}</div>
                      </div>
                      <span className={cx("text-xs px-2 py-0.5 rounded-full", e.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {e.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Kanan: detail tanpa card */}
      <div className="w-1/2 p-6">
        {selected ? (
          <div className="space-y-6">
            {/* header + edit */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold">{selected.nama}</div>
                <div className="text-gray-600">
                  Nominal • <span className="font-semibold">Rp {Number(selected.nominal || 0).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50"
              >
                <MdEdit size={18} /> Edit
              </button>
            </div>

            {/* informasi */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Informasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Info label="Toko ID" value={selected.toko_id} />
                <Info label="Status" value={selected.status ? "Aktif" : "Nonaktif"} />
              </div>
            </section>

            {/* metadata */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Info label="Dibuat" value={selected.created_at || "-"} />
                <Info label="Diupdate" value={selected.updated_at || "-"} />
                {selected.sync_at && <Info label="Sync" value={selected.sync_at} />}
                {selected.created_by != null && <Info label="Created by (ID)" value={selected.created_by} />}
                {selected.updated_by != null && <Info label="Updated by (ID)" value={selected.updated_by} />}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Pilih salah satu biaya untuk melihat detail.</div>
        )}
      </div>

      {/* MODAL: Tambah */}
      <Modal open={openAdd} title="Tambah Biaya" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <BiayaForm form={formAdd} setForm={setFormAdd} onSubmit={handleSaveAdd} submitText="Simpan" initialFocusRef={addFocusRef} />
      </Modal>

      {/* MODAL: Edit */}
      <Modal open={openEdit} title="Edit Biaya" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <BiayaForm form={formEdit} setForm={setFormEdit} onSubmit={handleSaveEdit} submitText="Update" initialFocusRef={editFocusRef} />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Biaya" onClose={() => setOpenFilter(false)}>
        <div className="grid grid-cols-1 gap-3">
          <Labeled label="Toko ID">
            <input
              value={filter.toko_id}
              onChange={(e) => setFilter((f) => ({ ...f, toko_id: e.target.value.replace(/\D/g, "") }))}
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="cth: 10"
            />
          </Labeled>
          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Nominal Min (Rp)">
              <input
                value={filter.minNom}
                onChange={(e) => setFilter((f) => ({ ...f, minNom: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="0"
              />
            </Labeled>
            <Labeled label="Nominal Max (Rp)">
              <input
                value={filter.maxNom}
                onChange={(e) => setFilter((f) => ({ ...f, maxNom: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="1000000"
              />
            </Labeled>
          </div>
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

          <div className="flex items-center justify-between pt-2">
            <button onClick={clearFilters} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Reset</button>
            <div className="flex gap-2">
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Batal</button>
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">Terapkan</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* -------- sub components -------- */

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
}

function BiayaForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef }) {
  const txt = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const num = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === "" ? "" : toInt(e.target.value) }));
  const toggle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!String(form.nama || "").trim()) return alert("Nama wajib diisi");
        if (form.nominal === "" || Number.isNaN(Number(form.nominal))) return alert("Nominal wajib diisi");
        if (!form.toko_id) return alert("Toko ID wajib diisi");
        onSubmit?.();
      }}
      className="grid grid-cols-1 gap-3"
    >
      <Labeled label="Nama *">
        <input
          ref={initialFocusRef}
          value={form.nama}
          onChange={txt("nama")}
          placeholder="cth: Biaya Listrik"
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          data-autofocus
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Nominal (Rp) *">
          <input
            value={form.nominal}
            onChange={num("nominal")}
            inputMode="numeric"
            placeholder="50000"
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>
        <Labeled label="Toko ID *">
          <input
            value={form.toko_id}
            onChange={num("toko_id")}
            inputMode="numeric"
            placeholder="10"
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Created By (ID)">
          <input value={form.created_by} onChange={num("created_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-green-500" />
        </Labeled>
        <Labeled label="Updated By (ID)">
          <input value={form.updated_by} onChange={num("updated_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-green-500" />
        </Labeled>
      </div>

      <Labeled label="Aktif">
        <div className="h-10 flex items-center px-3 border rounded-lg">
          <input type="checkbox" checked={!!form.status} onChange={toggle("status")} />
          <span className="ml-2">Ya</span>
        </div>
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

// focus refs
const addFocusRef = React.createRef();
const editFocusRef = React.createRef();