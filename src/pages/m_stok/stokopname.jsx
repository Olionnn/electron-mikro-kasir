import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdListAlt } from "react-icons/md";

/* ---------------- Dummy Master (stok_opname) ---------------- */
const dummyData = [
  {
    id: 1,
    toko_id: 101,
    keterangan: "Opname awal tahun",
    created_by: 1,
    updated_by: null,
    created_at: "2025-08-11",
    updated_at: "2025-08-11",
  },
  {
    id: 2,
    toko_id: 102,
    keterangan: "Opname stok cabang B",
    created_by: 2,
    updated_by: null,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
];

/* ---------------- Dummy Detail per opname ----------------
   key = stok_opname_id
   item fields mengikuti model stok_opname_detail
-----------------------------------------------------------*/
const initialDetailByOpname = {
  1: [
    {
      id: 1,
      toko_id: 101,
      stok_opname_id: 1,
      barang_id: 201,
      stok_sistem: 10,
      stok_fisik: 9,
      stok_sesuai: false,
      keterangan: "Rak A1",
      created_by: 1,
      updated_by: null,
      created_at: "2025-08-11",
      updated_at: "2025-08-11",
      sync_at: null,
      status: true,
    },
  ],
  2: [],
};

export default function StokOpnamePage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ toko_id: "", keterangan: "", created_by: "" });

  // Detail modal state
  const [openDetail, setOpenDetail] = useState(false);
  const [activeOpname, setActiveOpname] = useState(null); // row object
  const [detailByOpname, setDetailByOpname] = useState(initialDetailByOpname);

  // Form tambah detail
  const [detailForm, setDetailForm] = useState({
    barang_id: "",
    stok_sistem: "",
    stok_fisik: "",
    keterangan: "",
    created_by: "",
    status: true,
  });

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.id, r.toko_id, r.keterangan, r.created_by, r.created_at]
        .map((v) => String(v ?? "").toLowerCase())
        .some((t) => t.includes(q))
    );
  }, [rows, debounced]);

  // Navbar actions
  const openTambah = useCallback(() => setOpenModal(true), []);
  const doRefresh = useCallback(() => setRows((prev) => [...prev]), []);

  const actions = useMemo(
    () => [
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

  /* ---------------- Form Master Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => setForm({ toko_id: "", keterangan: "", created_by: "" });

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    if (!form.toko_id || !form.created_by) {
      alert("Toko ID dan Created By wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      const newRow = {
        id: Math.max(0, ...rows.map((r) => r.id)) + 1,
        toko_id: parseInt(form.toko_id, 10),
        keterangan: form.keterangan || "",
        created_by: parseInt(form.created_by, 10),
        updated_by: null,
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
      };
      setRows((prev) => [newRow, ...prev]);
      // siapkan bucket detail kosong untuk opname baru
      setDetailByOpname((prev) => ({ ...prev, [newRow.id]: [] }));
      setOpenModal(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Detail: open/close ---------------- */
  const openDetailFor = (row) => {
    setActiveOpname(row);
    // reset form detail tiap kali buka
    setDetailForm({
      barang_id: "",
      stok_sistem: "",
      stok_fisik: "",
      keterangan: "",
      created_by: "",
      status: true,
    });
    setOpenDetail(true);
  };

  /* ---------------- Tambah Detail Handler ---------------- */
  const handleDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetailForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const addDetail = (e) => {
    e?.preventDefault?.();
    if (!activeOpname) return;
    const opnameId = activeOpname.id;
    const arr = detailByOpname[opnameId] || [];

    const stok_sistem = parseInt(detailForm.stok_sistem || "0", 10);
    const stok_fisik = parseInt(detailForm.stok_fisik || "0", 10);
    const newDetail = {
      id: Math.max(0, ...arr.map((d) => d.id)) + 1,
      toko_id: activeOpname.toko_id,
      stok_opname_id: opnameId,
      barang_id: detailForm.barang_id ? parseInt(detailForm.barang_id, 10) : null,
      stok_sistem,
      stok_fisik,
      stok_sesuai: stok_sistem === stok_fisik,
      keterangan: detailForm.keterangan || "",
      created_by: detailForm.created_by ? parseInt(detailForm.created_by, 10) : null,
      updated_by: null,
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      sync_at: null,
      status: !!detailForm.status,
    };

    setDetailByOpname((prev) => ({
      ...prev,
      [opnameId]: [newDetail, ...arr],
    }));

    // reset form detail ringan
    setDetailForm((f) => ({
      ...f,
      barang_id: "",
      stok_sistem: "",
      stok_fisik: "",
      keterangan: "",
    }));
  };

  const activeDetails = useMemo(() => {
    if (!activeOpname) return [];
    return detailByOpname[activeOpname.id] || [];
  }, [activeOpname, detailByOpname]);

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Toolbar / Search */}
      <div className="p-4 md:p-6 border-b sticky top-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-xl">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.09-4.14a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari opname… (id, toko, keterangan, tanggal, dsb.)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-100 text-gray-500"
                title="Bersihkan"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {filtered.length} opname
            </span>
          </div>
        </div>
      </div>

      {/* Table wrapper: body scroll only */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4 md:p-6">
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-green-50 border-b sticky top-0 z-10">
                <tr className="text-left">
                  <Th>ID</Th>
                  <Th>Toko</Th>
                  <Th>Keterangan</Th>
                  <Th>Created By</Th>
                  <Th>Created At</Th>
                  <Th className="w-40">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Belum ada data yang cocok.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-green-50/50 transition-colors">
                      <Td>{item.id}</Td>
                      <Td>{item.toko_id}</Td>
                      <Td className="max-w-[420px] truncate" title={item.keterangan || "-"}>
                        {item.keterangan || "-"}
                      </Td>
                      <Td>{item.created_by ?? "-"}</Td>
                      <Td>{item.created_at}</Td>
                      <Td>
                        <button
                          onClick={() => openDetailFor(item)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-green-700 border-green-400 hover:bg-green-50"
                          title="Lihat / Kelola Detail"
                        >
                          <MdListAlt size={18} /> Detail
                        </button>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah Master */}
      <Modal open={openModal} title="Tambah Stok Opname" onClose={() => setOpenModal(false)}>
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3">
          <Group label="Toko ID *">
            <input
              name="toko_id"
              value={form.toko_id}
              onChange={handleChange}
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="cth: 101"
              required
            />
          </Group>

          <Group label="Keterangan">
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="Catatan opname…"
            />
          </Group>

          <Group label="Created By (User ID) *">
            <input
              name="created_by"
              value={form.created_by}
              onChange={handleChange}
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="cth: 1"
              required
            />
          </Group>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => setOpenModal(false)}>
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail */}
      <Modal
        open={openDetail}
        title={activeOpname ? `Detail Opname #${activeOpname.id}` : "Detail Opname"}
        onClose={() => setOpenDetail(false)}
      >
        {/* Info ringkas opname */}
        {activeOpname && (
          <div className="mb-3 text-sm text-gray-600">
            <div className="flex flex-wrap gap-3">
              <span><b>Toko:</b> {activeOpname.toko_id}</span>
              <span><b>Tanggal:</b> {activeOpname.created_at}</span>
              <span className="truncate max-w-[320px]"><b>Ket:</b> {activeOpname.keterangan || "-"}</span>
            </div>
          </div>
        )}

        {/* Form tambah detail */}
        <form onSubmit={addDetail} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Group label="Barang ID">
            <input
              name="barang_id"
              value={detailForm.barang_id}
              onChange={handleDetailChange}
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="cth: 201"
            />
          </Group>
          <Group label="Stok Sistem">
            <input
              name="stok_sistem"
              value={detailForm.stok_sistem}
              onChange={handleDetailChange}
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="0"
            />
          </Group>
          <Group label="Stok Fisik">
            <input
              name="stok_fisik"
              value={detailForm.stok_fisik}
              onChange={handleDetailChange}
              inputMode="numeric"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="0"
            />
          </Group>
          <Group label="Keterangan">
            <input
              name="keterangan"
              value={detailForm.keterangan}
              onChange={handleDetailChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="Lokasi rak / catatan"
            />
          </Group>
          <Group label="Created By">
            <input
              name="created_by"
              value={detailForm.created_by}
              onChange={handleDetailChange}
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="cth: 1"
            />
          </Group>
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
            <input
              type="checkbox"
              name="status"
              checked={detailForm.status}
              onChange={handleDetailChange}
            />
            Aktif
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
              Tambah Detail
            </button>
          </div>
        </form>

        {/* Tabel detail */}
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-green-50 border-b sticky top-0">
              <tr className="text-left">
                <Th>#</Th>
                <Th>Barang ID</Th>
                <Th>Stok Sistem</Th>
                <Th>Stok Fisik</Th>
                <Th>Selisih</Th>
                <Th>Sesuai?</Th>
                <Th>Keterangan</Th>
              </tr>
            </thead>
            <tbody className="divide-y max-h-[40vh] overflow-auto">
              {activeDetails.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    Belum ada item detail.
                  </td>
                </tr>
              ) : (
                activeDetails.map((d) => {
                  const selisih = (d.stok_fisik ?? 0) - (d.stok_sistem ?? 0);
                  return (
                    <tr key={d.id}>
                      <Td>{d.id}</Td>
                      <Td>{d.barang_id ?? "-"}</Td>
                      <Td>{d.stok_sistem}</Td>
                      <Td>{d.stok_fisik}</Td>
                      <Td className={selisih === 0 ? "" : selisih > 0 ? "text-green-700" : "text-red-600"}>
                        {selisih}
                      </Td>
                      <Td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            d.stok_sesuai ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {d.stok_sesuai ? "Ya" : "Tidak"}
                        </span>
                      </Td>
                      <Td className="max-w-[300px] truncate" title={d.keterangan || "-"}>
                        {d.keterangan || "-"}
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

/* ------- sub components ------- */
function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-xs font-semibold text-gray-600 border-b ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}
function Group({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}