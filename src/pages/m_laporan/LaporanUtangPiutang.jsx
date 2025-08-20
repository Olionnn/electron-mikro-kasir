import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import {
  MdSearch, MdFilterList, MdRefresh, MdDownload, MdPrint, MdArrowForward,
  MdClose, MdOutlineSummarize, MdAttachMoney, MdHistory, MdAdd
} from "react-icons/md";


const rp = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
const today = () => new Date().toISOString().slice(0,10);
const isOverdue = (dateStr) => !!dateStr && dateStr < today();

const MASTER_TOKO = [{id:1,nama:"Toko Utama"},{id:2,nama:"Cabang 2"}];
const MASTER_SUPPLIER = [{id:10,nama:"PT Sumber Pangan"},{id:11,nama:"CV Sejahtera"}];
const MASTER_PELANGGAN = [{id:100,nama:"Budi"},{id:101,nama:"Ani"}];

const DUMMY_HUTANG = [
  { id:1, toko_id:1, supplier_id:10, total_hutang: 500000, total_dibayar: 200000, jenis_hutang:"Pembelian", status_hutang:"berjalan", status:true, created_at:"2025-08-10", updated_at:"2025-08-10", created_by:1 },
  { id:2, toko_id:2, supplier_id:11, total_hutang: 250000, total_dibayar: 250000, jenis_hutang:"Pembelian", status_hutang:"lunas", status:true, created_at:"2025-08-12", updated_at:"2025-08-12", created_by:1 },
];


const DUMMY_HUTANG_DETAIL = [
  { id:101, toko_id:1, hutang_id:1, nominal_hutang:300000, nominal_bayar:100000, jatuh_tempo:"2025-08-20", tanggal_bayar:null, status_hutang:"berjalan", pembelian_id:5001, metode_bayar:null, keterangan:"PO#5001", no_struk:"HB-001", created_at:"2025-08-10", updated_at:"2025-08-10" },
  { id:102, toko_id:1, hutang_id:1, nominal_hutang:200000, nominal_bayar:100000, jatuh_tempo:"2025-08-15", tanggal_bayar:"2025-08-12", status_hutang:"berjalan", pembelian_id:5002, metode_bayar:"tunai", keterangan:"PO#5002", no_struk:"HB-002", created_at:"2025-08-10", updated_at:"2025-08-12" },
  { id:103, toko_id:2, hutang_id:2, nominal_hutang:250000, nominal_bayar:250000, jatuh_tempo:"2025-08-18", tanggal_bayar:"2025-08-18", status_hutang:"lunas", pembelian_id:5003, metode_bayar:"transfer", keterangan:"PO#5003", no_struk:"HB-003", created_at:"2025-08-12", updated_at:"2025-08-18" },
];


const DUMMY_HUTANG_HISTORY = [
  { id:9001, toko_id:1, hutang_detail_id:101, nominal_cicilan:100000, nominal_belum_bayar:200000, tanggal_bayar:"2025-08-11", metode_bayar:"tunai", keterangan:"Cicilan 1", created_at:"2025-08-11", updated_at:"2025-08-11" },
  { id:9002, toko_id:1, hutang_detail_id:102, nominal_cicilan:100000, nominal_belum_bayar:100000, tanggal_bayar:"2025-08-12", metode_bayar:"tunai", keterangan:"Pelunasan parsial", created_at:"2025-08-12", updated_at:"2025-08-12" },
  { id:9003, toko_id:2, hutang_detail_id:103, nominal_cicilan:250000, nominal_belum_bayar:0, tanggal_bayar:"2025-08-18", metode_bayar:"transfer", keterangan:"Lunas", created_at:"2025-08-18", updated_at:"2025-08-18" },
];


const DUMMY_PIUTANG = [
  { id:11, toko_id:1, pelanggan_id:100, total_piutang: 400000, total_dibayar: 150000, jenis_piutang:"Penjualan", status_piutang:"berjalan", status:true, created_at:"2025-08-09", updated_at:"2025-08-10" },
  { id:12, toko_id:2, pelanggan_id:101, total_piutang: 150000, total_dibayar: 150000, jenis_piutang:"Penjualan", status_piutang:"lunas", status:true, created_at:"2025-08-10", updated_at:"2025-08-15" },
];


