import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdFilterList, MdSearch, MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

/* --- DUMMY DATA --- */
const dummyData = [
  { id: 1, toko_id: 101, keterangan: "Opname Gudang A", created_by: "Admin 1", status: true,  created_at: "2025-08-10", updated_at: "2025-08-10" },
  { id: 2, toko_id: 102, keterangan: "Opname Gudang B", created_by: "Admin 2", status: true,  created_at: "2025-08-11", updated_at: "2025-08-11" },
  { id: 3, toko_id: 101, keterangan: "Opname Display",  created_by: "Admin 3", status: false, created_at: "2025-08-12", updated_at: "2025-08-12" },
];

/* --- Small UI helpers --- */
function Th({ children, w, right }) {
  return (
    <th
      className={`px-3 py-2 text-left font-semibold text-black ${right ? "text-right" : ""}`}
      style={w ? { width: w } : undefined}
    >
      {children}
    </th>
  );
}
function Td({ children, right }) {
  return <td className={`px-3 py-2 ${right ? "text-right" : ""}`}>{children}</td>;
}
function Group({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-black">{label}</span>
      {children}
    </label>
  );
}
function Pagination({ page, totalPages, onPrev, onNext, onGoto, compact = false }) {
  const pages = useMemo(() => {
    const win = 2;
    const s = Math.max(1, page - win);
    const e = Math.min(totalPages, page + win);
    const arr = [];
    for (let i = s; i <= e; i++) arr.push(i);
    if (!arr.includes(1)) arr.unshift(1);
    if (!arr.includes(totalPages)) arr.push(totalPages);
    return Array.from(new Set(arr)).sort((a, b) => a - b);
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button onClick={onPrev} disabled={page === 1} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50">
        Prev
      </button>
      {!compact &&
        pages.map((p, idx) => (
          <React.Fragment key={`${p}-${idx}`}>
            {idx > 0 && pages[idx - 1] + 1 !== p && <span className="px-1">…</span>}
            <button
              onClick={() => onGoto(p)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                p === page ? "bg-violet-900 text-white border-violet-700" : "hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          </React.Fragment>
        ))}
      <button onClick={onNext} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50">
        Next
      </button>
    </div>
  );
}

export default function StokOpnamePage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  // filter
  const [filterForm, setFilterForm] = useState({
    status: "",     // "", "aktif", "nonaktif"
    toko: "",       // filter by toko_id
    tanggal: "",    // yyyy-mm-dd (exact created_at)
  });

  // tambah
  const [form, setForm] = useState({
    toko_id: "",
    keterangan: "",
    created_by: "",
    status: true,
  });

  // pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const pageSizeOptions = [10, 25, 50, 100];

  // navbar actions
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

  useNavbar({ variant: "page", title: "Stok Opname", backTo: "/management", actions }, [actions]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // filtering + search
  const filtered = useMemo(() => {
    let data = [...rows];

    const q = debounced.trim().toLowerCase();
    if (q) {
      data = data.filter((r) =>
        [r.id, r.toko_id, r.keterangan, r.created_by, r.created_at, r.updated_at, r.status ? "aktif" : "nonaktif"]
          .map((v) => String(v ?? "").toLowerCase())
          .some((t) => t.includes(q))
      );
    }
    if (filterForm.status) {
      const isActive = filterForm.status === "aktif";
      data = data.filter((r) => r.status === isActive);
    }
    if (filterForm.toko) {
      data = data.filter((r) => String(r.toko_id) === String(filterForm.toko));
    }
    if (filterForm.tanggal) {
      data = data.filter((r) => r.created_at === filterForm.tanggal);
    }
    return data;
  }, [rows, debounced, filterForm]);

  // reset halaman saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [debounced, filterForm, pageSize]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

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

  const navigate = useNavigate();
  const goDetail = (id) => navigate(`/opname/${id}`); // sesuaikan route detail

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Toolbar / Search */}
      <div className="p-4 md:p-6 border-b bg-white sticky top-0 z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari opname…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-xl px-4 py-3"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                title="Bersihkan"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-700 bg-violet-700">
              {total} entri
            </span>
          </div>
        </div>

        {/* Controls bawah toolbar */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">per halaman</span>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onGoto={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Table (scroll di komponen ini saja) */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4 md:p-6">
          <div className="bg-violet-200 border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-violet-700 sticky top-0">
                  <tr>
                    <Th w="80">#</Th>
                    <Th w="120">ID</Th>
                    <Th w="140">Toko</Th>
                    <Th>Keterangan</Th>
                    <Th w="160">Dibuat Oleh</Th>
                    <Th w="120">Status</Th>
                    <Th w="140">Created At</Th>
                    <Th w="140">Updated At</Th>
                    {/* <Th w="120">Aksi</Th> */}
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-gray-900">Tidak ada data.</td>
                    </tr>
                  ) : (
                    paged.map((item, idx) => (
                      <tr key={item.id} className="border-t">
                        <Td>{start + idx + 1}</Td>
                        <Td>{item.id}</Td>
                        <Td>{item.toko_id}</Td>
                        <Td className="max-w-[420px]"><span className="line-clamp-2">{item.keterangan}</span></Td>
                        <Td>{item.created_by}</Td>
                        <Td>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {item.status ? "Aktif" : "Nonaktif"}
                          </span>
                        </Td>
                        <Td>{item.created_at}</Td>
                        <Td>{item.updated_at}</Td>
                        {/* <Td>
                          <button
                            onClick={() => goDetail(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                            title="Lihat detail opname"
                          >
                            <MdArrowForward /> Detail
                          </button>
                        </Td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer table */}
            <div className="px-4 py-3 bg-violet-700 text-sm text-black flex items-center justify-between">
              <div>
                Menampilkan <strong>{paged.length}</strong> dari <strong>{total}</strong> entri
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onGoto={(p) => setPage(p)}
                compact
              />
            </div>
          </div>
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
          <div className="flex justify-end gap-2 pt-1">
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
            <input type="checkbox" name="status" checked={form.status} onChange={handleFormChange} />
            <span className="text-sm">Aktif</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setOpenModal(false)}>
              Batal
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}