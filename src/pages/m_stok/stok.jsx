import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdFilterList, MdSearch, MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const dummyData = [
  {
    id: 1,
    toko_id: 101,
    barang_id: 1,
    harga_dasar: 50000,
    tanggal_masuk: "2025-08-01",
    jumlah_stok: 20,
    keterangan: "Stok awal bulan Agustus",
    created_by: 1,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-01",
    updated_at: "2025-08-01",
  },
  {
    id: 2,
    toko_id: 102,
    barang_id: 2,
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 15,
    keterangan: "Restock barang",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
  },
  {
    id: 3,
    toko_id: 102,
    barang_id: 3,
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 15,
    keterangan: "Restock barang",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
  },
  {
    id: 4,
    toko_id: 102,
    barang_id: 4  ,
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 15,
    keterangan: "Restock barang",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
  },
  {
    id: 5,
    toko_id: 102,
    barang_id: 202,
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 15,
    keterangan: "Restock barang",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
  },
  {
    id: 6,
    toko_id: 102,
    barang_id: 202,
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 15,
    keterangan: "Restock barang",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
  },
  {
    id: 7,
    toko_id: 103,
    barang_id: 203,
    harga_dasar: 60000,
    tanggal_masuk: "2025-08-10",
    jumlah_stok: 30,
    keterangan: "Stok baru masuk",
    created_by: 3,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
  {
    id: 8,
    toko_id: 104,
    barang_id: 204,
    harga_dasar: 60000,
    tanggal_masuk: "2025-08-10",
    jumlah_stok: 30,
    keterangan: "Stok baru masuk",
    created_by: 3,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
  {
    id: 9,
    toko_id: 104,
    barang_id: 204,
    harga_dasar: 60000,
    tanggal_masuk: "2025-08-10",
    jumlah_stok: 30,
    keterangan: "Stok baru masuk",
    created_by: 3,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
  {
    id: 10,    
    toko_id: 104,
    barang_id: 204,
    harga_dasar: 60000,
    tanggal_masuk: "2025-08-10",
    jumlah_stok: 30,
    keterangan: "Stok baru masuk",
    created_by: 3,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
  {
    id: 11,
    toko_id: 104,
    barang_id: 204,
    harga_dasar: 60000,
    tanggal_masuk: "2025-08-10",
    jumlah_stok: 30,
    keterangan: "Stok baru masuk",
    created_by: 3,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
];

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function BarangStokPage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    toko_id: "",
    barang_id: "",
    harga_dasar: "",
    tanggal_masuk: "",
    jumlah_stok: "",
    keterangan: "",
    created_by: "",
    status: true,
  });

  const [filterForm, setFilterForm] = useState({
    status: "",
    minHarga: "",
    maxHarga: "",
  });

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const pageSizeOptions = [10, 25, 50, 100];

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    let data = [...rows];
    const q = debounced.trim().toLowerCase();
    if (q) {
      data = data.filter((r) => {
        const tokens = [
          r.id,
          r.toko_id,
          r.barang_id,
          r.harga_dasar,
          r.tanggal_masuk,
          r.jumlah_stok,
          r.keterangan,
          r.created_by,
          r.created_at,
        ].map((v) => String(v ?? "").toLowerCase());
        return tokens.some((t) => t.includes(q));
      });
    }
    if (filterForm.status) {
      const isActive = filterForm.status === "aktif";
      data = data.filter((r) => r.status === isActive);
    }
    if (filterForm.minHarga) {
      data = data.filter((r) => r.harga_dasar >= parseInt(filterForm.minHarga));
    }
    if (filterForm.maxHarga) {
      data = data.filter((r) => r.harga_dasar <= parseInt(filterForm.maxHarga));
    }
    return data;
  }, [rows, debounced, filterForm]);

  // Reset ke halaman 1 saat filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [debounced, filterForm, pageSize]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const openTambah = useCallback(() => setOpenModal(true), []);
  const doRefresh = useCallback(() => setRows((prev) => [...prev]), []);

  const navigate = useNavigate();

  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter",
        onClick: () => setOpenFilter(true),
        className:
          "inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50",
        icon: <MdFilterList size={20} />,
      },
      {
        type: "button",
        title: "Tambah Stok",
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
    { variant: "page", title: "Barang Stok", backTo: "/management", actions },
    [actions]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm((f) => ({ ...f, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.barang_id || !form.tanggal_masuk || !form.jumlah_stok) {
      alert("Barang, tanggal masuk, dan jumlah stok wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      const today = new Date().toISOString().slice(0, 10);
      const newItem = {
        id: Math.max(0, ...rows.map((r) => r.id)) + 1,
        toko_id: form.toko_id ? parseInt(form.toko_id, 10) : null,
        barang_id: parseInt(form.barang_id, 10),
        harga_dasar: form.harga_dasar ? parseInt(form.harga_dasar, 10) : 0,
        tanggal_masuk: form.tanggal_masuk,
        jumlah_stok: parseInt(form.jumlah_stok, 10),
        keterangan: form.keterangan || "",
        created_by: form.created_by ? parseInt(form.created_by, 10) : null,
        updated_by: null,
        sync_at: null,
        status: !!form.status,
        created_at: today,
        updated_at: today,
      };
      setRows((prev) => [newItem, ...prev]);
      setOpenModal(false);
      setForm({
        toko_id: "",
        barang_id: "",
        harga_dasar: "",
        tanggal_masuk: "",
        jumlah_stok: "",
        keterangan: "",
        created_by: "",
        status: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const goDetailBarang = (barangId) => navigate(`/stok/${barangId}`);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="p-4 md:p-6 border-b bg-white sticky top-0 z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari stok…"
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

          {/* Summary kecil */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50">
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

      {/* Table container (scroll di komponen ini saja) */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4 md:p-6">
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-50 sticky top-0">
                  <tr>
                    <Th w="80">#</Th>
                    <Th w="120">ID</Th>
                    <Th w="120">Toko</Th>
                    <Th w="120">Barang</Th>
                    <Th w="140" right>Harga Dasar</Th>
                    <Th w="140">Tanggal Masuk</Th>
                    <Th w="100" right>Jumlah</Th>
                    <Th>Keterangan</Th>
                    <Th w="110">Status</Th>
                    <Th w="110">Created By</Th>
                    <Th w="140">Created At</Th>
                    <Th w="120">Aksi</Th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="p-6 text-center text-gray-500">
                        Tidak ada data.
                      </td>
                    </tr>
                  ) : (
                    paged.map((item, idx) => (
                      <tr key={item.id} className="border-t">
                        <Td>{start + idx + 1}</Td>
                        <Td>{item.id}</Td>
                        <Td>{item.toko_id ?? "-"}</Td>
                        <Td>{item.barang_id ?? "-"}</Td>
                        <Td right>{rupiah(item.harga_dasar)}</Td>
                        <Td>{item.tanggal_masuk}</Td>
                        <Td right>{item.jumlah_stok}</Td>
                        <Td className="max-w-[360px]">
                          <span className="line-clamp-2">{item.keterangan}</span>
                        </Td>
                        <Td>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status ? "Aktif" : "Nonaktif"}
                          </span>
                        </Td>
                        <Td>{item.created_by ?? "-"}</Td>
                        <Td>{item.created_at}</Td>
                        <Td>
                          <button
                            onClick={() => goDetailBarang(item.barang_id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                            title="Lihat detail stok barang"
                          >
                            <MdArrowForward /> Detail
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer table */}
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex items-center justify-between">
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
      <Modal
        open={openFilter}
        title="Filter Barang Stok"
        onClose={() => setOpenFilter(false)}
      >
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Group label="Harga Minimum">
              <input
                type="number"
                name="minHarga"
                value={filterForm.minHarga}
                onChange={handleFilterChange}
                className="border rounded-lg px-3 py-2"
                placeholder="0"
              />
            </Group>
            <Group label="Harga Maksimum">
              <input
                type="number"
                name="maxHarga"
                value={filterForm.maxHarga}
                onChange={handleFilterChange}
                className="border rounded-lg px-3 py-2"
                placeholder="0"
              />
            </Group>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border"
              onClick={() => {
                setFilterForm({ status: "", minHarga: "", maxHarga: "" });
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

      <Modal
        open={openModal}
        title="Tambah Barang Stok"
        onClose={() => setOpenModal(false)}
      >
        <form className="grid gap-3" onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Group label="Toko ID">
              <input
                name="toko_id"
                value={form.toko_id}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="Contoh: 101"
                inputMode="numeric"
              />
            </Group>
            <Group label="Barang ID">
              <input
                name="barang_id"
                value={form.barang_id}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="Contoh: 201"
                inputMode="numeric"
                required
              />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Group label="Harga Dasar">
              <input
                name="harga_dasar"
                value={form.harga_dasar}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="0"
                inputMode="numeric"
              />
            </Group>
            <Group label="Tanggal Masuk">
              <input
                type="date"
                name="tanggal_masuk"
                value={form.tanggal_masuk}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                required
              />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Group label="Jumlah Stok">
              <input
                name="jumlah_stok"
                value={form.jumlah_stok}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="0"
                inputMode="numeric"
                required
              />
            </Group>
            <Group label="Created By">
              <input
                name="created_by"
                value={form.created_by}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                placeholder="1"
                inputMode="numeric"
              />
            </Group>
          </div>

          <Group label="Keterangan">
            <input
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Catatan (opsional)"
            />
          </Group>

          <Group label="Status Aktif">
            <div className="h-10 flex items-center px-3 border rounded-lg">
              <input
                type="checkbox"
                name="status"
                checked={!!form.status}
                onChange={handleChange}
              />
              <span className="ml-2">Aktif</span>
            </div>
          </Group>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => setOpenModal(false)}>
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Th({ children, w, right }) {
  return (
    <th
      className={`px-3 py-2 text-left font-semibold text-gray-700 ${right ? "text-right" : ""}`}
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
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Pagination({ page, totalPages, onPrev, onNext, onGoto, compact = false }) {
  const pages = useMemo(() => {
    const window = 2;
    const start = Math.max(1, page - window);
    const end = Math.min(totalPages, page + window);
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    if (!arr.includes(1)) arr.unshift(1);
    if (!arr.includes(totalPages)) arr.push(totalPages);
    return Array.from(new Set(arr)).sort((a, b) => a - b);
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
      >
        Prev
      </button>
      {!compact && pages.map((p, idx) => (
        <React.Fragment key={`${p}-${idx}`}>
          {idx > 0 && pages[idx - 1] + 1 !== p && <span className="px-1">…</span>}
          <button
            onClick={() => onGoto(p)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${p === page ? "bg-green-600 text-white border-green-600" : "hover:bg-gray-50"}`}
          >
            {p}
          </button>
        </React.Fragment>
      ))}
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}