const DUMMY_PIUTANG_DETAIL = [
  { id:201, toko_id:1, piutang_id:11, nominal_piutang:250000, nominal_bayar:100000, jatuh_tempo:"2025-08-15", tanggal_bayar:"2025-08-10", status_piutang:"berjalan", transaksi_id:7001, metode_bayar:"tunai", keterangan:"INV#7001", no_struk:"PJ-001", created_at:"2025-08-09", updated_at:"2025-08-10" },
  { id:202, toko_id:1, piutang_id:11, nominal_piutang:150000, nominal_bayar:50000, jatuh_tempo:"2025-08-20", tanggal_bayar:null, status_piutang:"berjalan", transaksi_id:7002, metode_bayar:null, keterangan:"INV#7002", no_struk:"PJ-002", created_at:"2025-08-09", updated_at:"2025-08-10" },
  { id:203, toko_id:2, piutang_id:12, nominal_piutang:150000, nominal_bayar:150000, jatuh_tempo:"2025-08-13", tanggal_bayar:"2025-08-13", status_piutang:"lunas", transaksi_id:7003, metode_bayar:"transfer", keterangan:"INV#7003", no_struk:"PJ-003", created_at:"2025-08-10", updated_at:"2025-08-13" },
];


const DUMMY_PIUTANG_HISTORY = [
  { id:9101, toko_id:1, piutang_detail_id:201, nominal_cicilan:100000, nominal_belum_bayar:150000, tanggal_bayar:"2025-08-10", metode_bayar:"tunai", keterangan:"DP", created_at:"2025-08-10", updated_at:"2025-08-10" },
  { id:9102, toko_id:1, piutang_detail_id:202, nominal_cicilan:50000, nominal_belum_bayar:100000, tanggal_bayar:"2025-08-12", metode_bayar:"tunai", keterangan:"Cicilan 1", created_at:"2025-08-12", updated_at:"2025-08-12" },
  { id:9103, toko_id:2, piutang_detail_id:203, nominal_cicilan:150000, nominal_belum_bayar:0, tanggal_bayar:"2025-08-13", metode_bayar:"transfer", keterangan:"Lunas", created_at:"2025-08-13", updated_at:"2025-08-13" },
];


