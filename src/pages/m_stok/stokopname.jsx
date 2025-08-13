import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdFilterList } from "react-icons/md";

/* --- DUMMY DATA: stok_opname master (samakan pola dengan sebelumnya) --- */
const dummyData = [
  { id: 1, toko_id: 101, keterangan: "Opname Gudang A", created_by: "Admin 1", status: true,  created_at: "2025-08-10", updated_at: "2025-08-10" },
  { id: 2, toko_id: 102, keterangan: "Opname Gudang B", created_by: "Admin 2", status: true,  created_at: "2025-08-11", updated_at: "2025-08-11" },
  { id: 3, toko_id: 101, keterangan: "Opname Display",  created_by: "Admin 3", status: false, created_at: "2025-08-12", updated_at: "2025-08-12" },
];

/* --- UI Helpers (samakan gaya dengan contoh BarangStokPage) --- */
function Th({ children }) {
  return <th className="px-3 py-2">{children}</th>;
}
function Td({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}
function Group({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      {children}
    </label>
  );
}

export default function StokOpnamePage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  // form tambah
  const [form, setForm] = useState({
    toko_id: "",
    keterangan: "",
    created_by: "",
    status: true,
  });

  // form filter (menyerupai pola di contoh)
  const [filterForm, setFilterForm] = useState({
    status: "",     // "", "aktif", "nonaktif"
    toko: "",       // filter by toko_id
    tanggal: "",    // filter exact date (yyyy-mm-dd)
  });

  // Navbar (disamakan: Filter, Tambah, Refresh)
  const openTambah = useCallback(() => setOpenModal(true), []);
  const doRefresh = useCallback(() => setRows((prev) => [...prev]), []);

  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter Opname",
        onClick: () => setOpenFilter(true),
        className:
          "inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50",
        icon: <MdFilterList size={20} />,
      },
      {
        type: "button",
        title: "Tambah Opname",
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

  useNavbar(
    { variant: "page", title: "Stok Opname", backTo: "/management", actions },
    [actions]
  );

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // filter & search (pola sama dengan contohmu)
  const filtered = useMemo(() => {
    let data = [...rows];

    // search
    const q = debounced.trim().toLowerCase();
    if (q) {
      data = data.filter((r) =>
        [
          r.id,
          r.toko_id,
          r.keterangan,
          r.created_by,
          r.created_at,
          r.updated_at,
          r.status ? "aktif" : "nonaktif",
        ]
          .map((v) => String(v ?? "").toLowerCase())
          .some((t) => t.includes(q))
      );
    }

    // filter status
    if (filterForm.status) {
      const isActive = filterForm.status === "aktif";
      data = data.filter((r) => r.status === isActive);
    }
    // filter toko
    if (filterForm.toko) {
      data = data.filter((r) => String(r.toko_id) === String(filterForm.toko));
    }
    // filter tanggal (exact)
    if (filterForm.tanggal) {
      data = data.filter((r) => r.created_at === filterForm.tanggal);
    }

    return data;
  }, [rows, debounced, filterForm]);

  // handlers
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.toko_id || !form.keterangan || !form.created_by) {
      alert("Toko, keterangan, dan created_by wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      const today = new Date().toISOString().slice(0, 10);
      const newItem = {
        id: Math.max(0, ...rows.map((r) => r.id)) + 1,
        toko_id: parseInt(form.toko_id, 10),
        keterangan: form.keterangan,
        created_by: form.created_by,
        status: !!form.status,
        created_at: today,
        updated_at: today,
      };
      setRows((prev) => [newItem, ...prev]);
      setOpenModal(false);
      setForm({ toko_id: "", keterangan: "", created_by: "", status: true });
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Toolbar / Search (serupa) */}
      <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <input
              type="text"
              placeholder="Cari opname…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 border border-gray-300 rounded-xl px-4 py-3"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                title="Bersihkan"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50">
              {filtered.length} entri
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4 md:p-6">
          <table className="w-full text-sm border">
            <thead className="bg-green-50 sticky top-0">
              <tr>
                <Th>ID</Th>
                <Th>Toko</Th>
                <Th>Keterangan</Th>
                <Th>Dibuat Oleh</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
                <Th>Updated At</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="odd:bg-gray-50">
                    <Td>{item.id}</Td>
                    <Td>{item.toko_id}</Td>
                    <Td>{item.keterangan}</Td>
                    <Td>{item.created_by}</Td>
                    <Td>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          item.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </Td>
                    <Td>{item.created_at}</Td>
                    <Td>{item.updated_at}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Filter */}
      <Modal open={openFilter} title="Filter Stok Opname" onClose={() => setOpenFilter(false)}>
        <form className="grid gap-3">
          <Group label="Status">
            <select
              name="status"
              value={filterForm.status}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </Group>
          <Group label="Toko ID">
            <input
              type="number"
              name="toko"
              value={filterForm.toko}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2"
              placeholder="cth: 101"
            />
          </Group>
          <Group label="Tanggal (YYYY-MM-DD)">
            <input
              type="date"
              name="tanggal"
              value={filterForm.tanggal}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2"
            />
          </Group>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border"
              onClick={() => {
                setFilterForm({ status: "", toko: "", tanggal: "" });
                setOpenFilter(false);
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
              onClick={() => setOpenFilter(false)}
            >
              Terapkan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah */}
      <Modal open={openModal} title="Tambah Stok Opname" onClose={() => setOpenModal(false)}>
        <form className="grid gap-3" onSubmit={handleAdd}>
          <Group label="Toko ID">
            <input
              type="number"
              name="toko_id"
              value={form.toko_id}
              onChange={handleFormChange}
              className="border rounded-lg px-3 py-2"
              required
            />
          </Group>
          <Group label="Keterangan">
            <input
              type="text"
              name="keterangan"
              value={form.keterangan}
              onChange={handleFormChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Opname Gudang A"
              required
            />
          </Group>
          <Group label="Dibuat Oleh">
            <input
              type="text"
              name="created_by"
              value={form.created_by}
              onChange={handleFormChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Nama petugas"
              required
            />
          </Group>
          <label className="inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleFormChange}
            />
            <span className="text-sm">Aktif</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border"
              onClick={() => setOpenModal(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}