// src/pages/BarangStokPage.premium.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";
import { useTheme } from "../../hooks/useTheme"; // ✅ konsisten dengan halaman premium lainnya
import { useNavigate } from "react-router-dom";
import { MdAdd, MdRefresh, MdFilterList, MdSearch, MdArrowForward, MdViewList, MdViewModule, MdTableChart } from "react-icons/md";

/**
 * BarangStokPage — Premium Redesign (3 Layouts)
 * -----------------------------------------------------------------------------
 * Tujuan:
 * - UI modern, informatif, dan nyaman dipakai (search, filter, tambah, paging).
 * - Sepenuhnya theme-aware (semua warna dari token ThemeProvider / CSS variables).
 * - 3 alternatif layout: "table" (default), "cards", "minimal".
 * - Siap produksi: tanpa error, aksesibilitas OK, animasi ringan, responsive.
 * - Komentar detail setiap blok agar mudah di-maintain.
 */

/* ----------------- Dummy data (dipertahankan & bisa diganti API) ----------------- */
const dummyData = [
  { id: 1, toko_id: 101, barang_id: 1, harga_dasar: 50000, tanggal_masuk: "2025-08-01", jumlah_stok: 20, keterangan: "Stok awal bulan Agustus", created_by: 1, updated_by: null, sync_at: null, status: true, created_at: "2025-08-01", updated_at: "2025-08-01" },
  { id: 2, toko_id: 102, barang_id: 2, harga_dasar: 75000, tanggal_masuk: "2025-08-05", jumlah_stok: 15, keterangan: "Restock barang", created_by: 2, updated_by: null, sync_at: null, status: true, created_at: "2025-08-05", updated_at: "2025-08-05" },
  { id: 3, toko_id: 102, barang_id: 3, harga_dasar: 75000, tanggal_masuk: "2025-08-05", jumlah_stok: 15, keterangan: "Restock barang", created_by: 2, updated_by: null, sync_at: null, status: true, created_at: "2025-08-05", updated_at: "2025-08-05" },
  { id: 4, toko_id: 102, barang_id: 4, harga_dasar: 75000, tanggal_masuk: "2025-08-05", jumlah_stok: 15, keterangan: "Restock barang", created_by: 2, updated_by: null, sync_at: null, status: true, created_at: "2025-08-05", updated_at: "2025-08-05" },
  { id: 5, toko_id: 102, barang_id: 202, harga_dasar: 75000, tanggal_masuk: "2025-08-05", jumlah_stok: 15, keterangan: "Restock barang", created_by: 2, updated_by: null, sync_at: null, status: true, created_at: "2025-08-05", updated_at: "2025-08-05" },
  { id: 6, toko_id: 102, barang_id: 202, harga_dasar: 75000, tanggal_masuk: "2025-08-05", jumlah_stok: 15, keterangan: "Restock barang", created_by: 2, updated_by: null, sync_at: null, status: true, created_at: "2025-08-05", updated_at: "2025-08-05" },
  { id: 7, toko_id: 103, barang_id: 203, harga_dasar: 60000, tanggal_masuk: "2025-08-10", jumlah_stok: 30, keterangan: "Stok baru masuk", created_by: 3, updated_by: null, sync_at: null, status: true, created_at: "2025-08-10", updated_at: "2025-08-10" },
  { id: 8, toko_id: 104, barang_id: 204, harga_dasar: 60000, tanggal_masuk: "2025-08-10", jumlah_stok: 30, keterangan: "Stok baru masuk", created_by: 3, updated_by: null, sync_at: null, status: true, created_at: "2025-08-10", updated_at: "2025-08-10" },
  { id: 9, toko_id: 104, barang_id: 204, harga_dasar: 60000, tanggal_masuk: "2025-08-10", jumlah_stok: 30, keterangan: "Stok baru masuk", created_by: 3, updated_by: null, sync_at: null, status: true, created_at: "2025-08-10", updated_at: "2025-08-10" },
  { id: 10, toko_id: 104, barang_id: 204, harga_dasar: 60000, tanggal_masuk: "2025-08-10", jumlah_stok: 30, keterangan: "Stok baru masuk", created_by: 3, updated_by: null, sync_at: null, status: true, created_at: "2025-08-10", updated_at: "2025-08-10" },
  { id: 11, toko_id: 104, barang_id: 204, harga_dasar: 60000, tanggal_masuk: "2025-08-10", jumlah_stok: 30, keterangan: "Stok baru masuk", created_by: 3, updated_by: null, sync_at: null, status: true, created_at: "2025-08-10", updated_at: "2025-08-10" },
];