export default function LaporanUtangPiutang() {
  // tab: hutang | piutang
  const [tab, setTab] = useState("hutang");

  // search & filter
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // berjalan | lunas | ""
  const [tokoFilter, setTokoFilter] = useState("");
  const [relasiFilter, setRelasiFilter] = useState(""); // supplier_id / pelanggan_id
  const [dueFilter, setDueFilter] = useState(""); // overdue | upcoming | ""
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // detail drawer
  const [openDetail, setOpenDetail] = useState(false);
  const [detailType, setDetailType] = useState(null); // "hutang" | "piutang"
  const [detailRow, setDetailRow] = useState(null); // object header + join detail

  // bayar modal
  const [openBayar, setOpenBayar] = useState(false);
  const [bayarForm, setBayarForm] = useState({ nominal: "", metode_bayar: "tunai", keterangan: "" });

  // Navbar actions
  const actions = useMemo(() => ([
    {
      type: "button",
      title: "Filter",
      onClick: () => document.getElementById("filter-anchor")?.scrollIntoView({ behavior:"smooth" }),
      className: "inline-flex items-center gap-2 bg-white border border-violet-500 text-violet-700 px-3 py-2 rounded-lg hover:bg-violet-50",
      icon: <MdFilterList size={18} />,
    },
    {
      type: "button",
      title: "Export CSV",
      onClick: () => exportCSV(),
      className: "inline-flex items-center gap-2 bg-white border border-violet-500 text-violet-700 px-3 py-2 rounded-lg hover:bg-violet-50",
      icon: <MdDownload size={18} />,
    },
    {
      type: "button",
      title: "Cetak",
      onClick: () => window.print(),
      className: "inline-flex items-center gap-2 bg-violet-600 text-white px-3 py-2 rounded-lg hover:bg-violet-700",
      icon: <MdPrint size={18} />,
    },
    {
      type: "button",
      title: "Refresh",
      onClick: () => window.location.reload(),
      className: "inline-flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100",
      icon: <MdRefresh size={18} />,
    },
  ]), []);

  useNavbar({ variant:"page", title:"Laporan Piutang & Hutang", backTo:"/management", actions }, [actions]);

  // data source (gabung header + detail + history (count))
  const hutangMerged = useMemo(() => {
    return DUMMY_HUTANG.map(h => {
      const supplier = MASTER_SUPPLIER.find(s => s.id === h.supplier_id)?.nama || "-";
      const toko = MASTER_TOKO.find(t => t.id === h.toko_id)?.nama || "-";
      const details = DUMMY_HUTANG_DETAIL.filter(d => d.hutang_id === h.id);
      const sisa = Math.max(0, Number(h.total_hutang) - Number(h.total_dibayar));
      const overdueCount = details.filter(d => d.status_hutang !== "lunas" && isOverdue(d.jatuh_tempo)).length;
      const historyCount = details.reduce((acc, d) => acc + DUMMY_HUTANG_HISTORY.filter(x => x.hutang_detail_id === d.id).length, 0);
      return { ...h, toko_nama: toko, relasi_nama: supplier, details, sisa, overdueCount, historyCount };
    });
  }, []);

  const piutangMerged = useMemo(() => {
    return DUMMY_PIUTANG.map(p => {
      const pelanggan = MASTER_PELANGGAN.find(c => c.id === p.pelanggan_id)?.nama || "-";
      const toko = MASTER_TOKO.find(t => t.id === p.toko_id)?.nama || "-";
      const details = DUMMY_PIUTANG_DETAIL.filter(d => d.piutang_id === p.id);
      const sisa = Math.max(0, Number(p.total_piutang) - Number(p.total_dibayar));
      const overdueCount = details.filter(d => d.status_piutang !== "lunas" && isOverdue(d.jatuh_tempo)).length;
      const historyCount = details.reduce((acc, d) => acc + DUMMY_PIUTANG_HISTORY.filter(x => x.piutang_detail_id === d.id).length, 0);
      return { ...p, toko_nama: toko, relasi_nama: pelanggan, details, sisa, overdueCount, historyCount };
    });
  }, []);

  // filter
  const filtered = useMemo(() => {
    const data = tab === "hutang" ? hutangMerged : piutangMerged;
    const term = q.trim().toLowerCase();

    return data.filter(row => {
      // keyword
      const hay = [
        row.id, row.toko_nama, row.relasi_nama,
        tab === "hutang" ? row.status_hutang : row.status_piutang,
        row.jenis_hutang || row.jenis_piutang,
        row.created_at, row.updated_at, row.total_hutang || row.total_piutang
      ].join(" ").toLowerCase();
      const matchTerm = !term || hay.includes(term);

      // status
      const st = tab === "hutang" ? row.status_hutang : row.status_piutang;
      const matchStatus = !statusFilter || st === statusFilter;

      // toko
      const matchToko = !tokoFilter || String(row.toko_id) === String(tokoFilter);

      // relasi
      const matchRelasi = !relasiFilter || String((tab==="hutang"?row.supplier_id:row.pelanggan_id)) === String(relasiFilter);

      // due window (cek di detail)
      let matchDue = true;
      if (dueFilter) {
        const list = row.details || [];
        if (dueFilter === "overdue") {
          matchDue = list.some(d => isOverdue(d.jatuh_tempo) && ((tab==="hutang") ? d.status_hutang!=="lunas" : d.status_piutang!=="lunas"));
        } else if (dueFilter === "upcoming") {
          matchDue = list.some(d => !!d.jatuh_tempo && d.jatuh_tempo >= today() && ((tab==="hutang") ? d.status_hutang!=="lunas" : d.status_piutang!=="lunas"));
        }
      }

      // tanggal dibuat range (created_at)
      let matchDate = true;
      if (dateFrom) matchDate = row.created_at >= dateFrom;
      if (matchDate && dateTo) matchDate = row.created_at <= dateTo;

      return matchTerm && matchStatus && matchToko && matchRelasi && matchDue && matchDate;
    });
  }, [tab, hutangMerged, piutangMerged, q, statusFilter, tokoFilter, relasiFilter, dueFilter, dateFrom, dateTo]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  useEffect(() => { setPage(1); }, [tab, q, statusFilter, tokoFilter, relasiFilter, dueFilter, dateFrom, dateTo, perPage]);

  // KPI summary
  const summary = useMemo(() => {
    const src = tab === "hutang" ? hutangMerged : piutangMerged;
    const totalNom = src.reduce((s, r) => s + (tab === "hutang" ? r.total_hutang : r.total_piutang), 0);
    const totalBayar = src.reduce((s, r) => s + (tab === "hutang" ? r.total_dibayar : r.total_dibayar), 0);
    const totalSisa = src.reduce((s, r) => s + r.sisa, 0);
    const totalOverdue = src.reduce((s, r) => s + r.overdueCount, 0);
    return { totalNom, totalBayar, totalSisa, totalOverdue };
  }, [tab, hutangMerged, piutangMerged]);

  const openDrawer = (row, type) => {
    setDetailType(type);
    setDetailRow(row);
    setOpenDetail(true);
  };

  const closeDrawer = () => {
    setOpenDetail(false);
    setDetailRow(null);
    setDetailType(null);
  };

  const openAddPayment = (row) => {
    setDetailRow(row);
    setOpenBayar(true);
    setBayarForm({ nominal:"", metode_bayar:"tunai", keterangan:"" });
  };

  const savePayment = () => {
    const nominal = Number(bayarForm.nominal || 0);
    if (!(nominal > 0)) {
      alert("Nominal harus > 0");
      return;
    }
    // prototipe: hanya alert & tutup modal
    alert(`Simulasikan simpan pembayaran ${detailType === "hutang" ? "Hutang" : "Piutang"} sebesar ${rp(nominal)} via ${bayarForm.metode_bayar}\nKeterangan: ${bayarForm.keterangan || "-"}`);
    setOpenBayar(false);
  };

  const exportCSV = () => {
    const rows = (tab === "hutang" ? filtered.map(r => ({
      Tipe:"Hutang",
      ID:r.id, Toko:r.toko_nama, Supplier:r.relasi_nama,
      Total:r.total_hutang, Dibayar:r.total_dibayar, Sisa:r.sisa,
      Status:r.status_hutang, CreatedAt:r.created_at
    })) : filtered.map(r => ({
      Tipe:"Piutang",
      ID:r.id, Toko:r.toko_nama, Pelanggan:r.relasi_nama,
      Total:r.total_piutang, Dibayar:r.total_dibayar, Sisa:r.sisa,
      Status:r.status_piutang, CreatedAt:r.created_at
    })));

    const headers = Object.keys(rows[0] || {Info:"Tidak ada data"});
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g,'""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `laporan_${tab}_${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Tabs */}
      <div className="px-4 md:px-6 pt-4">
        <div className="inline-flex bg-violet-50 border border-violet-200 rounded-xl overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${tab==="hutang" ? "bg-violet-600 text-white" : "text-violet-700 hover:bg-violet-100"}`}
            onClick={() => setTab("hutang")}
          >Hutang</button>
          <button
            className={`px-4 py-2 text-sm ${tab==="piutang" ? "bg-violet-600 text-white" : "text-violet-700 hover:bg-violet-100"}`}
            onClick={() => setTab("piutang")}
          >Piutang</button>
        </div>
      </div>

      {/* KPI */}
      <div className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard icon={<MdOutlineSummarize />} label="Total Nominal" value={rp(summary.totalNom)} />
        <StatCard icon={<MdAttachMoney />} label="Total Dibayar" value={rp(summary.totalBayar)} />
        <StatCard icon={<MdAttachMoney />} label="Sisa" value={rp(summary.totalSisa)} />
        <StatCard icon={<MdHistory />} label="Jatuh Tempo (Open)" value={`${summary.totalOverdue}`} />
      </div>

      {/* Filter Bar */}
      <div id="filter-anchor" className="px-4 md:px-6 pb-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-700" />
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder={`Cari ${tab==="hutang"?"supplier":"pelanggan"} / status / nomor …`}
              className="w-full border border-violet-300 rounded-xl pl-10 pr-4 py-2.5"
            />
          </div>

          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border border-violet-300 rounded-xl px-3 py-2.5">
            <option value="">Status ({tab==="hutang"?"hutang":"piutang"})</option>
            <option value="berjalan">Berjalan</option>
            <option value="lunas">Lunas</option>
          </select>

          <select value={tokoFilter} onChange={(e)=>setTokoFilter(e.target.value)} className="border border-violet-300 rounded-xl px-3 py-2.5">
            <option value="">Semua Toko</option>
            {MASTER_TOKO.map(t=><option key={t.id} value={t.id}>{t.nama}</option>)}
          </select>

          <select value={relasiFilter} onChange={(e)=>setRelasiFilter(e.target.value)} className="border border-violet-300 rounded-xl px-3 py-2.5">
            <option value="">{tab==="hutang"?"Semua Supplier":"Semua Pelanggan"}</option>
            {(tab==="hutang"?MASTER_SUPPLIER:MASTER_PELANGGAN).map(r=><option key={r.id} value={r.id}>{r.nama}</option>)}
          </select>

          <select value={dueFilter} onChange={(e)=>setDueFilter(e.target.value)} className="border border-violet-300 rounded-xl px-3 py-2.5">
            <option value="">Semua Jatuh Tempo</option>
            <option value="overdue">Terlambat</option>
            <option value="upcoming">Akan Jatuh Tempo</option>
          </select>

          <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} className="border border-violet-300 rounded-xl px-3 py-2.5" />
          <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} className="border border-violet-300 rounded-xl px-3 py-2.5" />
        </div>
      </div>

      {/* Table (scroll hanya di tabel) */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto px-4 md:px-6 pb-6">
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-violet-50 sticky top-0">
                  <tr>
                    <Th w="80">#</Th>
                    <Th w="120">{tab==="hutang"?"ID Hutang":"ID Piutang"}</Th>
                    <Th w="160">Toko</Th>
                    <Th>{tab==="hutang"?"Supplier":"Pelanggan"}</Th>
                    <Th w="140" right>Total</Th>
                    <Th w="140" right>Dibayar</Th>
                    <Th w="140" right>Sisa</Th>
                    <Th w="160">Status</Th>
                    <Th w="160">Jatuh Tempo (Open)</Th>
                    <Th w="140">Histori</Th>
                    <Th w="120">Aksi</Th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={11} className="p-6 text-center text-gray-500">Tidak ada data.</td></tr>
                  ) : paged.map((r, idx) => {
                    const total = tab==="hutang" ? r.total_hutang : r.total_piutang;
                    const dibayar = r.total_dibayar;
                    const openDue = r.details?.filter(d => (tab==="hutang"? d.status_hutang!=="lunas": d.status_piutang!=="lunas"));
                    const nextDue = openDue?.map(d=>d.jatuh_tempo).filter(Boolean).sort()[0] || "-";
                    const isAnyOver = openDue?.some(d => isOverdue(d.jatuh_tempo));
                    return (
                      <tr key={`${tab}-${r.id}`} className="border-t">
                        <Td>{start + idx + 1}</Td>
                        <Td>{r.id}</Td>
                        <Td>{r.toko_nama}</Td>
                        <Td>{r.relasi_nama}</Td>
                        <Td right>{rp(total)}</Td>
                        <Td right>{rp(dibayar)}</Td>
                        <Td right><span className={`font-semibold ${r.sisa>0?"text-amber-700":"text-green-700"}`}>{rp(r.sisa)}</span></Td>
                        <Td>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${ (tab==="hutang"?r.status_hutang:r.status_piutang)==="lunas" ? "bg-green-100 text-green-700":"bg-amber-100 text-amber-700"}`}>
                            {(tab==="hutang"?r.status_hutang:r.status_piutang).toUpperCase()}
                          </span>
                        </Td>
                        <Td>
                          {nextDue !== "-" ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${isAnyOver?"bg-red-100 text-red-700":"bg-violet-100 text-violet-700"}`}>
                              {nextDue} {isAnyOver && "• Terlambat"}
                            </span>
                          ) : "-"}
                        </Td>
                        <Td>{r.historyCount}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                              onClick={()=>openDrawer(r, tab)}
                              title="Detail"
                            >
                              Detail
                            </button>
                            {r.sisa>0 && (
                              <button
                                className="px-3 py-1.5 rounded-lg border text-violet-700 border-violet-500 hover:bg-violet-50"
                                onClick={()=>openAddPayment(r)}
                                title="Tambah Pembayaran/Cicilan"
                              >
                                <MdAdd />
                              </button>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer table: pagination */}
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex items-center justify-between">
              <div>Menampilkan <strong>{paged.length}</strong> dari <strong>{total}</strong> entri</div>
              <div className="flex items-center gap-3">
                <select value={perPage} onChange={(e)=>setPerPage(parseInt(e.target.value))} className="border rounded-lg px-2 py-1">
                  {[10,25,50,100].map(n=><option key={n} value={n}>{n}/hal</option>)}
                </select>
                <Pagination page={page} totalPages={totalPages} onPrev={()=>setPage(p=>Math.max(1,p-1))} onNext={()=>setPage(p=>Math.min(totalPages,p+1))} onGoto={(p)=>setPage(p)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Detail */}
      {openDetail && detailRow && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={closeDrawer} />
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl p-5 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-lg">
                Detail {detailType==="hutang" ? "Hutang" : "Piutang"} • ID #{detailRow.id}
              </div>
              <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center" onClick={closeDrawer}><MdClose /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <Info label="Toko" value={detailRow.toko_nama} />
              <Info label={detailType==="hutang"?"Supplier":"Pelanggan"} value={detailRow.relasi_nama} />
              <Info label="Total" value={rp(detailType==="hutang"?detailRow.total_hutang:detailRow.total_piutang)} />
              <Info label="Dibayar" value={rp(detailRow.total_dibayar)} />
              <Info label="Sisa" value={<span className={detailRow.sisa>0?"text-amber-700 font-semibold":"text-violet-700 font-semibold"}>{rp(detailRow.sisa)}</span>} />
              <Info label="Status" value={<span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700">{(detailType==="hutang"?detailRow.status_hutang:detailRow.status_piutang).toUpperCase()}</span>} />
            </div>

            <h4 className="font-semibold mb-2">Rincian Tagihan</h4>
            <div className="overflow-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-violet-50">
                  <tr>
                    <Th w="80">ID</Th>
                    <Th w="140">No. Struk</Th>
                    <Th w="140">Nominal</Th>
                    <Th w="140">Terbayar</Th>
                    <Th w="160">Jatuh Tempo</Th>
                    <Th w="160">Tgl Bayar</Th>
                    <Th>Keterangan</Th>
                  </tr>
                </thead>
                <tbody>
                  {(detailRow.details||[]).map(d=>{
                    const nominal = (detailType==="hutang"?d.nominal_hutang:d.nominal_piutang);
                    const bayar = d.nominal_bayar;
                    const overdue = (detailType==="hutang"? d.status_hutang!=="lunas": d.status_piutang!=="lunas") && isOverdue(d.jatuh_tempo);
                    return (
                      <tr key={`${detailType}-det-${d.id}`} className="border-t">
                        <Td>{d.id}</Td>
                        <Td>{d.no_struk||"-"}</Td>
                        <Td>{rp(nominal)}</Td>
                        <Td>{rp(bayar)}</Td>
                        <Td>
                          {d.jatuh_tempo ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${overdue?"bg-red-100 text-red-700":"bg-violet-100 text-violet-700"}`}>
                              {d.jatuh_tempo}{overdue && " • Terlambat"}
                            </span>
                          ) : "-"}
                        </Td>
                        <Td>{d.tanggal_bayar || "-"}</Td>
                        <Td>{d.keterangan || "-"}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold mt-6 mb-2">Histori Pembayaran</h4>
            <div className="space-y-2">
              {getHistories(detailRow, detailType).map(h => (
                <div key={`${detailType}-his-${h.id}`} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{rp(h.nominal_cicilan)} <span className="text-xs text-gray-400">({h.metode_bayar||"-"})</span></div>
                    <div className="text-xs text-gray-500">{h.tanggal_bayar} • Sisa: {rp(h.nominal_belum_bayar)}</div>
                    {h.keterangan && <div className="text-xs text-gray-400 mt-0.5">{h.keterangan}</div>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700">Cicilan</span>
                </div>
              ))}
              {getHistories(detailRow, detailType).length===0 && (
                <div className="text-sm text-gray-500">Belum ada histori pembayaran.</div>
              )}
            </div>

            {detailRow.sisa>0 && (
              <div className="mt-6">
                <button className="px-4 py-2 rounded-lg border text-violet-700 border-violet-500 hover:bg-violet-50" onClick={()=>openAddPayment(detailRow)}>
                  + Tambah Pembayaran / Cicilan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Pembayaran */}
      {openBayar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Tambah {detailType==="hutang"?"Pembayaran Hutang":"Pembayaran Piutang"}</div>
              <button onClick={()=>setOpenBayar(false)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><MdClose/></button>
            </div>

            <div className="grid gap-3">
              <Labeled label="Nominal">
                <input
                  type="number"
                  min={0}
                  value={bayarForm.nominal}
                  onChange={(e)=>setBayarForm(f=>({...f, nominal:e.target.value}))}
                  className="border rounded-lg px-3 py-2"
                  placeholder="0"
                />
              </Labeled>
              <Labeled label="Metode Bayar">
                <select
                  value={bayarForm.metode_bayar}
                  onChange={(e)=>setBayarForm(f=>({...f, metode_bayar:e.target.value}))}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="tunai">Tunai</option>
                  <option value="transfer">Transfer</option>
                  <option value="kartu">Kartu</option>
                </select>
              </Labeled>
              <Labeled label="Keterangan">
                <input
                  value={bayarForm.keterangan}
                  onChange={(e)=>setBayarForm(f=>({...f, keterangan:e.target.value}))}
                  className="border rounded-lg px-3 py-2"
                  placeholder="Catatan opsional…"
                />
              </Labeled>

              <div className="flex justify-end gap-2 pt-1">
                <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={()=>setOpenBayar(false)}>Batal</button>
                <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={savePayment}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================
   SUB COMPONENTS
========================= */
function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white border border-violet-200 flex items-center justify-center text-violet-700">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold text-violet-700">{value}</div>
      </div>
    </div>
  );
}

function Th({ children, w, right }) {
  return <th className={`px-3 py-2 text-left ${right?"text-right":""}`} style={w?{width:w}:undefined}>{children}</th>;
}
function Td({ children, right }) {
  return <td className={`px-3 py-2 ${right?"text-right":""}`}>{children}</td>;
}
function Info({label, value}) {
  return (
    <div className="bg-white rounded-xl p-3 border">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
function Labeled({label, children}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}
function Pagination({ page, totalPages, onPrev, onNext, onGoto }) {
  if (totalPages <= 1) return null;
  const nums = useMemo(()=>{
    const arr = [];
    const win=2;
    let s=Math.max(1,page-win), e=Math.min(totalPages,page+win);
    for(let i=s;i<=e;i++) arr.push(i);
    if(!arr.includes(1)) arr.unshift(1);
    if(!arr.includes(totalPages)) arr.push(totalPages);
    return Array.from(new Set(arr)).sort((a,b)=>a-b);
  },[page,totalPages]);

  return (
    <div className="flex items-center gap-1">
      <button onClick={onPrev} disabled={page===1} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50">Prev</button>
      {nums.map((n,idx)=>(
        <React.Fragment key={n}>
          {idx>0 && nums[idx-1]+1!==n && <span className="px-1">…</span>}
          <button onClick={()=>onGoto(n)} className={`px-3 py-1.5 rounded-lg border text-sm ${n===page?"bg-violet-600 text-white border-violet-600":"hover:bg-gray-50"}`}>{n}</button>
        </React.Fragment>
      ))}
      <button onClick={onNext} disabled={page===totalPages} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50">Next</button>
    </div>
  );
}

/* =========================
   HELPERS
========================= */
function getHistories(row, type){
  if(!row) return [];
  if(type==="hutang"){
    const ids = (row.details||[]).map(d=>d.id);
    return DUMMY_HUTANG_HISTORY.filter(h=>ids.includes(h.hutang_detail_id)).sort((a,b)=> (a.tanggal_bayar||"").localeCompare(b.tanggal_bayar||""));
  } else {
    const ids = (row.details||[]).map(d=>d.id);
    return DUMMY_PIUTANG_HISTORY.filter(h=>ids.includes(h.piutang_detail_id)).sort((a,b)=> (a.tanggal_bayar||"").localeCompare(b.tanggal_bayar||""));
  }
}