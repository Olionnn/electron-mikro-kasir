import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { MdAdd, MdRefresh, MdFilterList } from "react-icons/md";

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

const rupiah = (n) =>
  `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function BarangStokPage() {
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false); // <-- filter modal
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

  // debounce search
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

    // filter tambahan dari modal filter
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

  const openTambah = useCallback(() => setOpenModal(true), []);
  const doRefresh = useCallback(() => setRows((prev) => [...prev]), []);

  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter Barang",
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

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      {/* Toolbar / Search */}
      <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <input
              type="text"
              placeholder="Cari stok…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 border border-gray-300 rounded-xl px-4 py-3"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
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
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.toko_id ?? "-"}</Td>
                    <Td>{item.barang_id ?? "-"}</Td>
                    <Td>{rupiah(item.harga_dasar)}</Td>
                    <Td>{item.tanggal_masuk}</Td>
                    <Td>{item.jumlah_stok}</Td>
                    <Td>{item.keterangan}</Td>
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
          <div className="flex justify-end gap-2">
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

      {/* Modal Tambah */}
      <Modal
        open={openModal}
        title="Tambah Barang Stok"
        onClose={() => setOpenModal(false)}
      >
        {/* form tambah seperti sebelumnya */}
      </Modal>
    </div>
  );
}

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
