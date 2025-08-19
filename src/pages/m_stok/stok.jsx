import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme";
import { MdAdd, MdRefresh, MdFilterList, MdSearch, MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";


// Dummy data untuk simulasi
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
    barang_id: 4,
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

// Helper untuk memformat angka ke Rupiah
const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function BarangStokPage() {
  // State untuk data tabel dan filter
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  // State untuk form tambah stok
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

  // State untuk form filter
  const [filterForm, setFilterForm] = useState({
    status: "",
    minHarga: "",
    maxHarga: "",
  });

  // State untuk pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const pageSizeOptions = [10, 25, 50, 100];

  // Debounce input pencarian untuk performa lebih baik
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Hook untuk mengambil token tema (warna)
  const { token } = useTheme();
  const primaryColor = token("--primary-700");
  const primaryLight = token("--primary-200");
  const primaryDarkColor = token("--primary-800");

  // Memoized filter data berdasarkan pencarian dan filter form
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

  // Reset halaman ke 1 saat filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [debounced, filterForm, pageSize]);

  // Kalkulasi data untuk pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  // Callback untuk membuka modal tambah
  const openTambah = useCallback(() => setOpenModal(true), []);
  // Callback untuk refresh data
  const doRefresh = useCallback(() => setRows((prev) => [...prev]), []);

  const navigate = useNavigate();

  // Konfigurasi aksi-aksi di navbar
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter",
        onClick: () => setOpenFilter(true),
        className:
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors duration-300",
        style: {
          color: primaryColor,
          borderColor: primaryColor,
          backgroundColor: primaryLight,
        },
        icon: <MdFilterList size={20} />,
      },
      {
        type: "button",
        title: "Tambah Stok",
        onClick: openTambah,
        className:
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors duration-300",
        style: { backgroundColor: primaryColor, borderColor: primaryColor },
        icon: <MdAdd size={20} />,
      },
      {
        type: "button",
        title: "Refresh",
        onClick: doRefresh,
        className:
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors duration-300",
        style: {
          color: primaryColor,
          borderColor: primaryColor,
          backgroundColor: primaryLight,
        },
        icon: <MdRefresh size={20} />,
      },
    ],
    [openTambah, doRefresh, primaryColor, primaryLight]
  );

  // Integrasi navbar dengan halaman
  useNavbar(
    { variant: "page", title: "Barang Stok", backTo: "/management", actions },
    [actions]
  );

  // Handler untuk input form tambah
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Handler untuk input form filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm((f) => ({ ...f, [name]: value }));
  };

  // Handler untuk submit form tambah
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

  // Handler untuk navigasi ke halaman detail barang
  const goDetailBarang = (barangId) => navigate(`/stok/${barangId}`);

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: token("--primary-100") }}>
      {/* Kontainer utama dengan padding */}
      <div className="p-4 md:p-8 flex-1 overflow-hidden flex flex-col">
        {/* Toolbar interaktif */}
        <div className="bg-violet-800 rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-10">
          <div className="relative w-full md:max-w-xs">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="Cari stok..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-white rounded-full  "
              style={{
                color: token("--primary-200"),
                borderColor: token("--primary-400"),
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-amber-50">
              <span className="font-semibold text-amber-50">{total}</span>
              <span className="text-amber-50">entri</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-50">Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="border rounded-lg px-2 py-1 text-sm focus:ring-2 transition-all duration-200"
                style={{
                  color: token("--primary-200"),
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Data dalam card */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-4 custom-scrollbar">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 border-b" style={{ backgroundColor: primaryLight, borderColor: token("--primary-900") }}>
                    <tr>
                      <Th w="60">#</Th>
                      <Th w="100">ID</Th>
                      <Th w="100">Toko</Th>
                      <Th w="100">Barang</Th>
                      <Th w="120" right>
                        Harga Dasar
                      </Th>
                      <Th w="140">Tanggal Masuk</Th>
                      <Th w="80" right>
                        Jumlah
                      </Th>
                      <Th>Keterangan</Th>
                      <Th w="100">Status</Th>
                      <Th w="100">Dibuat Oleh</Th>
                      <Th w="120">Dibuat Pada</Th>
                      <Th w="100">Aksi</Th>
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
                        <tr
                          key={item.id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <Td>{start + idx + 1}</Td>
                          <Td>{item.id}</Td>
                          <Td>{item.toko_id ?? "-"}</Td>
                          <Td>{item.barang_id ?? "-"}</Td>
                          <Td right>{rupiah(item.harga_dasar)}</Td>
                          <Td>{item.tanggal_masuk}</Td>
                          <Td right>{item.jumlah_stok}</Td>
                          <Td className="max-w-[300px]">
                            <span className="line-clamp-2 text-gray-700">{item.keterangan}</span>
                          </Td>
                          <Td>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.status
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                              style={{ borderColor: token("--primary-400"), color: primaryDarkColor }}
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
            </div>
          </div>
        </div>
        {/* Footer pagination */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="text-gray-600">
            Menampilkan <strong style={{ color: primaryDarkColor }}>{paged.length}</strong> dari <strong style={{ color: primaryDarkColor }}>{total}</strong> entri
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

      {/* Modal Filter */}
      <Modal
        open={openFilter}
        title="Filter Barang Stok"
        onClose={() => setOpenFilter(false)}
      >
        <form className="grid gap-4">
          <Group label="Status">
            <select
              name="status"
              value={filterForm.status}
              onChange={handleFilterChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
              style={{
                borderColor: token("--primary-400"),
                "--tw-ring-color": primaryColor,
              }}
            >
              <option value="">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </Group>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Harga Minimum">
              <input
                type="number"
                name="minHarga"
                value={filterForm.minHarga}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
                placeholder="0"
              />
            </Group>
            <Group label="Harga Maksimum">
              <input
                type="number"
                name="maxHarga"
                value={filterForm.maxHarga}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
                placeholder="0"
              />
            </Group>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border font-semibold transition-colors duration-200 hover:opacity-80"
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: primaryLight,
              }}
              onClick={() => {
                setFilterForm({ status: "", minHarga: "", maxHarga: "" });
                setOpenFilter(false);
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ backgroundColor: primaryColor }}
              onClick={() => setOpenFilter(false)}
            >
              Terapkan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah */}
      <Modal
        open={openModal}
        title="Tambah Barang Stok"
        onClose={() => setOpenModal(false)}
      >
        <form className="grid gap-4" onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Toko ID">
              <input
                name="toko_id"
                value={form.toko_id}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
                placeholder="Contoh: 101"
                inputMode="numeric"
              />
            </Group>
            <Group label="Barang ID">
              <input
                name="barang_id"
                value={form.barang_id}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
                placeholder="Contoh: 201"
                inputMode="numeric"
                required
              />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Harga Dasar">
              <input
                name="harga_dasar"
                value={form.harga_dasar}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
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
                className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
                required
              />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Jumlah Stok">
              <input
                name="jumlah_stok"
                value={form.jumlah_stok}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
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
                className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: token("--primary-400"),
                  "--tw-ring-color": primaryColor,
                }}
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
              className="border rounded-lg px-3 py-2 focus:ring-2 transition-all duration-200"
              style={{
                borderColor: token("--primary-400"),
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Catatan (opsional)"
            />
          </Group>

          <Group label="Status Aktif">
            <div className="h-10 flex items-center px-3 border rounded-lg"
              style={{
                borderColor: token("--primary-400"),
              }}>
              <input
                type="checkbox"
                name="status"
                checked={!!form.status}
                onChange={handleChange}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                style={{
                  "--tw-ring-color": primaryColor,
                }}
              />
              <span className="ml-2 text-sm text-gray-700">Aktif</span>
            </div>
          </Group>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border font-semibold transition-colors duration-200 hover:opacity-80"
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: primaryLight,
              }}
              onClick={() => setOpenModal(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-semibold transition-colors disabled:opacity-60"
              style={{ backgroundColor: primaryColor }}
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

// Komponen helper untuk header tabel
function Th({ children, w, right }) {
  const { token } = useTheme();
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
        right ? "text-right" : ""
      }`}
      style={{
        width: w,
        color: token("--primary-800")
      }}
    >
      {children}
    </th>
  );
}

// Komponen helper untuk sel data tabel
function Td({ children, right }) {
  const { token } = useTheme();
  return (
    <td className={`px-4 py-3 ${right ? "text-right" : ""}`}
      style={{
        color: token("--primary-800")
      }}
    >
      {children}
    </td>
  );
}

// Komponen helper untuk form group
function Group({ label, children }) {
  const { token } = useTheme();
  return (
    <label className="flex flex-col gap-2 text-sm font-medium"
      style={{
        color: token("--primary-800")
      }}>
      {label}
      {children}
    </label>
  );
}

// Komponen Pagination yang dioptimalkan
function Pagination({ page, totalPages, onPrev, onNext, onGoto }) {
  const { token } = useTheme();
  const primaryColor = token("--primary-700");
  const primaryDarkColor = token("--primary-800");

  const pages = useMemo(() => {
    const window = 2;
    const start = Math.max(1, page - window);
    const end = Math.min(totalPages, page + window);
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    if (!arr.includes(1) && totalPages > 1) {
      arr.unshift(1);
    }
    if (!arr.includes(totalPages) && totalPages > 1) {
      arr.push(totalPages);
    }
    const uniquePages = Array.from(new Set(arr)).sort((a, b) => a - b);
    return uniquePages;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 transition-colors hover:bg-gray-100"
        style={{ borderColor: token("--primary-400"), color: primaryDarkColor }}
      >
        &larr; Sebelumnya
      </button>
      {pages.map((p, idx) => (
        <React.Fragment key={`${p}-${idx}`}>
          {idx > 0 && pages[idx - 1] + 1 !== p && (
            <span className="px-1 text-gray-500">...</span>
          )}
          <button
            onClick={() => onGoto(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
              p === page
                ? "text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ backgroundColor: p === page ? primaryColor : "transparent" }}
          >
            {p}
          </button>
        </React.Fragment>
      ))}
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 transition-colors hover:bg-gray-100"
        style={{ borderColor: token("--primary-400"), color: primaryDarkColor }}
      >
        Selanjutnya &rarr;
      </button>
    </div>
  );
}