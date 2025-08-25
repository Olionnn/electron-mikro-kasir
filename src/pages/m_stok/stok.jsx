// src/pages/BarangStokPage.premium.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdRefresh,
  MdFilterList,
  MdSearch,
  MdArrowForward,
  MdViewList,
  MdViewModule,
  MdTableChart,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { useBarangStok } from "../../hooks/useBarangStok"; // ✅ pastikan path sesuai proyekmu

/**
 * BarangStokPage — Premium Redesign (Integrated with useBarangStok)
 * -----------------------------------------------------------------------------
 * - Server-side pagination + search + status filter
 * - CRUD lengkap (Create, Read, Update, Delete)
 * - 3 layout: table, cards, minimal (tetap seperti sebelumnya)
 * - Tanpa dummy data, semua dari hook useBarangStok (IPC → backend)
 */

const rupiah = (n) =>
  `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function BarangStokPage() {
  // THEME
  const theme = useTheme();
  const token = theme.token;

  const PRI200 = token("--primary-200") || "#B2B0E8";
  const PRI400 = token("--primary-400") || "#7A85C1";
  const PRI700 = token("--primary-700") || "#3B38A0";
  const PRI800 = token("--primary-800") || "#1A2A80";

  const BG = token("--bg") || "#F8FAFC";
  const SUR = token("--surface") || "#FFFFFF";
  const BRD = token("--border") || "#E5E7EB";
  const TXT = token("--text") || "#0F172A";
  const MUT = token("--muted") || "#64748B";

  const navigate = useNavigate();

  // HOOK DATA (server-side)
  const {
    items,
    pagination,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    getById,
  } = useBarangStok({
    pagination: { page: 1, limit: 10 },
    filter: { search: "", status: "", toko_id: "" },
  });

  // STATE UI
  const [layout, setLayout] = useState(() => {
    try {
      return localStorage.getItem("stok_layout") || "table";
    } catch {
      return "table";
    }
  });

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "aktif" | "nonaktif"
  const [pageSize, setPageSize] = useState(pagination.limit || 10);
  const [openFilter, setOpenFilter] = useState(false);

  // CREATE / EDIT modal
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const emptyForm = {
    toko_id: "",
    barang_id: "",
    harga_dasar: "",
    tanggal_masuk: "",
    jumlah_stok: "",
    keterangan: "",
    created_by: "",
    status: true,
  };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState(emptyForm);

  // NAVBAR
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Filter",
        onClick: () => setOpenFilter(true),
        className:
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors",
        style: { color: PRI700, borderColor: PRI700, backgroundColor: `${PRI200}22` },
        label: (
          <span className="inline-flex items-center gap-2">
            <MdFilterList size={18} />
            Filter
          </span>
        ),
      },
      {
        type: "button",
        title: "Tambah Stok",
        onClick: () => {
          setForm(emptyForm);
          setOpenCreate(true);
        },
        className:
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-colors",
        style: { backgroundColor: PRI700, borderColor: PRI700 },
        label: (
          <span className="inline-flex items-center gap-2">
            <MdAdd size={18} />
            Tambah
          </span>
        ),
      },
      {
        type: "button",
        title: "Refresh",
        onClick: () =>
          refresh({
            pagination: { page: pagination.page, limit: pageSize },
            filter: { search: debounced, status: statusFilter },
          }),
        className:
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors",
        style: { color: PRI700, borderColor: PRI700, backgroundColor: `${PRI200}22` },
        label: (
          <span className="inline-flex items-center gap-2">
            <MdRefresh size={18} />
            Refresh
          </span>
        ),
      },
      {
        type: "button",
        title: "Ganti Layout",
        onClick: () => {
          const order = ["table", "cards", "minimal"];
          const i = order.indexOf(layout);
          const next = order[(i + 1) % order.length];
          setLayout(next);
          try {
            localStorage.setItem("stok_layout", next);
          } catch {}
        },
        className:
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors",
        style: { color: PRI700, borderColor: PRI700, backgroundColor: `${PRI200}22` },
        label: (
          <span className="inline-flex items-center gap-1">
            {layout === "table" ? (
              <MdTableChart />
            ) : layout === "cards" ? (
              <MdViewModule />
            ) : (
              <MdViewList />
            )}{" "}
            Layout
          </span>
        ),
      },
    ],
    [PRI700, PRI200, layout, pagination.page, pageSize, debounced, statusFilter, refresh]
  );

  useNavbar({ variant: "page", title: "Barang Stok", backTo: "/management", actions }, [actions]);

  // SEARCH debounce → server refresh
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Trigger refresh saat mount & saat filter berubah
  useEffect(() => {
    refresh({
      pagination: { page: 1, limit: pageSize },
      filter: { search: debounced, status: statusFilter },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, statusFilter, pageSize]);

  // HANDLERS
  const handleChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const goDetailBarang = (barangId) => navigate(`/stok/${barangId}`);

  const onChangePage = (newPage) => {
    if (newPage < 1 || newPage > (pagination.pages || 1)) return;
    refresh({
      pagination: { page: newPage, limit: pageSize },
      filter: { search: debounced, status: statusFilter },
    });
  };

  const onChangePageSize = (newLimit) => {
    setPageSize(newLimit);
    // refresh dipicu oleh useEffect pageSize
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.barang_id || !form.tanggal_masuk || !form.jumlah_stok) {
      alert("Barang, tanggal masuk, dan jumlah stok wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      await create({
        toko_id: form.toko_id ? parseInt(form.toko_id, 10) : "",
        barang_id: parseInt(form.barang_id, 10),
        harga_dasar: form.harga_dasar ? parseInt(form.harga_dasar, 10) : 0,
        tanggal_masuk: form.tanggal_masuk,
        jumlah_stok: parseInt(form.jumlah_stok, 10),
        keterangan: form.keterangan || "",
        created_by: form.created_by ? parseInt(form.created_by, 10) : "",
        status: !!form.status,
      });
      setOpenCreate(false);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = useCallback(
    async (id) => {
      try {
        const row = await getById(id);
        if (!row) {
          alert("Data tidak ditemukan.");
          return;
        }
        setEditId(id);
        setFormEdit({
          toko_id: row.toko_id ?? "",
          barang_id: row.barang_id ?? "",
          harga_dasar: row.harga_dasar ?? "",
          tanggal_masuk: row.tanggal_masuk ?? "",
          jumlah_stok: row.jumlah_stok ?? "",
          keterangan: row.keterangan ?? "",
          created_by: row.created_by ?? "",
          status: !!row.status,
        });
        setOpenEdit(true);
      } catch (e) {
        console.error(e);
        alert("Gagal mengambil data.");
      }
    },
    [getById]
  );

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await update(editId, {
        toko_id: formEdit.toko_id ? parseInt(formEdit.toko_id, 10) : "",
        barang_id: formEdit.barang_id ? parseInt(formEdit.barang_id, 10) : "",
        harga_dasar: formEdit.harga_dasar ? parseInt(formEdit.harga_dasar, 10) : 0,
        tanggal_masuk: formEdit.tanggal_masuk,
        jumlah_stok: formEdit.jumlah_stok ? parseInt(formEdit.jumlah_stok, 10) : 0,
        keterangan: formEdit.keterangan || "",
        created_by: formEdit.created_by ? parseInt(formEdit.created_by, 10) : "",
        status: !!formEdit.status,
      });
      setOpenEdit(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Gagal mengubah data.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      setDeletingId(id);
      await remove(id);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Gagal menghapus data.");
    } finally {
      setDeletingId(null);
    }
  };

  // PRIMITIVES
  const Th = ({ children, w, right }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
        right ? "text-right" : ""
      }`}
      style={{ width: w, color: PRI800 }}
    >
      {children}
    </th>
  );

  const Td = ({ children, right }) => (
    <td className={`px-4 py-3 ${right ? "text-right" : ""}`} style={{ color: TXT }}>
      {children}
    </td>
  );

  const Group = ({ label, children }) => (
    <label className="flex flex-col gap-2 text-sm font-medium" style={{ color: TXT }}>
      {label}
      {children}
    </label>
  );

  const Pagination = ({ page, pages, total, onPrev, onNext, onGoto }) => {
    if (!pages || pages <= 1) return null;
    // Window kecil (2) — angka 1 ... [page-2..page+2] ... last
    const win = 2;
    const s = Math.max(1, page - win);
    const e = Math.min(pages, page + win);
    const seq = [];
    for (let i = s; i <= e; i++) seq.push(i);
    if (!seq.includes(1)) seq.unshift(1);
    if (!seq.includes(pages)) seq.push(pages);

    const unique = Array.from(new Set(seq)).sort((a, b) => a - b);

    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
          style={{ borderColor: BRD, color: TXT }}
        >
          &larr; Sebelumnya
        </button>
        {unique.map((p, i) => (
          <React.Fragment key={`${p}-${i}`}>
            {i > 0 && unique[i - 1] + 1 !== p && (
              <span className="px-1" style={{ color: MUT }}>
                …
              </span>
            )}
            <button
              onClick={() => onGoto(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                p === page ? "text-white shadow" : "hover:bg-gray-50"
              }`}
              style={{
                backgroundColor: p === page ? PRI700 : "transparent",
                color: p === page ? "#fff" : TXT,
              }}
            >
              {p}
            </button>
          </React.Fragment>
        ))}
        <button
          onClick={onNext}
          disabled={page === pages}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
          style={{ borderColor: BRD, color: TXT }}
        >
          Selanjutnya &rarr;
        </button>
      </div>
    );
  };

  // LAYOUTS
  const LayoutTable = () => (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto pb-4 custom-scrollbar">
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{ background: SUR, border: `1px solid ${BRD}` }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className="sticky top-0"
                style={{ background: `${PRI200}22`, borderBottom: `1px solid ${BRD}` }}
              >
                <tr>
                  <Th w="60">#</Th>
                  <Th w="100">ID</Th>
                  <Th w="100">Toko</Th>
                  <Th w="100">Barang</Th>
                  <Th w="140" right>
                    Harga Dasar
                  </Th>
                  <Th w="140">Tanggal Masuk</Th>
                  <Th w="100" right>
                    Jumlah
                  </Th>
                  <Th>Keterangan</Th>
                  <Th w="100">Status</Th>
                  <Th w="120">Dibuat Oleh</Th>
                  <Th w="120">Dibuat Pada</Th>
                  <Th w="180">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="p-6 text-center" style={{ color: MUT }}>
                      Memuat data…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-6 text-center" style={{ color: MUT }}>
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50"
                      style={{ borderColor: BRD }}
                    >
                      <Td>{(pagination.page - 1) * pagination.limit + idx + 1}</Td>
                      <Td>{item.id}</Td>
                      <Td>{item.toko_id ?? "-"}</Td>
                      <Td>{item.barang_id ?? "-"}</Td>
                      <Td right>{rupiah(item.harga_dasar)}</Td>
                      <Td>{item.tanggal_masuk}</Td>
                      <Td right>{item.jumlah_stok}</Td>
                      <Td className="max-w-[320px]">
                        <span className="line-clamp-2" style={{ color: TXT }}>
                          {item.keterangan}
                        </span>
                      </Td>
                      <Td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status ? "Aktif" : "Nonaktif"}
                        </span>
                      </Td>
                      <Td>{item.created_by ?? "-"}</Td>
                      <Td>{item.created_at ?? "-"}</Td>
                      <Td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => goDetailBarang(item.barang_id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
                            style={{ borderColor: BRD, color: PRI800 }}
                            title="Lihat detail stok"
                          >
                            <MdArrowForward /> Detail
                          </button>
                          <button
                            onClick={() => openEditModal(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
                            style={{ borderColor: BRD, color: PRI800 }}
                            title="Edit"
                          >
                            <MdEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50 disabled:opacity-60"
                            style={{ borderColor: BRD, color: "#b91c1c" }}
                            title="Hapus"
                          >
                            <MdDelete /> {deletingId === item.id ? "Menghapus…" : "Hapus"}
                          </button>
                        </div>
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
  );

  const LayoutCards = () => (
    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-10" style={{ color: MUT }}>
            Memuat data…
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-10" style={{ color: MUT }}>
            Tidak ada data.
          </div>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl p-4 transition-transform hover:scale-[1.01]"
              style={{ background: SUR, border: `1px solid ${BRD}` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs" style={{ color: MUT }}>
                    Barang ID
                  </div>
                  <div className="text-lg font-semibold" style={{ color: TXT }}>
                    {it.barang_id}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    it.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {it.status ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs" style={{ color: MUT }}>
                    Toko
                  </div>
                  <div className="font-medium" style={{ color: TXT }}>
                    {it.toko_id ?? "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: MUT }}>
                    Jumlah
                  </div>
                  <div className="font-medium" style={{ color: TXT }}>
                    {it.jumlah_stok}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: MUT }}>
                    Harga Dasar
                  </div>
                  <div className="font-medium" style={{ color: TXT }}>
                    {rupiah(it.harga_dasar)}
                  </div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: MUT }}>
                    Tgl Masuk
                  </div>
                  <div className="font-medium" style={{ color: TXT }}>
                    {it.tanggal_masuk}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm line-clamp-2" style={{ color: MUT }}>
                {it.keterangan}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs" style={{ color: MUT }}>
                  By {it.created_by ?? "-"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => goDetailBarang(it.barang_id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
                    style={{ borderColor: BRD, color: PRI800 }}
                  >
                    <MdArrowForward /> Detail
                  </button>
                  <button
                    onClick={() => openEditModal(it.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
                    style={{ borderColor: BRD, color: PRI800 }}
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    disabled={deletingId === it.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50 disabled:opacity-60"
                    style={{ borderColor: BRD, color: "#b91c1c" }}
                  >
                    <MdDelete /> {deletingId === it.id ? "…" : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const LayoutMinimal = () => (
    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
      <ul
        className="rounded-2xl overflow-hidden divide-y"
        style={{ background: SUR, border: `1px solid ${BRD}`, borderColor: BRD }}
      >
        {loading ? (
          <li className="p-6 text-center" style={{ color: MUT }}>
            Memuat data…
          </li>
        ) : items.length === 0 ? (
          <li className="p-6 text-center" style={{ color: MUT }}>
            Tidak ada data.
          </li>
        ) : (
          items.map((it, i) => (
            <li key={it.id} className="px-4 py-3 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl grid place-items-center text-sm font-semibold"
                style={{ background: `${PRI200}33`, color: PRI700 }}
              >
                {(pagination.page - 1) * pagination.limit + i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium truncate" style={{ color: TXT }}>
                    Barang {it.barang_id}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      it.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {it.status ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <div className="text-xs truncate" style={{ color: MUT }}>
                  {it.keterangan}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold" style={{ color: TXT }}>
                  {rupiah(it.harga_dasar)}
                </div>
                <div className="text-xs" style={{ color: MUT }}>
                  {it.jumlah_stok} pcs • {it.tanggal_masuk}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goDetailBarang(it.barang_id)}
                  className="ml-2 px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50"
                  style={{ borderColor: BRD, color: PRI800 }}
                >
                  <MdArrowForward className="inline" /> Detail
                </button>
                <button
                  onClick={() => openEditModal(it.id)}
                  className="ml-2 px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50"
                  style={{ borderColor: BRD, color: PRI800 }}
                >
                  <MdEdit className="inline" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(it.id)}
                  disabled={deletingId === it.id}
                  className="ml-2 px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50 disabled:opacity-60"
                  style={{ borderColor: BRD, color: "#b91c1c" }}
                >
                  <MdDelete className="inline" /> {deletingId === it.id ? "…" : "Hapus"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  // RENDER
  return (
    <div className="w-full h-full flex flex-col" style={{ background: BG }}>
      {/* Toolbar */}
      <div className="px-4 md:px-8 pt-4 sticky top-0 z-10">
        <div
          className="rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
          style={{
            background: `linear-gradient(180deg, ${PRI200}22 0%, ${SUR} 60%)`,
            border: `1px solid ${BRD}`,
          }}
        >
          <div className="relative w-full md:max-w-sm">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUT }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari stok…"
              className="w-full pl-10 pr-3 py-2 rounded-xl outline-none text-sm"
              style={{ background: SUR, border: `1px solid ${BRD}`, color: TXT }}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto text-sm">
            <div className="flex items-center gap-2" style={{ color: MUT }}>
              <span>Total</span>
              <strong style={{ color: TXT }}>{pagination.total || 0}</strong>
              <span>entri</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: MUT }}>Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => onChangePageSize(parseInt(e.target.value))}
                className="border rounded-lg px-2 py-1 text-sm"
                style={{ borderColor: BRD, color: TXT }}
              >
                {[10, 25, 50, 100].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 flex-1 overflow-hidden flex flex-col">
        {error && (
          <div
            className="mb-3 p-3 rounded-lg border"
            style={{ borderColor: "#fecaca", background: "#fee2e2", color: "#7f1d1d" }}
          >
            {String(error?.message || error)}
          </div>
        )}

        {layout === "table" && <LayoutTable />}
        {layout === "cards" && <LayoutCards />}
        {layout === "minimal" && <LayoutMinimal />}

        {/* Footer pagination */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div style={{ color: MUT }}>
            Menampilkan{" "}
            <strong style={{ color: TXT }}>
              {loading ? "…" : items.length}
            </strong>{" "}
            dari{" "}
            <strong style={{ color: TXT }}>{pagination.total || 0}</strong> entri
          </div>
          <Pagination
            page={pagination.page || 1}
            pages={pagination.pages || 1}
            total={pagination.total || 0}
            onPrev={() => onChangePage((pagination.page || 1) - 1)}
            onNext={() => onChangePage((pagination.page || 1) + 1)}
            onGoto={(p) => onChangePage(p)}
          />
        </div>
      </div>

      {/* Modal Filter */}
      <Modal open={openFilter} title="Filter Barang Stok" onClose={() => setOpenFilter(false)}>
        <form className="grid gap-4">
          <Group label="Status">
            <select
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2"
              style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
            >
              <option value="">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </Group>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border font-semibold hover:opacity-90"
              style={{ borderColor: PRI700, color: PRI700, background: `${PRI200}33` }}
              onClick={() => {
                setStatusFilter("");
                setOpenFilter(false);
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90"
              style={{ background: PRI700 }}
              onClick={() => setOpenFilter(false)}
            >
              Terapkan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah (CREATE) */}
      <Modal open={openCreate} title="Tambah Barang Stok" onClose={() => setOpenCreate(false)}>
        <form className="grid gap-4" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Toko ID">
              <input
                name="toko_id"
                value={form.toko_id}
                onChange={(e) => handleChange(e, setForm)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="Contoh: 101"
                inputMode="numeric"
              />
            </Group>
            <Group label="Barang ID">
              <input
                name="barang_id"
                value={form.barang_id}
                onChange={(e) => handleChange(e, setForm)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
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
                onChange={(e) => handleChange(e, setForm)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="0"
                inputMode="numeric"
              />
            </Group>
            <Group label="Tanggal Masuk">
              <input
                type="date"
                name="tanggal_masuk"
                value={form.tanggal_masuk}
                onChange={(e) => handleChange(e, setForm)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                required
              />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Jumlah Stok">
              <input
                name="jumlah_stok"
                value={form.jumlah_stok}
                onChange={(e) => handleChange(e, setForm)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="0"
                inputMode="numeric"
                required
              />
            </Group>
            <Group label="Created By">
              <input
                name="created_by"
                value={form.created_by}
                onChange={(e) => handleChange(e, setForm)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="1"
                inputMode="numeric"
              />
            </Group>
          </div>

          <Group label="Keterangan">
            <input
              name="keterangan"
              value={form.keterangan}
              onChange={(e) => handleChange(e, setForm)}
              className="border rounded-lg px-3 py-2 focus:ring-2"
              style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
              placeholder="Catatan (opsional)"
            />
          </Group>

          <Group label="Status Aktif">
            <div className="h-10 flex items-center px-3 border rounded-lg" style={{ borderColor: BRD }}>
              <input
                type="checkbox"
                name="status"
                checked={!!form.status}
                onChange={(e) => handleChange(e, setForm)}
                className="h-4 w-4 rounded"
                style={{ accentColor: PRI700 }}
              />
              <span className="ml-2 text-sm" style={{ color: TXT }}>
                Aktif
              </span>
            </div>
          </Group>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border font-semibold hover:opacity-90"
              style={{ borderColor: PRI700, color: PRI700, background: `${PRI200}33` }}
              onClick={() => setOpenCreate(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-60"
              style={{ background: PRI700 }}
              disabled={saving}
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit (UPDATE) */}
      <Modal open={openEdit} title="Edit Barang Stok" onClose={() => setOpenEdit(false)}>
        <form className="grid gap-4" onSubmit={handleEdit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Toko ID">
              <input
                name="toko_id"
                value={formEdit.toko_id}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="Contoh: 101"
                inputMode="numeric"
              />
            </Group>
            <Group label="Barang ID">
              <input
                name="barang_id"
                value={formEdit.barang_id}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
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
                value={formEdit.harga_dasar}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="0"
                inputMode="numeric"
              />
            </Group>
            <Group label="Tanggal Masuk">
              <input
                type="date"
                name="tanggal_masuk"
                value={formEdit.tanggal_masuk}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                required
              />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Jumlah Stok">
              <input
                name="jumlah_stok"
                value={formEdit.jumlah_stok}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="0"
                inputMode="numeric"
                required
              />
            </Group>
            <Group label="Created By">
              <input
                name="created_by"
                value={formEdit.created_by}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="border rounded-lg px-3 py-2 focus:ring-2"
                style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
                placeholder="1"
                inputMode="numeric"
              />
            </Group>
          </div>

          <Group label="Keterangan">
            <input
              name="keterangan"
              value={formEdit.keterangan}
              onChange={(e) => handleChange(e, setFormEdit)}
              className="border rounded-lg px-3 py-2 focus:ring-2"
              style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}
              placeholder="Catatan (opsional)"
            />
          </Group>

          <Group label="Status Aktif">
            <div className="h-10 flex items-center px-3 border rounded-lg" style={{ borderColor: BRD }}>
              <input
                type="checkbox"
                name="status"
                checked={!!formEdit.status}
                onChange={(e) => handleChange(e, setFormEdit)}
                className="h-4 w-4 rounded"
                style={{ accentColor: PRI700 }}
              />
              <span className="ml-2 text-sm" style={{ color: TXT }}>
                Aktif
              </span>
            </div>
          </Group>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border font-semibold hover:opacity-90"
              style={{ borderColor: PRI700, color: PRI700, background: `${PRI200}33` }}
              onClick={() => setOpenEdit(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-60"
              style={{ background: PRI700 }}
              disabled={saving}
            >
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
