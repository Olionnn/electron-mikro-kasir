import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh } from "react-icons/md";

// ---- dummy data (sesuai model BarangStok)
const dummyData = [
  {
    id: 1,
    toko_id: 101,
    barang_id: 201,
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
];

// util kecil
const rupiah = (n) =>
  `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function BarangStokPage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [openModal, setOpenModal] = useState(false);
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

  // debounce search 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
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
      ]
        .map((v) => String(v ?? "").toLowerCase());
      return tokens.some((t) => t.includes(q));
    });
  }, [rows, debounced]);

  // ----- Navbar (seperti halaman pajak/diskon)
  const openTambah = useCallback(() => setOpenModal(true), []);
  const doRefresh = useCallback(() => {
    // tetap dummy: cukup "refresh" ulang state
    setRows((prev) => [...prev]);
  }, []);

  const actions = useMemo(
    () => [
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

  // ----- Modal form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () =>
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

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    // validasi minimal
    if (!form.barang_id || !form.tanggal_masuk || !form.jumlah_stok) {
      alert("Barang, tanggal masuk, dan jumlah stok wajib diisi.");
      return;
    }
    try {
      setSaving(true);
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
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
      };
      setRows((prev) => [newItem, ...prev]);
      setOpenModal(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

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
              placeholder="Cari stok… (id, barang, tanggal, keterangan, dsb.)"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {filtered.length} entri
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
                  <Th>Barang</Th>
                  <Th>Harga Dasar</Th>
                  <Th>Tanggal Masuk</Th>
                  <Th>Jumlah</Th>
                  <Th>Keterangan</Th>
                  <Th>Status</Th>
                  <Th>Created By</Th>
                  <Th>Created At</Th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-gray-500">
                      Belum ada data yang cocok.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-green-50/50 transition-colors"
                    >
                      <Td>{item.id}</Td>
                      <Td>{item.toko_id ?? "-"}</Td>
                      <Td>{item.barang_id ?? "-"}</Td>
                      <Td>{rupiah(item.harga_dasar)}</Td>
                      <Td>{item.tanggal_masuk || "-"}</Td>
                      <Td>{item.jumlah_stok}</Td>
                      <Td className="max-w-[280px] truncate" title={item.keterangan || "-"}>
                        {item.keterangan || "-"}
                      </Td>
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
                      <Td>{item.created_by ?? "-"}</Td>
                      <Td>{item.created_at}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah Stok */}
      <Modal
        open={openModal}
        title="Tambah Barang Stok"
        onClose={() => setOpenModal(false)}
      >
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3">
          <Group label="Toko ID (opsional)">
            <input
              name="toko_id"
              value={form.toko_id}
              onChange={handleChange}
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder="cth: 101"
            />
          </Group>

          <div className="grid grid-cols-2 gap-3">
            <Group label="Barang ID *">
              <input
                name="barang_id"
                value={form.barang_id}
                onChange={handleChange}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="cth: 201"
                required
              />
            </Group>
            <Group label="Harga Dasar">
              <input
                name="harga_dasar"
                value={form.harga_dasar}
                onChange={handleChange}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="50000"
                min="0"
              />
            </Group>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Group label="Tanggal Masuk *">
              <input
                name="tanggal_masuk"
                value={form.tanggal_masuk}
                onChange={handleChange}
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                required
              />
            </Group>
            <Group label="Jumlah Stok *">
              <input
                name="jumlah_stok"
                value={form.jumlah_stok}
                onChange={handleChange}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="cth: 10"
                min="0"
                required
              />
            </Group>
          </div>

          <Group label="Keterangan">
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              rows={3}
              placeholder="Catatan stok…"
            />
          </Group>

          <div className="grid grid-cols-2 gap-3">
            <Group label="Created By (User ID)">
              <input
                name="created_by"
                value={form.created_by}
                onChange={handleChange}
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="cth: 1"
              />
            </Group>
            <Group label="Status Aktif">
              <div className="h-10 flex items-center px-3 border rounded-lg">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                />
                <span className="ml-2">Aktif</span>
              </div>
            </Group>
          </div>

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
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------- sub components ---------- */
function Th({ children }) {
  return (
    <th className="px-3 py-2 text-xs font-semibold text-gray-600 border-b">
      {children}
    </th>
  );
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