import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdListAlt, MdFilterList } from "react-icons/md";

/* ---------------- Dummy Master (stok_opname) ---------------- */
const dummyData = [
  {
    id: 1,
    toko_id: 101,
    keterangan: "Opname Gudang A",
    created_by: "Admin 1",
    created_at: "2025-08-10",
  },
  {
    id: 2,
    toko_id: 102,
    keterangan: "Opname Gudang B",
    created_by: "Admin 2",
    created_at: "2025-08-11",
  },
  {
    id: 3,
    toko_id: 101,
    keterangan: "Opname Display",
    created_by: "Admin 3",
    created_at: "2025-08-12",
  },
];

/** Group wrapper untuk form input */
function Group({ label, children }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

export default function StokOpnamePage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ toko_id: "", keterangan: "", created_by: "" });

  // Filter state ⬅️
  const [openFilter, setOpenFilter] = useState(false);
  const [filterToko, setFilterToko] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  // Detail modal
  const [detailData, setDetailData] = useState(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // apply filter + search
  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    let data = rows;

    // filter toko & tanggal ⬅️
    if (filterToko) {
      data = data.filter((r) => String(r.toko_id) === String(filterToko));
    }
    if (filterTanggal) {
      data = data.filter((r) => r.created_at === filterTanggal);
    }

    if (!q) return data;
    return data.filter((r) =>
      [r.id, r.toko_id, r.keterangan, r.created_by, r.created_at]
        .map((v) => String(v ?? "").toLowerCase())
        .some((t) => t.includes(q))
    );
  }, [rows, debounced, filterToko, filterTanggal]);

  // Navbar actions
  const openTambah = useCallback(() => setOpenModal(true), []);
  const doRefresh = useCallback(() => setRows((prev) => [...prev]), []);

  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter Opname",
        onClick: () => setOpenFilter(true), // ⬅️ filter
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

  // save new data
  const saveData = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setRows((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ...form,
          created_at: new Date().toISOString().slice(0, 10),
        },
      ]);
      setForm({ toko_id: "", keterangan: "", created_by: "" });
      setSaving(false);
      setOpenModal(false);
    }, 800);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Cari opname..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-t">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-2 border-r">ID</th>
              <th className="p-2 border-r">Toko ID</th>
              <th className="p-2 border-r">Keterangan</th>
              <th className="p-2 border-r">Created By</th>
              <th className="p-2 border-r">Tanggal</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border-r">{row.id}</td>
                <td className="p-2 border-r">{row.toko_id}</td>
                <td className="p-2 border-r">{row.keterangan}</td>
                <td className="p-2 border-r">{row.created_by}</td>
                <td className="p-2 border-r">{row.created_at}</td>
                <td className="p-2">
                  <button
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 inline-flex items-center gap-1"
                    onClick={() => setDetailData(row)}
                  >
                    <MdListAlt /> Detail
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Filter */}
      <Modal open={openFilter} title="Filter Opname" onClose={() => setOpenFilter(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpenFilter(false);
          }}
          className="grid gap-3"
        >
          <Group label="Toko ID">
            <input
              type="number"
              value={filterToko}
              onChange={(e) => setFilterToko(e.target.value)}
              placeholder="cth: 101"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </Group>
          <Group label="Tanggal (YYYY-MM-DD)">
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </Group>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              onClick={() => {
                setFilterToko("");
                setFilterTanggal("");
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Terapkan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah */}
      <Modal open={openModal} title="Tambah Opname" onClose={() => setOpenModal(false)}>
        <form onSubmit={saveData} className="grid gap-3">
          <Group label="Toko ID">
            <input
              type="number"
              value={form.toko_id}
              onChange={(e) => setForm({ ...form, toko_id: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </Group>
          <Group label="Keterangan">
            <input
              type="text"
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </Group>
          <Group label="Created By">
            <input
              type="text"
              value={form.created_by}
              onChange={(e) => setForm({ ...form, created_by: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </Group>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              onClick={() => setOpenModal(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail */}
      <Modal
        open={!!detailData}
        title="Detail Opname"
        onClose={() => setDetailData(null)}
      >
        {detailData && (
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {detailData.id}
            </p>
            <p>
              <strong>Toko ID:</strong> {detailData.toko_id}
            </p>
            <p>
              <strong>Keterangan:</strong> {detailData.keterangan}
            </p>
            <p>
              <strong>Created By:</strong> {detailData.created_by}
            </p>
            <p>
              <strong>Tanggal:</strong> {detailData.created_at}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
