import React, { useMemo, useState, useCallback, useEffect } from "react";
import { FiChevronLeft, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

const K_ARUS = "arus_keuangan";
const K_DETAIL = "arus_keuangan_detail";
const lsRead = (k, def) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; }
  catch { return def; }
};
const lsWrite = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function seedIfEmpty() {
  const hasA = lsRead(K_ARUS, []).length > 0;
  const hasD = lsRead(K_DETAIL, []).length > 0;
  if (hasA || hasD) return;

  const seeds = [
    { tanggal: "2025-08-11", tipe: "Pemasukan", nominal: 444444, catatan: "Penjualan #10231" },
    { tanggal: "2025-08-11", tipe: "Pengeluaran", nominal: 555500, catatan: "Beli ATK" },
    { tanggal: "2025-08-10", tipe: "Pemasukan", nominal: 1250000, catatan: "Order online" },
    { tanggal: "2025-08-10", tipe: "Pengeluaran", nominal: 2500000, catatan: "Gaji harian" },
    { tanggal: "2025-08-09", tipe: "Pemasukan", nominal: 355000, catatan: "Add-on service" },
  ];

  const nowISO = () => new Date().toISOString();
  const arus = [];
  const detail = [];
  let idCounter = 1;
  let detCounter = 1;

  const byDate = {};
  for (const s of seeds) {
    const d = new Date(s.tanggal).toISOString().slice(0, 10);
    if (!byDate[d]) {
      byDate[d] = {
        id: idCounter++,
        toko_id: 1,
        tanggal: new Date(d).toISOString(),
        total_pemasukan: 0,
        total_pengeluaran: 0,
        total_pemasukan_lain: 0,
        total_pengeluaran_lain: 0,
        created_by: 1,
        updated_by: 1,
        sync_at: null,
        status: true,
        created_at: nowISO(),
        updated_at: nowISO(),
      };
    }
    if (s.tipe === "Pemasukan") byDate[d].total_pemasukan_lain += s.nominal;
    else byDate[d].total_pengeluaran_lain += s.nominal;

    detail.push({
      id: detCounter++,
      toko_id: 1,
      arus_keuangan_id: byDate[d].id,
      supplier_id: s.tipe === "Pengeluaran" ? 1 : null,
      pelanggan_id: s.tipe === "Pemasukan" ? 1 : null,
      jenis: "lain",
      tipe: s.tipe,
      tanggal: new Date(d).toISOString(),
      nominal: s.nominal,
      catatan: s.catatan,
      created_by: 1,
      updated_by: 1,
      sync_at: null,
      status: true,
      created_at: nowISO(),
      updated_at: nowISO(),
    });
  }
  Object.values(byDate).forEach((v) => arus.push(v));
  lsWrite(K_ARUS, arus);
  lsWrite(K_DETAIL, detail);
}