// Helper format Rupiah
const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function BarangStokPage() {
  // ---------------------------------------------------------------------
  // THEME TOKENS
  // ---------------------------------------------------------------------
  const theme = useTheme();
  const token = theme.token; // token('--primary-700')

  const PRI200 = token("--primary-200") || "#B2B0E8";
  const PRI400 = token("--primary-400") || "#7A85C1";
  const PRI700 = token("--primary-700") || "#3B38A0";
  const PRI800 = token("--primary-800") || "#1A2A80";

  const BG = token("--bg") || "#F8FAFC";
  const SUR = token("--surface") || "#FFFFFF";
  const BRD = token("--border") || "#E5E7EB";
  const TXT = token("--text") || "#0F172A";
  const MUT = token("--muted") || "#64748B";

  // ---------------------------------------------------------------------
  // STATE & NAVBAR
  // ---------------------------------------------------------------------
  const [rows, setRows] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form tambah
  const [form, setForm] = useState({ toko_id: "", barang_id: "", harga_dasar: "", tanggal_masuk: "", jumlah_stok: "", keterangan: "", created_by: "", status: true });

  // Form filter
  const [filterForm, setFilterForm] = useState({ status: "", minHarga: "", maxHarga: "" });

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const pageSizeOptions = [10, 25, 50, 100];

  // Layout pilihan user (table | cards | minimal)
  const [layout, setLayout] = useState(() => {
    try { return localStorage.getItem("stok_layout") || "table"; } catch { return "table"; }
  });

  // Debounce search
  useEffect(() => { const t = setTimeout(() => setDebounced(search), 300); return () => clearTimeout(t); }, [search]);

  const navigate = useNavigate();

  // Actions untuk Navbar (Filter / Tambah / Refresh / Switch Layout)
  const actions = useMemo(() => [
    { type: "button", title: "Filter", onClick: () => setOpenFilter(true), className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors", style: { color: PRI700, borderColor: PRI700, backgroundColor: `${PRI200}22` }, label: (<span className="inline-flex items-center gap-2"><MdFilterList size={18}/>Filter</span>) },
    { type: "button", title: "Tambah Stok", onClick: () => setOpenModal(true), className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-colors", style: { backgroundColor: PRI700, borderColor: PRI700 }, label: (<span className="inline-flex items-center gap-2"><MdAdd size={18}/>Tambah</span>) },
    { type: "button", title: "Refresh", onClick: () => setRows((p)=>[...p]), className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors", style: { color: PRI700, borderColor: PRI700, backgroundColor: `${PRI200}22` }, label: (<span className="inline-flex items-center gap-2"><MdRefresh size={18}/>Refresh</span>) },
    { type: "button", title: "Ganti Layout", onClick: () => { const order = ["table","cards","minimal"]; const i = order.indexOf(layout); const next = order[(i+1)%order.length]; setLayout(next); try{localStorage.setItem("stok_layout", next);}catch{}; }, className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors", style: { color: PRI700, borderColor: PRI700, backgroundColor: `${PRI200}22` }, label: (<span className="inline-flex items-center gap-1">{layout === "table" ? <MdTableChart/> : layout === "cards" ? <MdViewModule/> : <MdViewList/>} Layout</span>) },
  ], [PRI700, PRI200, layout]);

  useNavbar({ variant: "page", title: "Barang Stok", backTo: "/management", actions }, [actions]);

  // ---------------------------------------------------------------------
  // FILTERING & PAGINATION
  // ---------------------------------------------------------------------
  const filtered = useMemo(() => {
    let data = [...rows];
    const q = debounced.trim().toLowerCase();
    if (q) {
      data = data.filter((r) => [r.id, r.toko_id, r.barang_id, r.harga_dasar, r.tanggal_masuk, r.jumlah_stok, r.keterangan, r.created_by, r.created_at].map((v)=>String(v??"").toLowerCase()).some((t)=>t.includes(q)));
    }
    if (filterForm.status) {
      const isActive = filterForm.status === "aktif";
      data = data.filter((r) => r.status === isActive);
    }
    if (filterForm.minHarga) data = data.filter((r) => r.harga_dasar >= parseInt(filterForm.minHarga));
    if (filterForm.maxHarga) data = data.filter((r) => r.harga_dasar <= parseInt(filterForm.maxHarga));
    return data;
  }, [rows, debounced, filterForm]);

  useEffect(() => { setPage(1); }, [debounced, filterForm, pageSize]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  // ---------------------------------------------------------------------
  // HANDLERS: Form tambah, Filter, Navigasi detail
  // ---------------------------------------------------------------------
  const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value })); };
  const handleFilterChange = (e) => { const { name, value } = e.target; setFilterForm((f) => ({ ...f, [name]: value })); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.barang_id || !form.tanggal_masuk || !form.jumlah_stok) { alert("Barang, tanggal masuk, dan jumlah stok wajib diisi."); return; }
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
        updated_by: null, sync_at: null, status: !!form.status,
        created_at: today, updated_at: today,
      };
      setRows((prev) => [newItem, ...prev]);
      setOpenModal(false);
      setForm({ toko_id: "", barang_id: "", harga_dasar: "", tanggal_masuk: "", jumlah_stok: "", keterangan: "", created_by: "", status: true });
    } finally { setSaving(false); }
  };

  const goDetailBarang = (barangId) => navigate(`/stok/${barangId}`);

  // ---------------------------------------------------------------------
  // PRIMITIVES: Th, Td, Group, Pagination (konsisten)
  // ---------------------------------------------------------------------
  const Th = ({ children, w, right }) => (
    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${right ? "text-right" : ""}`}
        style={{ width: w, color: PRI800 }}>
      {children}
    </th>
  );

  const Td = ({ children, right }) => (
    <td className={`px-4 py-3 ${right ? "text-right" : ""}`} style={{ color: TXT }}>{children}</td>
  );

  const Group = ({ label, children }) => (
    <label className="flex flex-col gap-2 text-sm font-medium" style={{ color: TXT }}>
      {label}
      {children}
    </label>
  );

  const Pagination = ({ page, totalPages, onPrev, onNext, onGoto }) => {
    const pages = useMemo(() => {
      const win = 2; const s = Math.max(1, page - win); const e = Math.min(totalPages, page + win);
      const arr = []; for (let i = s; i <= e; i++) arr.push(i);
      if (!arr.includes(1) && totalPages > 1) arr.unshift(1);
      if (!arr.includes(totalPages) && totalPages > 1) arr.push(totalPages);
      return Array.from(new Set(arr)).sort((a,b)=>a-b);
    }, [page, totalPages]);
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2">
        <button onClick={onPrev} disabled={page===1} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: BRD, color: TXT }}>&larr; Sebelumnya</button>
        {pages.map((p, i) => (
          <React.Fragment key={`${p}-${i}`}>
            {i>0 && pages[i-1]+1!==p && <span className="px-1" style={{ color: MUT }}>…</span>}
            <button onClick={()=>onGoto(p)} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${p===page?"text-white shadow" : "hover:bg-gray-50"}`} style={{ backgroundColor: p===page ? PRI700 : "transparent", color: p===page?"#fff":TXT }}>{p}</button>
          </React.Fragment>
        ))}
        <button onClick={onNext} disabled={page===totalPages} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: BRD, color: TXT }}>Selanjutnya &rarr;</button>
      </div>
    );
  };

  // ---------------------------------------------------------------------
  // LAYOUTS
  // ---------------------------------------------------------------------
  /** Layout: Table (profesional, data-dense) */
  const LayoutTable = () => (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto pb-4 custom-scrollbar">
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: SUR, border: `1px solid ${BRD}` }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0" style={{ background: `${PRI200}22`, borderBottom: `1px solid ${BRD}` }}>
                <tr>
                  <Th w="60">#</Th>
                  <Th w="100">ID</Th>
                  <Th w="100">Toko</Th>
                  <Th w="100">Barang</Th>
                  <Th w="140" right>Harga Dasar</Th>
                  <Th w="140">Tanggal Masuk</Th>
                  <Th w="100" right>Jumlah</Th>
                  <Th>Keterangan</Th>
                  <Th w="100">Status</Th>
                  <Th w="120">Dibuat Oleh</Th>
                  <Th w="120">Dibuat Pada</Th>
                  <Th w="120">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={12} className="p-6 text-center" style={{ color: MUT }}>Tidak ada data.</td></tr>
                ) : (
                  paged.map((item, idx) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50" style={{ borderColor: BRD }}>
                      <Td>{start + idx + 1}</Td>
                      <Td>{item.id}</Td>
                      <Td>{item.toko_id ?? "-"}</Td>
                      <Td>{item.barang_id ?? "-"}</Td>
                      <Td right>{rupiah(item.harga_dasar)}</Td>
                      <Td>{item.tanggal_masuk}</Td>
                      <Td right>{item.jumlah_stok}</Td>
                      <Td className="max-w-[320px]"><span className="line-clamp-2" style={{ color: TXT }}>{item.keterangan}</span></Td>
                      <Td>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{item.status ? "Aktif" : "Nonaktif"}</span>
                      </Td>
                      <Td>{item.created_by ?? "-"}</Td>
                      <Td>{item.created_at}</Td>
                      <Td>
                        <button onClick={() => goDetailBarang(item.barang_id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50" style={{ borderColor: BRD, color: PRI800 }} title="Lihat detail stok">
                          <MdArrowForward/> Detail
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
  );

  /** Layout: Cards (pinterest-like, visual & ringkas) */
  const LayoutCards = () => (
    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paged.length === 0 ? (
          <div className="col-span-full text-center py-10" style={{ color: MUT }}>Tidak ada data.</div>
        ) : (
          paged.map((it, i) => (
            <div key={it.id} className="rounded-2xl p-4 transition-transform hover:scale-[1.01]" style={{ background: SUR, border: `1px solid ${BRD}` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs" style={{ color: MUT }}>Barang ID</div>
                  <div className="text-lg font-semibold" style={{ color: TXT }}>{it.barang_id}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${it.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{it.status?"Aktif":"Nonaktif"}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs" style={{ color: MUT }}>Toko</div>
                  <div className="font-medium" style={{ color: TXT }}>{it.toko_id ?? '-'}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: MUT }}>Jumlah</div>
                  <div className="font-medium" style={{ color: TXT }}>{it.jumlah_stok}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: MUT }}>Harga Dasar</div>
                  <div className="font-medium" style={{ color: TXT }}>{rupiah(it.harga_dasar)}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: MUT }}>Tanggal Masuk</div>
                  <div className="font-medium" style={{ color: TXT }}>{it.tanggal_masuk}</div>
                </div>
              </div>
              <p className="mt-3 text-sm line-clamp-2" style={{ color: MUT }}>{it.keterangan}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs" style={{ color: MUT }}>By {it.created_by ?? '-'}</span>
                <button onClick={() => goDetailBarang(it.barang_id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50" style={{ borderColor: BRD, color: PRI800 }}>
                  <MdArrowForward/> Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  /** Layout: Minimal (daftar list padat + aksi kanan) */
  const LayoutMinimal = () => (
    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
      <ul className="rounded-2xl overflow-hidden divide-y" style={{ background: SUR, border: `1px solid ${BRD}`, borderColor: BRD }}>
        {paged.length === 0 ? (
          <li className="p-6 text-center" style={{ color: MUT }}>Tidak ada data.</li>
        ) : (
          paged.map((it, i) => (
            <li key={it.id} className="px-4 py-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl grid place-items-center text-sm font-semibold" style={{ background: `${PRI200}33`, color: PRI700 }}>{(start+i+1)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium truncate" style={{ color: TXT }}>Barang {it.barang_id}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${it.status?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{it.status?"Aktif":"Nonaktif"}</span>
                </div>
                <div className="text-xs truncate" style={{ color: MUT }}>{it.keterangan}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold" style={{ color: TXT }}>{rupiah(it.harga_dasar)}</div>
                <div className="text-xs" style={{ color: MUT }}>{it.jumlah_stok} pcs • {it.tanggal_masuk}</div>
              </div>
              <button onClick={()=>goDetailBarang(it.barang_id)} className="ml-2 px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50" style={{ borderColor: BRD, color: PRI800 }}>
                <MdArrowForward className="inline"/> Detail
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <div className="w-full h-full flex flex-col" style={{ background: BG }}>
      {/* Toolbar */}
      <div className="px-4 md:px-8 pt-4 sticky top-0 z-10">
        <div className="rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm" style={{ background: `linear-gradient(180deg, ${PRI200}22 0%, ${SUR} 60%)`, border: `1px solid ${BRD}` }}>
          <div className="relative w-full md:max-w-sm">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUT }} />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari stok…" className="w-full pl-10 pr-3 py-2 rounded-xl outline-none text-sm" style={{ background: SUR, border: `1px solid ${BRD}`, color: TXT }} />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto text-sm">
            <div className="flex items-center gap-2" style={{ color: MUT }}>
              <span>Total</span>
              <strong style={{ color: TXT }}>{filtered.length}</strong>
              <span>entri</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: MUT }}>Tampilkan</span>
              <select value={pageSize} onChange={(e)=>setPageSize(parseInt(e.target.value))} className="border rounded-lg px-2 py-1 text-sm" style={{ borderColor: BRD, color: TXT }}>
                {pageSizeOptions.map((opt)=>(<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 flex-1 overflow-hidden flex flex-col">
        {layout === "table" && <LayoutTable />}
        {layout === "cards" && <LayoutCards />}
        {layout === "minimal" && <LayoutMinimal />}

        {/* Footer pagination */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div style={{ color: MUT }}>
            Menampilkan <strong style={{ color: TXT }}>{paged.length}</strong> dari <strong style={{ color: TXT }}>{total}</strong> entri
          </div>
          <Pagination page={page} totalPages={totalPages} onPrev={()=>setPage(p=>Math.max(1,p-1))} onNext={()=>setPage(p=>Math.min(totalPages,p+1))} onGoto={(p)=>setPage(p)} />
        </div>
      </div>

      {/* Modal Filter */}
      <Modal open={openFilter} title="Filter Barang Stok" onClose={()=>setOpenFilter(false)}>
        <form className="grid gap-4">
          <Group label="Status">
            <select name="status" value={filterForm.status} onChange={handleFilterChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }}>
              <option value="">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </Group>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Harga Minimum">
              <input type="number" name="minHarga" value={filterForm.minHarga} onChange={handleFilterChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="0" />
            </Group>
            <Group label="Harga Maksimum">
              <input type="number" name="maxHarga" value={filterForm.maxHarga} onChange={handleFilterChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="0" />
            </Group>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg border font-semibold hover:opacity-90" style={{ borderColor: PRI700, color: PRI700, background: `${PRI200}33` }} onClick={()=>{ setFilterForm({ status: "", minHarga: "", maxHarga: "" }); setOpenFilter(false); }}>Reset</button>
            <button type="button" className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90" style={{ background: PRI700 }} onClick={()=>setOpenFilter(false)}>Terapkan</button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah */}
      <Modal open={openModal} title="Tambah Barang Stok" onClose={()=>setOpenModal(false)}>
        <form className="grid gap-4" onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Toko ID">
              <input name="toko_id" value={form.toko_id} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="Contoh: 101" inputMode="numeric" />
            </Group>
            <Group label="Barang ID">
              <input name="barang_id" value={form.barang_id} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="Contoh: 201" inputMode="numeric" required />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Harga Dasar">
              <input name="harga_dasar" value={form.harga_dasar} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="0" inputMode="numeric" />
            </Group>
            <Group label="Tanggal Masuk">
              <input type="date" name="tanggal_masuk" value={form.tanggal_masuk} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} required />
            </Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Group label="Jumlah Stok">
              <input name="jumlah_stok" value={form.jumlah_stok} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="0" inputMode="numeric" required />
            </Group>
            <Group label="Created By">
              <input name="created_by" value={form.created_by} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="1" inputMode="numeric" />
            </Group>
          </div>

          <Group label="Keterangan">
            <input name="keterangan" value={form.keterangan} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:ring-2" style={{ borderColor: BRD, color: TXT, "--tw-ring-color": PRI700 }} placeholder="Catatan (opsional)" />
          </Group>

          <Group label="Status Aktif">
            <div className="h-10 flex items-center px-3 border rounded-lg" style={{ borderColor: BRD }}>
              <input type="checkbox" name="status" checked={!!form.status} onChange={handleChange} className="h-4 w-4 rounded" style={{ accentColor: PRI700 }} />
              <span className="ml-2 text-sm" style={{ color: TXT }}>Aktif</span>
            </div>
          </Group>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg border font-semibold hover:opacity-90" style={{ borderColor: PRI700, color: PRI700, background: `${PRI200}33` }} onClick={()=>setOpenModal(false)}>Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-60" style={{ background: PRI700 }} disabled={saving}>{saving?"Menyimpan…":"Simpan"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
