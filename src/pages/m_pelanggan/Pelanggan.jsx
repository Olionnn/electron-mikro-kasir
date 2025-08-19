import { useMemo, useState, useCallback, useRef } from "react";
import {
  FiRefreshCw, FiFilter, FiMail, FiPhone, FiMapPin, FiAward, FiHash, FiUser
} from "react-icons/fi";
import { MdAdd, MdRefresh, MdFilterList, MdEdit } from "react-icons/md";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";

const cx = (...a) => a.filter(Boolean).join(" ");
const toInt = (v) => (v === "" || v === null || v === undefined ? "" : Number(String(v).replace(/\D/g, "")));
const toStr = (v) => (v ?? "");

const emptyCustomer = {
  id: null, toko_id: 1, nama: "", poin: 0, kode: "", email: "", no_telp: "",
  alamat: "", image: "", created_by: 1, updated_by: 1, sync_at: null, status: true,
  created_at: "", updated_at: "",
};

export default function PelangganPage() {
  const [customers, setCustomers] = useState([
    { id: 1, toko_id: 101, nama: "Budi Santoso", poin: 120, kode: "PLG001", email: "budi@example.com", no_telp: "08123456789", alamat: "Jl. Merdeka No. 10, Jakarta", image: "", created_by: 1, updated_by: 2, sync_at: "2025-08-01", status: true, created_at: "2025-07-15", updated_at: "2025-08-09" },
    { id: 2, toko_id: 102, nama: "Siti Aminah", poin: 80,  kode: "PLG002", email: "siti@example.com", no_telp: "08129876543", alamat: "Jl. Melati No. 5, Bandung", image: "", created_by: 1, updated_by: 1, sync_at: null, status: false, created_at: "2025-07-20", updated_at: "2025-08-08" },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [formAdd, setFormAdd] = useState(emptyCustomer);
  const [formEdit, setFormEdit] = useState(emptyCustomer);

  const [filter, setFilter] = useState({ status: "", hasEmail: "", poinMin: "", poinMax: "", toko_id: "" });

  const doRefresh = useCallback(() => setSelectedCustomer(null), []);
  const openTambah = useCallback(() => {
    const nextId = Math.max(0, ...customers.map(c => c.id || 0)) + 1;
    setFormAdd({ ...emptyCustomer, id: nextId, created_at: new Date().toISOString().slice(0,10), updated_at: new Date().toISOString().slice(0,10) });
    setOpenAdd(true);
  }, [customers]);
  const openFilterModal = useCallback(() => setOpenFilter(true), []);

  const actions = useMemo(() => ([
    { type: "button", title: "Filter", onClick: openFilterModal, className: "inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50", icon: <MdFilterList size={20} /> },
    { type: "button", title: "Tambah Pelanggan", onClick: openTambah, className: "inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700", icon: <MdAdd size={20} /> },
    { type: "button", title: "Refresh", onClick: doRefresh, className: "inline-flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100", icon: <MdRefresh size={20} /> },
  ]), [openFilterModal, openTambah, doRefresh]);

  useNavbar({ variant: "page", title: "Pelanggan", backTo: "/management", actions }, [actions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = customers;
    if (q) {
      arr = arr.filter(c =>
        (c.nama || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.no_telp || "").toLowerCase().includes(q) ||
        (c.kode || "").toLowerCase().includes(q)
      );
    }
    if (filter.status !== "") arr = arr.filter(c => String(c.status) === filter.status);
    if (filter.hasEmail !== "") arr = arr.filter(c => (filter.hasEmail === "true" ? !!c.email : !c.email));
    if (filter.toko_id) arr = arr.filter(c => String(c.toko_id || "") === String(filter.toko_id));
    const min = Number(filter.poinMin || 0);
    const max = filter.poinMax === "" ? Number.POSITIVE_INFINITY : Number(filter.poinMax);
    arr = arr.filter(c => (c.poin ?? 0) >= min && (c.poin ?? 0) <= max);
    return arr;
  }, [customers, search, filter]);

  const handleOpenEdit = useCallback(() => {
    if (!selectedCustomer) return;
    setFormEdit({ ...emptyCustomer, ...selectedCustomer });
    setOpenEdit(true);
  }, [selectedCustomer]);

  const handleSaveAdd = useCallback(() => {
    setCustomers(prev => [formAdd, ...prev]);
    setSelectedCustomer(formAdd);
    setOpenAdd(false);
  }, [formAdd]);

  const handleSaveEdit = useCallback(() => {
    setCustomers(prev => prev.map(c => (c.id === formEdit.id ? { ...c, ...formEdit, updated_at: new Date().toISOString().slice(0,10) } : c)));
    setSelectedCustomer({ ...formEdit });
    setOpenEdit(false);
  }, [formEdit]);

  const clearFilters = useCallback(() => setFilter({ status: "", hasEmail: "", poinMin: "", poinMax: "", toko_id: "" }), []);

  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-1/2 border-r flex flex-col bg-white">
        <div className="p-4 border-b sticky top-0 z-10 bg-white/90 backdrop-blur">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama / email / telp / kode…"
              className="w-full h-11 pl-4 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {/* {search && (
                // <button
                //   onClick={() => setSearch("")}
                //   className="absolute right-24 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                // >
                //   Bersihkan
                // </button>
            )} */}
            {/* <button
              onClick={doRefresh}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-100"
              title="Refresh"
            >
              <FiRefreshCw />
            </button> */}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Menampilkan <b>{filtered.length}</b> dari {customers.length} pelanggan
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Tidak ada pelanggan yang cocok.
            </div>
          ) : (
            filtered.map((cust) => {
              const active = selectedCustomer?.id === cust.id;
              return (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => setSelectedCustomer(cust)}
                  className={cx(
                    "w-full text-left rounded-xl border transition focus:outline-none focus:ring-2",
                    active
                      ? "border-violet-500 ring-1 ring-violet-500 bg-violet-100"
                      : "border-violet-400 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-stretch">
                    <div className={cx("w-1.5 rounded-l-xl", active ? "bg-violet-500" : "bg-gradient-to-b from-violet-400 to-violet-500")} />
                    <div className="flex-1 flex items-center gap-3 p-3">
                      <div className="w-10 h-10 bg-violet-300 rounded-md flex items-center justify-center">
                        <span className="text-violet-600 font-bold">{(cust.nama || "P").charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-800 truncate">{cust.nama}</div>
                        <div className="text-xs text-gray-500 truncate">{cust.email || cust.no_telp || "-"}</div>
                      </div>
                      <span className={cx(
                        "text-xs px-2 py-1 rounded-full",
                        cust.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      )}>
                        {cust.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="w-1/2 p-6">
        {selectedCustomer ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {selectedCustomer.image ? (
                  <img
                    src={selectedCustomer.image}
                    alt={selectedCustomer.nama}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-3xl text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold">{selectedCustomer.nama}</div>
                  <div className="text-gray-600">Kode: {selectedCustomer.kode || "-"}</div>
                </div>
              </div>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 bg-white border border-violet-500 text-violet-700 px-3 py-2 rounded-lg hover:bg-violet-200"
              >
                <MdEdit size={18} /> Edit
              </button>
            </div>

            {/* Status badge */}
            <div>
              <span className={cx(
                "text-xs px-2 py-1 rounded-full",
                selectedCustomer.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {selectedCustomer.status ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Info grid (tanpa card, pakai grid & border halus) */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Informasi Utama</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoPlain icon={<FiAward className="text-violet-600" />} label="Poin" value={selectedCustomer.poin} />
                <InfoPlain icon={<FiHash  className="text-violet-600" />} label="Toko ID" value={selectedCustomer.toko_id} />
                <InfoPlain icon={<FiMail  className="text-violet-600" />} label="Email" value={selectedCustomer.email || "-"} />
                <InfoPlain icon={<FiPhone className="text-violet-600" />} label="No. Telp" value={selectedCustomer.no_telp || "-"} />
                <InfoPlain icon={<FiMapPin className="text-violet-600" />} label="Alamat" value={selectedCustomer.alamat || "-"} wide />
              </div>
            </section>

            {/* Meta */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoPlain label="Dibuat" value={selectedCustomer.created_at || "-"} />
                <InfoPlain label="Diupdate" value={selectedCustomer.updated_at || "-"} />
                {selectedCustomer.created_by != null && <InfoPlain label="Created by (ID)" value={selectedCustomer.created_by} />}
                {selectedCustomer.updated_by != null && <InfoPlain label="Updated by (ID)" value={selectedCustomer.updated_by} />}
                {selectedCustomer.sync_at && <InfoPlain label="Sync" value={selectedCustomer.sync_at} wide />}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Belum ada data pelanggan terpilih
          </div>
        )}
      </div>

      {/* MODAL: Tambah */}
      <Modal open={openAdd} title="Tambah Pelanggan" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <PelangganForm form={formAdd} setForm={setFormAdd} onSubmit={handleSaveAdd} submitText="Simpan" />
      </Modal>

      {/* MODAL: Edit */}
      <Modal open={openEdit} title="Edit Pelanggan" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <PelangganForm form={formEdit} setForm={setFormEdit} onSubmit={handleSaveEdit} submitText="Update" />
      </Modal>

      {/* MODAL: Filter */}
      <Modal open={openFilter} title="Filter Pelanggan" onClose={() => setOpenFilter(false)}>
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

          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Poin Min">
              <input
                value={filter.poinMin}
                onChange={(e) => setFilter((f) => ({ ...f, poinMin: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
              />
            </Labeled>
            <Labeled label="Poin Max">
              <input
                value={filter.poinMax}
                onChange={(e) => setFilter((f) => ({ ...f, poinMax: e.target.value.replace(/\D/g, "") }))}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
              />
            </Labeled>
          </div>

          <Labeled label="Toko ID">
            <input
              value={filter.toko_id}
              onChange={(e) => setFilter((f) => ({ ...f, toko_id: e.target.value.replace(/\D/g, "") }))}
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500"
              placeholder="cth: 101"
            />
          </Labeled>

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

/* --------- Subcomponents ---------- */
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

function PelangganForm({ form, setForm, onSubmit, submitText = "Simpan" }) {
  const handleTxt = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleNum = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === "" ? "" : toInt(e.target.value) }));
  const handleCheck = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!toStr(form.nama).trim()) { alert("Nama wajib diisi"); return; }
        if (!form.toko_id) { alert("Toko ID wajib diisi"); return; }
        onSubmit?.();
      }}
      className="grid grid-cols-1 gap-3"
    >
      <Labeled label="Nama *">
        <input value={toStr(form.nama)} onChange={handleTxt("nama")} placeholder="Nama pelanggan" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" data-autofocus />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Toko ID *">
          <input value={toInt(form.toko_id)} onChange={handleNum("toko_id")} inputMode="numeric" placeholder="cth: 101" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
        <Labeled label="Kode">
          <input value={toStr(form.kode)} onChange={handleTxt("kode")} placeholder="Kode unik (opsional)" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Poin">
          <input value={toInt(form.poin)} onChange={handleNum("poin")} inputMode="numeric" placeholder="0" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
        <Labeled label="Status Aktif">
          <div className="h-10 flex items-center px-3 border rounded-lg">
            <input type="checkbox" checked={!!form.status} onChange={handleCheck("status")} />
            <span className="ml-2">Aktif</span>
          </div>
        </Labeled>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Email">
          <input value={toStr(form.email)} onChange={handleTxt("email")} type="email" placeholder="email@contoh.com" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
        <Labeled label="No. Telp">
          <input value={toStr(form.no_telp)} onChange={handleTxt("no_telp")} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
      </div>

      <Labeled label="Alamat">
        <input value={toStr(form.alamat)} onChange={handleTxt("alamat")} placeholder="Alamat pelanggan" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
      </Labeled>

      <Labeled label="URL Foto (opsional)">
        <input value={toStr(form.image)} onChange={handleTxt("image")} placeholder="https://…" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Created By (ID)">
          <input value={toInt(form.created_by)} onChange={handleNum("created_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
        <Labeled label="Updated By (ID)">
          <input value={toInt(form.updated_by)} onChange={handleNum("updated_by")} inputMode="numeric" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
        </Labeled>
      </div>

      <Labeled label="Sync At (ISO Date)">
        <input value={toStr(form.sync_at || "")} onChange={handleTxt("sync_at")} placeholder="2025-08-01" className="w-full px-3 py-2 border rounded-lg focus:outline-violet-500" />
      </Labeled>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => history.back()}>Batal</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600">{submitText}</button>
      </div>
    </form>
  );
}