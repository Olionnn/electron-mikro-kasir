import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdAdd, MdRefresh, MdFilterList, MdEdit } from "react-icons/md";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";

const cx = (...a) => a.filter(Boolean).join(" ");
const today = () => new Date().toISOString().slice(0, 10);
const toInt = (v) => (v === "" || v == null ? "" : Number(String(v).replace(/\D/g, "")));

const emptyTax = {
  id: null,
  toko_id: 1,
  nama: "",
  pajak_persen: "",
  created_by: 1,
  updated_by: 1,
  created_at: today(),
  updated_at: today(),
};

export default function PajakPage() {
  // data (dummy fallback)
  const [taxes, setTaxes] = useState([
    { id: 1, toko_id: 10, nama: "PPN", pajak_persen: 11, created_by: 1, updated_by: 1, created_at: "2025-07-01", updated_at: "2025-08-01" },
    { id: 2, toko_id: 10, nama: "Pajak Jasa", pajak_persen: 5, created_by: 1, updated_by: 1, created_at: "2025-07-10", updated_at: "2025-08-05" },
  ]);
  const [selected, setSelected] = useState(null);

  // search & filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    toko_id: "",
    persenMin: "",
    persenMax: "",
  });

  // modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // forms
  const [formAdd, setFormAdd] = useState(emptyTax);
  const [formEdit, setFormEdit] = useState(emptyTax);

  // fetch (opsional electronAPI)
  const fetchTaxes = useCallback(async () => {
    if (!window.electronAPI?.getPajakList) return;
    try {
      const result = await window.electronAPI.getPajakList({
        pagination: { limit: 200, page: 1 },
        filter: { search },
      });
      const items = result?.data?.items || [];
      if (items.length) {
        setTaxes(items);
        setSelected((s) => (s ? items.find((i) => i.id === s.id) || items[0] : items[0] || null));
      }
    } catch (e) {
      console.error("getPajakList error:", e);
    }
  }, [search]);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  // Navbar actions
  const openTambah = useCallback(() => {
    const nextId = Math.max(0, ...taxes.map((t) => t.id || 0)) + 1;
    setFormAdd({ ...emptyTax, id: nextId });
    setOpenAdd(true);
  }, [taxes]);

  const doRefresh = useCallback(() => {
    setSelected(null);
    fetchTaxes();
  }, [fetchTaxes]);

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
        title: "Tambah Pajak",
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

  useNavbar({ variant: "page", title: "Pajak", backTo: "/management", actions }, [actions]);

  // filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = taxes;
    if (q) arr = arr.filter((t) => (t.nama || "").toLowerCase().includes(q) || String(t.pajak_persen || "").includes(q));
    if (filter.toko_id) arr = arr.filter((t) => String(t.toko_id || "") === String(filter.toko_id));
    if (filter.persenMin !== "") arr = arr.filter((t) => Number(t.pajak_persen || 0) >= Number(filter.persenMin));
    if (filter.persenMax !== "") arr = arr.filter((t) => Number(t.pajak_persen || 0) <= Number(filter.persenMax));
    return arr;
  }, [taxes, search, filter]);

  // edit
  const handleOpenEdit = useCallback(() => {
    if (!selected) return;
    setFormEdit({ ...emptyTax, ...selected });
    setOpenEdit(true);
  }, [selected]);

  const handleSaveAdd = useCallback(async () => {
    const payload = {
      ...formAdd,
      pajak_persen: Number(formAdd.pajak_persen || 0),
      updated_at: today(),
    };
    setTaxes((prev) => [payload, ...prev]);
    setSelected(payload);
    setOpenAdd(false);

    try {
      if (window.electronAPI?.createPajak) {
        await window.electronAPI.createPajak({
          nama: payload.nama,
          pajak_persen: payload.pajak_persen,
          toko_id: payload.toko_id,
          created_by: payload.created_by,
          updated_by: payload.updated_by,
        });
        await fetchTaxes();
      }
    } catch (e) {
      console.error("createPajak error:", e);
    }
  }, [formAdd, fetchTaxes]);

  const handleSaveEdit = useCallback(async () => {
    const payload = {
      ...formEdit,
      pajak_persen: Number(formEdit.pajak_persen || 0),
      updated_at: today(),
    };
    setTaxes((prev) => prev.map((t) => (t.id === payload.id ? payload : t)));
    setSelected(payload);
    setOpenEdit(false);

    try {
      if (window.electronAPI?.updatePajak) {
        await window.electronAPI.updatePajak(payload.id, {
          nama: payload.nama,
          pajak_persen: payload.pajak_persen,
          toko_id: payload.toko_id,
          updated_by: payload.updated_by,
        });
        await fetchTaxes();
      }
    } catch (e) {
      console.error("updatePajak error:", e);
    }
  }, [formEdit, fetchTaxes]);

  const clearFilters = useCallback(() => setFilter({ toko_id: "", persenMin: "", persenMax: "" }), []);

  // focus refs
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Kiri: search + list (scrollable) */}
      <div className="w-1/2 border-r flex flex-col bg-white">
        {/* search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau persen…"
              className="w-full h-11 pl-4 pr-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
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
            Menampilkan <b>{filtered.length}</b> dari {taxes.length} pajak
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">Tidak ada pajak yang cocok.</div>
          ) : (
            filtered.map((t) => {
              const active = selected?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t)}
                  className={cx(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active ? "border-violet-500 ring-1 ring-violet-500 bg-violet-50" : "border-gray-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div className={cx("w-1.5 rounded-l-xl", active ? "bg-violet-500" : "bg-gradient-to-b from-violet-400 to-blue-500")} />
                    <div className="flex-1 flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{t.nama}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{t.pajak_persen}%</div>
                      </div>
                      <span className="text-xs text-gray-500">Toko: {t.toko_id}</span>
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
                  Persentase • <span className="font-semibold">{selected.pajak_persen}%</span>
                </div>
              </div>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 bg-white border border-violet-500 text-violet-700 px-3 py-2 rounded-lg hover:bg-violet-50"
              >
                <MdEdit size={18} /> Edit
              </button>
            </div>

            {/* info grid */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Informasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Info label="Toko ID" value={selected.toko_id} />
                <Info label="Persentase" value={`${selected.pajak_persen}%`} />
              </div>
            </section>

            {/* meta */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Info label="Dibuat" value={selected.created_at || "-"} />
                <Info label="Diupdate" value={selected.updated_at || "-"} />
                {selected.created_by != null && <Info label="Created by (ID)" value={selected.created_by} />}
                {selected.updated_by != null && <Info label="Updated by (ID)" value={selected.updated_by} />}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Pilih salah satu pajak untuk melihat detail.</div>
        )}
      </div>

      {/* MODAL: Tambah */}
      <Modal open={openAdd} title="Tambah Pajak" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <PajakForm form={formAdd} setForm={setFormAdd} onSubmit={handleSaveAdd} submitText="Simpan" initialFocusRef={addFocusRef} />
      </Modal>

      {/* MODAL: Edit */}
      <Modal open={openEdit} title="Edit Pajak" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <PajakForm form={formEdit} setForm={setFormEdit} onSubmit={handleSaveEdit} submitText="Update" initialFocusRef={editFocusRef} />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Pajak" onClose={() => setOpenFilter(false)}>
        <div className="grid grid-cols-1 gap-3">
          <Labeled label="Toko ID">
            <input
              value={filter.toko_id}
              onChange={(e) => setFilter((f) => ({ ...f, toko_id: e.target.value.replace(/\D/g, "") }))}
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
              placeholder="cth: 10"
            />
          </Labeled>
          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Persen Min">
              <input
                value={filter.persenMin}
                onChange={(e) => setFilter((f) => ({ ...f, persenMin: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
                placeholder="0"
              />
            </Labeled>
            <Labeled label="Persen Max">
              <input
                value={filter.persenMax}
                onChange={(e) => setFilter((f) => ({ ...f, persenMax: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
                placeholder="100"
              />
            </Labeled>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button onClick={clearFilters} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Reset</button>
            <div className="flex gap-2">
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Batal</button>
              <button onClick={() => setOpenFilter(false)} className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600">Terapkan</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- sub components ---------- */

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

function PajakForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef }) {
  const txt = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const num = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === "" ? "" : toInt(e.target.value) }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!String(form.nama || "").trim()) return alert("Nama wajib diisi");
        const persen = Number(form.pajak_persen || 0);
        if (Number.isNaN(persen) || persen < 0 || persen > 100) return alert("Persentase 0–100");
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
          placeholder="cth: PPN"
          className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          data-autofocus
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Persentase (%) *">
          <input
            value={form.pajak_persen}
            onChange={num("pajak_persen")}
            inputMode="numeric"
            placeholder="cth: 11"
            className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          />
        </Labeled>
        <Labeled label="Toko ID *">
          <input
            value={form.toko_id}
            onChange={num("toko_id")}
            inputMode="numeric"
            placeholder="cth: 10"
            className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
          />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Created By (ID)">
          <input value={form.created_by} onChange={num("created_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
        <Labeled label="Updated By (ID)">
          <input value={form.updated_by} onChange={num("updated_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
      </div>

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