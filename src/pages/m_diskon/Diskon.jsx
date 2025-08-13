import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MdAdd, MdRefresh, MdFilterList, MdEdit } from "react-icons/md";
import { FiPercent, FiHash, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";

// util kecil
const cx = (...a) => a.filter(Boolean).join(" ");
const toInt = (v) => (v === "" || v === null || v === undefined ? "" : Number(String(v).replace(/\D/g, "")));
const today = () => new Date().toISOString().slice(0, 10);
const fmtRp = (n) => new Intl.NumberFormat("id-ID").format(Number(n || 0));
const labelJenis = (j) => (String(j) === "1" ? "Persentase" : "Nominal");
const showJumlah = (j, val) => (String(j) === "1" ? `${val}%` : `Rp ${fmtRp(val)}`);

const emptyDiskon = {
  id: null,
  toko_id: 1,
  nama: "",
  jumlah: "",
  jenis_diskon: "1", // "1" persen | "2" nominal
  created_by: 1,
  updated_by: 1,
  sync_at: "",
  status: true,
  created_at: today(),
  updated_at: today(),
};

export default function DiskonPage() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      toko_id: 10,
      nama: "Promo Akhir Pekan",
      jumlah: 10,
      jenis_diskon: 1,
      created_by: 1,
      updated_by: 1,
      sync_at: null,
      status: true,
      created_at: "2025-07-01",
      updated_at: "2025-08-01",
    },
    {
      id: 2,
      toko_id: 10,
      nama: "Voucher 50rb",
      jumlah: 50000,
      jenis_diskon: 2,
      created_by: 1,
      updated_by: 2,
      sync_at: null,
      status: false,
      created_at: "2025-07-10",
      updated_at: "2025-08-05",
    },
  ]);
  const [selected, setSelected] = useState(null);

  // --- search & filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    jenis_diskon: "", // "", "1", "2"
    status: "", // "", "true", "false"
    toko_id: "",
  });

  // --- modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // --- forms
  const [formAdd, setFormAdd] = useState(emptyDiskon);
  const [formEdit, setFormEdit] = useState(emptyDiskon);

  // --- fetch (jika electronAPI tersedia)
  const fetchDiscounts = useCallback(async () => {
    if (!window.electronAPI?.getDiskonList) return; // pakai dummy
    try {
      const result = await window.electronAPI.getDiskonList({
        pagination: { limit: 200, page: 1 },
        filter: { search },
      });
      const items = result?.data?.items || [];
      if (items.length) {
        setDiscounts(items);
        setSelected((s) => (s ? items.find((i) => i.id === s.id) || items[0] : items[0] || null));
      }
    } catch (e) {
      console.error("fetch discounts error", e);
    }
  }, [search]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // --- Navbar actions
  const openTambah = useCallback(() => {
    const nextId = Math.max(0, ...discounts.map((d) => d.id || 0)) + 1;
    setFormAdd({ ...emptyDiskon, id: nextId });
    setOpenAdd(true);
  }, [discounts]);

  const doRefresh = useCallback(() => {
    setSelected(null);
    fetchDiscounts();
  }, [fetchDiscounts]);

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
        title: "Tambah Diskon",
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

  useNavbar({ variant: "page", title: "Diskon", backTo: "/management", actions }, [actions]);

  // --- filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = discounts;

    if (q) {
      arr = arr.filter(
        (d) =>
          (d.nama || "").toLowerCase().includes(q) ||
          String(d.jumlah || "").includes(q)
      );
    }
    if (filter.jenis_diskon) arr = arr.filter((d) => String(d.jenis_diskon) === String(filter.jenis_diskon));
    if (filter.status) arr = arr.filter((d) => String(d.status) === filter.status);
    if (filter.toko_id) arr = arr.filter((d) => String(d.toko_id || "") === String(filter.toko_id));

    return arr;
  }, [discounts, search, filter]);

  // --- edit
  const handleOpenEdit = useCallback(() => {
    if (!selected) return;
    setFormEdit({
      ...emptyDiskon,
      ...selected,
      jenis_diskon: String(selected.jenis_diskon || "1"),
    });
    setOpenEdit(true);
  }, [selected]);

  const handleSaveAdd = useCallback(async () => {
    const payload = {
      ...formAdd,
      jumlah: Number(formAdd.jumlah || 0),
      jenis_diskon: Number(formAdd.jenis_diskon || 1),
      updated_at: today(),
    };
    // kalau ada API, kirim. Di sini kita langsung local update:
    setDiscounts((prev) => [payload, ...prev]);
    setSelected(payload);
    setOpenAdd(false);

    try {
      if (window.electronAPI?.createDiskon) {
        await window.electronAPI.createDiskon({
          nama: payload.nama,
          jumlah: payload.jumlah,
          jenis_diskon: payload.jenis_diskon,
          toko_id: payload.toko_id,
          status: payload.status,
          created_by: payload.created_by,
          updated_by: payload.updated_by,
          sync_at: payload.sync_at || null,
        });
        await fetchDiscounts();
      }
    } catch (e) {
      console.error("createDiskon error:", e);
    }
  }, [formAdd, fetchDiscounts]);

  const handleSaveEdit = useCallback(async () => {
    const payload = {
      ...formEdit,
      jumlah: Number(formEdit.jumlah || 0),
      jenis_diskon: Number(formEdit.jenis_diskon || 1),
      updated_at: today(),
    };
    setDiscounts((prev) => prev.map((d) => (d.id === payload.id ? payload : d)));
    setSelected(payload);
    setOpenEdit(false);

    try {
      if (window.electronAPI?.updateDiskon) {
        await window.electronAPI.updateDiskon(payload.id, {
          nama: payload.nama,
          jumlah: payload.jumlah,
          jenis_diskon: payload.jenis_diskon,
          toko_id: payload.toko_id,
          status: payload.status,
          updated_by: payload.updated_by,
          sync_at: payload.sync_at || null,
        });
        await fetchDiscounts();
      }
    } catch (e) {
      console.error("updateDiskon error:", e);
    }
  }, [formEdit, fetchDiscounts]);

  const clearFilters = useCallback(() => setFilter({ jenis_diskon: "", status: "", toko_id: "" }), []);

  // focus refs untuk Modal
  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);

  return (
    <div className="flex h-full bg-gray-50">
      {/* KIRI: search + list (scrollable) */}
      <div className="w-1/2 border-r flex flex-col bg-white">
        {/* search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau jumlah…"
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
            Menampilkan <b>{filtered.length}</b> dari {discounts.length} diskon
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Tidak ada diskon yang cocok.
            </div>
          ) : (
            filtered.map((d) => {
              const active = selected?.id === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelected(d)}
                  className={cx(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active
                      ? "border-green-500 ring-1 ring-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div className={cx("w-1.5 rounded-l-xl", active ? "bg-green-500" : "bg-gradient-to-b from-green-400 to-emerald-500")} />
                    <div className="flex-1 flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {d.nama}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {labelJenis(d.jenis_diskon)} • {showJumlah(d.jenis_diskon, d.jumlah)}
                        </div>
                      </div>
                      <span
                        className={cx(
                          "text-xs px-2 py-1 rounded-full",
                          d.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {d.status ? "Aktif" : "Nonaktif"}
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
            {/* Header: Nama + tombol edit */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold">{selected.nama}</div>
                <div className="text-gray-600">
                  {labelJenis(selected.jenis_diskon)} •{" "}
                  <span className="font-semibold">
                    {showJumlah(selected.jenis_diskon, selected.jumlah)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50"
              >
                <MdEdit size={18} /> Edit
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              {selected.status ? (
                <>
                  <FiCheckCircle className="text-green-600" />
                  <span className="text-green-700 text-sm">Aktif</span>
                </>
              ) : (
                <>
                  <FiXCircle className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Nonaktif</span>
                </>
              )}
            </div>

            {/* Info grid */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Informasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Info label="Toko ID" value={selected.toko_id} icon={<FiHash className="text-green-600" />} />
                <Info label="Jenis Diskon" value={labelJenis(selected.jenis_diskon)} icon={<FiPercent className="text-green-600" />} />
                <Info label="Jumlah" value={showJumlah(selected.jenis_diskon, selected.jumlah)} />
                <Info label="Sync At" value={selected.sync_at || "-"} />
              </div>
            </section>

            {/* Meta */}
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
          <div className="flex h-full items-center justify-center text-gray-400">
            Pilih salah satu diskon untuk melihat detail.
          </div>
        )}
      </div>

      {/* MODAL: Tambah */}
      <Modal open={openAdd} title="Tambah Diskon" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <DiskonForm
          form={formAdd}
          setForm={setFormAdd}
          onSubmit={handleSaveAdd}
          submitText="Simpan"
          initialFocusRef={addFocusRef}
        />
      </Modal>

      {/* MODAL: Edit */}
      <Modal open={openEdit} title="Edit Diskon" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <DiskonForm
          form={formEdit}
          setForm={setFormEdit}
          onSubmit={handleSaveEdit}
          submitText="Update"
          initialFocusRef={editFocusRef}
        />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Diskon" onClose={() => setOpenFilter(false)}>
        <div className="grid grid-cols-1 gap-3">
          <Labeled label="Jenis Diskon">
            <select
              value={filter.jenis_diskon}
              onChange={(e) => setFilter((f) => ({ ...f, jenis_diskon: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            >
              <option value="">Semua</option>
              <option value="1">Persentase</option>
              <option value="2">Nominal</option>
            </select>
          </Labeled>

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

          <Labeled label="Toko ID">
            <input
              value={filter.toko_id}
              onChange={(e) =>
                setFilter((f) => ({ ...f, toko_id: e.target.value.replace(/\D/g, "") }))
              }
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
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

/* -------- sub components -------- */

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
        {icon} <span>{label}</span>
      </div>
      <div className="font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
}

function DiskonForm({ form, setForm, onSubmit, submitText = "Simpan", initialFocusRef }) {
  const txt = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const num = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === "" ? "" : toInt(e.target.value) }));
  const chk = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!String(form.nama || "").trim()) return alert("Nama wajib diisi");
        if (!form.jumlah && form.jumlah !== 0) return alert("Jumlah wajib diisi");
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
          placeholder="cth: Promo Akhir Tahun"
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          data-autofocus
        />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Jenis Diskon">
          <select
            value={String(form.jenis_diskon)}
            onChange={txt("jenis_diskon")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          >
            <option value="1">Persentase (%)</option>
            <option value="2">Nominal (Rp)</option>
          </select>
        </Labeled>

        <Labeled label="Jumlah *">
          <input
            value={form.jumlah}
            onChange={num("jumlah")}
            inputMode="numeric"
            placeholder={String(form.jenis_diskon) === "1" ? "cth: 10" : "cth: 50000"}
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Toko ID *">
          <input
            value={form.toko_id}
            onChange={num("toko_id")}
            inputMode="numeric"
            placeholder="cth: 10"
            className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
          />
        </Labeled>

        <Labeled label="Status Aktif">
          <div className="h-10 flex items-center px-3 border rounded-lg">
            <input type="checkbox" checked={!!form.status} onChange={chk("status")} />
            <span className="ml-2">Aktif</span>
          </div>
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

      <Labeled label="Sync At (opsional)">
        <input
          value={form.sync_at}
          onChange={txt("sync_at")}
          placeholder="YYYY-MM-DD"
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