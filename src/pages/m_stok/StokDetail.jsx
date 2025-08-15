import React, { useMemo, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdAdd, MdRemoveRedEye, MdSearch, MdFilterList, MdDownload } from "react-icons/md";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";

const rupiah = (v) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(v || 0));

const formatDate = (str) => {
  try {
    const d = new Date(str);
    return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return str || "-";
  }
};

const initialItems = [
  { id:1, nama:"Beras", kode:"132312", stok:9, harga_dasar:11000, harga_jual:13000, image:"", kategori_id:null, show_transaksi:true, use_stok:true, status:true },
  { id:2, nama:"Kecap", kode:"666", stok:10, harga_dasar:3000, harga_jual:4000, image:"", kategori_id:null, show_transaksi:true, use_stok:true, status:true },
  { id:3, nama:"Beras 5KG", kode:"1312", stok:5, harga_dasar:65000, harga_jual:70000, image:"", kategori_id:null, show_transaksi:true, use_stok:true, status:true },
];

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
    tipe: "masuk", 
  },
  {
    id: 2,
    toko_id: 102,
    barang_id: 1, 
    harga_dasar: 75000,
    tanggal_masuk: "2025-08-05",
    jumlah_stok: 5,
    keterangan: "Penyesuaian / keluar",
    created_by: 2,
    updated_by: null,
    sync_at: null,
    status: true,
    created_at: "2025-08-05",
    updated_at: "2025-08-05",
    tipe: "keluar", 
  },
];

export default function StokDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const onBack = useCallback(() => {navigate(-1);}, [navigate]);
  useNavbar(
    {
      variant: "page",
      title: "Detail Stok",
      backTo: onBack,
      actions: [
        {
          type: "button",
          title: "Kembali",
          onClick: () => navigate(-1),
          className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50",
          icon: <MdArrowBack size={18} />,
        },
      ],
    },
    [navigate]
  );

  const item = useMemo(() => initialItems.find((x) => String(x.id) === String(id)) || null, [id]);

  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [openAdj, setOpenAdj] = useState(false);
  const [adjMode, setAdjMode] = useState("masuk"); 
  const [adjForm, setAdjForm] = useState({ tanggal: "", qty: "", harga_dasar: "", keterangan: "" });
  const adjFocusRef = useRef(null);

  const [mutasi, setMutasi] = useState(dummyData.filter((d) => String(d.barang_id) === String(id)));

  const dataFiltered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return mutasi
      .filter((m) => {
        const byText = !term || (m.keterangan || "").toLowerCase().includes(term);
        const byFrom = !dateFrom || new Date(m.tanggal_masuk) >= new Date(dateFrom);
        const byTo = !dateTo || new Date(m.tanggal_masuk) <= new Date(dateTo);
        return byText && byFrom && byTo;
      })
      .sort((a, b) => new Date(a.tanggal_masuk) - new Date(b.tanggal_masuk));
  }, [mutasi, q, dateFrom, dateTo]);

  const sumMasuk = useMemo(() => dataFiltered.filter((d) => d.tipe === "masuk").reduce((s, it) => s + Number(it.jumlah_stok || 0), 0), [dataFiltered]);
  const sumKeluar = useMemo(() => dataFiltered.filter((d) => d.tipe === "keluar").reduce((s, it) => s + Number(it.jumlah_stok || 0), 0), [dataFiltered]);

  const stokAwalItem = item?.stok ?? 0;
  const saldo = useMemo(() => Math.max(0, stokAwalItem + (sumMasuk - sumKeluar)), [stokAwalItem, sumMasuk, sumKeluar]);

  const openAdjust = useCallback((mode) => {
    setAdjMode(mode);
    setAdjForm({ tanggal: new Date().toISOString().slice(0, 10), qty: "", harga_dasar: "", keterangan: "" });
    setOpenAdj(true);
  }, []);

  const saveAdjust = useCallback(() => {
    if (!adjForm.qty || Number(adjForm.qty) <= 0) return alert("Qty harus lebih dari 0");
    const newRow = {
      id: Math.max(0, ...mutasi.map((m) => m.id || 0)) + 1,
      toko_id: null,
      barang_id: Number(id),
      harga_dasar: Number(adjForm.harga_dasar || 0),
      tanggal_masuk: adjForm.tanggal,
      jumlah_stok: Number(adjForm.qty),
      keterangan: adjForm.keterangan || (adjMode === "masuk" ? "Penambahan stok" : "Pengurangan stok"),
      created_by: 1,
      updated_by: null,
      sync_at: null,
      status: true,
      created_at: adjForm.tanggal,
      updated_at: adjForm.tanggal,
      tipe: adjMode,
    };
    setMutasi((prev) => [...prev, newRow]);
    setOpenAdj(false);
  }, [adjForm, adjMode, mutasi, id]);

  const exportCSV = useCallback(() => {
    const header = [
      "ID",
      "Tanggal",
      "Tipe",
      "Qty",
      "HargaDasar",
      "Keterangan",
    ];
    const rows = dataFiltered.map((d) => [
      d.id,
      d.tanggal_masuk,
      d.tipe,
      d.jumlah_stok,
      d.harga_dasar,
      `"${(d.keterangan || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stok_${item?.nama || "barang"}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dataFiltered, item?.nama]);

  if (!item) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Barang tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="border-b bg-white">
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            {item.image ? (
              <img src={item.image} alt={item.nama} className="w-14 h-14 rounded-lg object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-lg">
                {item.nama.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xl font-bold truncate">{item.nama}</div>
              <div className="text-sm text-gray-600">Kode: {item.kode || "-"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openAdjust("masuk")} className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600">
              <MdAdd size={18} /> Tambah Stok
            </button>
            <button onClick={() => openAdjust("keluar")} className="inline-flex items-center gap-2 bg-white border border-red-500 text-red-700 px-3 py-2 rounded-lg hover:bg-red-50">
              - Kurangi Stok
            </button>
          </div>
        </div>

        <div className="px-4 lg:px-6 pb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Summary label="Harga Dasar" value={rupiah(item.harga_dasar)} />
            <Summary label="Harga Jual" value={rupiah(item.harga_jual)} />
            <Summary label="Total Masuk (filter)" value={sumMasuk} />
            <Summary label="Total Keluar (filter)" value={sumKeluar} />
          </div>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Summary focus label="Saldo (estimasi)" value={saldo} />
            <Summary label="Tampil Transaksi" value={item.show_transaksi ? "Ya" : "Tidak"} />
            <Summary label="Manajemen Stok" value={item.use_stok ? "Ya" : "Tidak"} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 lg:px-6 py-3 border-b bg-white flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex gap-3 items-center flex-1">
            <div className="relative flex-1 max-w-lg">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari keterangan…"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-green-500"
              />
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>
            <div className="hidden lg:flex items-center gap-2 text-gray-500">
              <MdFilterList />
              <span className="text-sm">Filter tanggal:</span>
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-green-500"
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setQ(""); setDateFrom(""); setDateTo(""); }}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <MdDownload size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="px-4 lg:px-6 py-4">
          {dataFiltered.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Belum ada riwayat stok sesuai filter.
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left">
                      <Th w="120">Tanggal</Th>
                      <Th w="90">Tipe</Th>
                      <Th w="110" right>Qty</Th>
                      <Th w="140" right>Harga Dasar</Th>
                      <Th>Keterangan</Th>
                      <Th w="110">Aksi</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFiltered.map((row) => (
                      <tr key={row.id} className="border-b last:border-0">
                        <Td>{formatDate(row.tanggal_masuk)}</Td>
                        <Td>
                          <span className={`px-2 py-1 rounded-full text-xs ${row.tipe === "masuk" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {row.tipe === "masuk" ? "Masuk" : "Keluar"}
                          </span>
                        </Td>
                        <Td right>{Number(row.jumlah_stok || 0).toLocaleString("id-ID")}</Td>
                        <Td right>{row.harga_dasar ? rupiah(row.harga_dasar) : "-"}</Td>
                        <Td className="max-w-[420px]">
                          <span className="line-clamp-2">{row.keterangan || "-"}</span>
                        </Td>
                        <Td>
                          <button className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border hover:bg-gray-50">
                            <MdRemoveRedEye /> Detail
                          </button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex items-center justify-between">
                <div>Menampilkan {dataFiltered.length} entri</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Total Masuk:</span>
                  <strong>{sumMasuk.toLocaleString("id-ID")}</strong>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500">Total Keluar:</span>
                  <strong>{sumKeluar.toLocaleString("id-ID")}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={openAdj}
        title={`${adjMode === "masuk" ? "Tambah" : "Kurangi"} Stok`}
        onClose={() => setOpenAdj(false)}
        initialFocusRef={adjFocusRef}
      >
        <form
          className="grid grid-cols-1 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            saveAdjust();
          }}
        >
          <Labeled label="Tanggal">
            <input
              ref={adjFocusRef}
              type="date"
              value={adjForm.tanggal}
              onChange={(e) => setAdjForm((f) => ({ ...f, tanggal: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              required
            />
          </Labeled>

          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Qty">
              <input
                inputMode="numeric"
                value={adjForm.qty}
                onChange={(e) => setAdjForm((f) => ({ ...f, qty: e.target.value.replace(/\D/g, "") }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="0"
                required
              />
            </Labeled>
            <Labeled label="Harga Dasar (opsional)">
              <input
                inputMode="numeric"
                value={adjForm.harga_dasar}
                onChange={(e) => setAdjForm((f) => ({ ...f, harga_dasar: e.target.value.replace(/\D/g, "") }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
                placeholder="0"
              />
            </Labeled>
          </div>

          <Labeled label="Keterangan">
            <input
              value={adjForm.keterangan}
              onChange={(e) => setAdjForm((f) => ({ ...f, keterangan: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
              placeholder={adjMode === "masuk" ? "Pembelian / returan, dll." : "Penjualan / waste, dll."}
            />
          </Labeled>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenAdj(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Summary({ label, value, focus = false }) {
  return (
    <div className={`p-3 rounded-xl border ${focus ? "bg-green-50 border-green-200" : "bg-white"}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-base ${focus ? "font-bold text-green-800" : ""}`}>{value}</div>
    </div>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Th({ children, w, right }) {
  return (
    <th className={`px-4 py-3 font-semibold text-gray-700 ${right ? "text-right" : "text-left"}`} style={w ? { width: w } : undefined}>
      {children}
    </th>
  );
}
function Td({ children, right }) {
  return (
    <td className={`px-4 py-3 ${right ? "text-right" : "text-left"}`}>{children}</td>
  );
}