const LaporanKeuangan = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("");

  // <<< FIX: pakai state untuk data dari localStorage
  const [arus, setArus] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    // seed dulu (jika kosong), lalu load ke state
    seedIfEmpty();
    setArus(lsRead(K_ARUS, []));
    setDetails(lsRead(K_DETAIL, []));
  }, []);

  // Navbar
  const onBack = useCallback(() => navigate("/laporan"), [navigate]);
  const onClearDate = useCallback(() => setDateRange(""), []);
  useNavbar(
    {
      variant: "page",
      title: "Laporan Keuangan",
      backTo: "/laporan",
      rightExtra: (
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center border rounded-lg px-3 py-1.5 text-sm">
            <FiCalendar className="text-green-600 mr-2" />
            <span className="text-gray-700">{dateRange || "Pilih rentang tanggal"}</span>
          </div>
          <button
            onClick={onClearDate}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            title="Bersihkan tanggal"
          >
            Bersihkan
          </button>
        </div>
      ),
      actions: [],
    },
    [onBack, onClearDate, dateRange]
  );

  const [from, to] = useMemo(() => {
    if (!dateRange) return [null, null];
    const [a, b] = dateRange.split("-").map((s) => s.trim());
    const parse = (dmy) => {
      const [dd, mm, yyyy] = dmy.split("/").map((n) => parseInt(n, 10));
      return new Date(yyyy, mm - 1, dd);
    };
    return [parse(a), parse(b)];
  }, [dateRange]);

  const filtered = useMemo(() => {
    if (!from || !to) return arus;
    return arus.filter((r) => {
      const d = new Date(r.tanggal);
      return d >= from && d <= to;
    });
  }, [arus, from, to]);


  const detailByDate = useMemo(() => {
    const m = {};
    details.forEach((d) => {
      const key = new Date(d.tanggal).toISOString().slice(0, 10);
      m[key] = m[key] || { pemasukan: 0, pengeluaran: 0, count: 0 };
      if (d.tipe === "Pemasukan") m[key].pemasukan += d.nominal;
      else m[key].pengeluaran += d.nominal;
      m[key].count += 1;
    });
    return m;
  }, [details]);

  const rows = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .map((r) => {
        const key = new Date(r.tanggal).toISOString().slice(0, 10);
        const d = detailByDate[key] || { pemasukan: 0, pengeluaran: 0, count: 0 };
        return {
          tanggal: key,
          pemasukan: r.total_pemasukan_lain ?? d.pemasukan,
          pengeluaran: r.total_pengeluaran_lain ?? d.pengeluaran,
          count: d.count,
        };
      });
  }, [filtered, detailByDate]);

  const sum = useMemo(() => {
    const pemasukan = rows.reduce((s, x) => s + (x.pemasukan || 0), 0);
    const pengeluaran = rows.reduce((s, x) => s + (x.pengeluaran || 0), 0);
    return { pemasukan, pengeluaran };
  }, [rows]);

  const toID = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const rp = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  const goToDetail = (isoDate) => {
    navigate(`/laporan/laporan-keuangan/detail?date=${isoDate}`);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col p-6">
      {/* Header lokal (mobile) */}
      <div className="flex items-center gap-3 mb-4 sm:hidden">
        <button className="text-2xl text-gray-600" onClick={() => navigate("/laporan")}>
          <FiChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Laporan Keuangan</h1>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        *Hanya memuat data <span className="font-semibold">Pemasukan & Pengeluaran</span> dari menu{" "}
        <span className="font-semibold">Keuangan</span>
      </p>

      <div className="flex items-center gap-3 mb-5 sm:hidden">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm w-fit">
          <FiCalendar className="text-green-500 mr-2" />
          <span>{dateRange || "Pilih rentang tanggal"}</span>
          <button
            className="ml-3 text-gray-400 hover:text-red-500"
            onClick={() => setDateRange("")}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Pemasukan Lain</p>
          <p className="text-green-600 font-bold text-lg">{rp(sum.pemasukan)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Pengeluaran Lain</p>
          <p className="text-red-500 font-bold text-lg">{rp(sum.pengeluaran)}</p>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-5 bg-gray-100 text-sm font-medium text-gray-600 py-2 px-3 rounded-t-lg">
          <span>Tanggal</span>
          <span>Jumlah Transaksi</span>
          <span>Pemasukan Lain</span>
          <span>Pengeluaran Lain</span>
          <span className="text-right">Aksi</span>
        </div>

        {rows.map((r, idx) => (
          <div
            key={idx}
            className="grid grid-cols-5 items-center py-2 px-3 border-b hover:bg-gray-50 text-sm"
          >
            <span className="font-medium">{toID(r.tanggal)}</span>
            <span className="text-gray-600">{r.count}</span>
            <span className="text-green-600 font-semibold">{rp(r.pemasukan)}</span>
            <span className="text-red-500 font-semibold">{rp(r.pengeluaran)}</span>

            <div className="flex justify-end">
              <button
                onClick={() => goToDetail(r.tanggal)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
                           border border-green-600 text-green-700 hover:bg-green-50 transition"
                aria-label={`Lihat detail ${toID(r.tanggal)}`}
              >
                Detail
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm border-b">
            Tidak ada data
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanKeuangan;