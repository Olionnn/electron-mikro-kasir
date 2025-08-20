import React, { useState, useCallback, useMemo } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { useNavigate } from "react-router-dom";

/* ====================== LS helpers (tidak diubah) ====================== */
const K_ARUS = "arus_keuangan";
const K_DETAIL = "arus_keuangan_detail";
const nowISO = () => new Date().toISOString();

const lsRead = (k, def) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; }
  catch { return def; }
};
const lsWrite = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const parseRupiahToInt = (s) => {
  if (!s) return 0;
  const n = String(s).replace(/[^\d]/g, "");
  return Number(n || 0);
};

function upsertArusKeuangan({ tanggal, tipe, nominal, toko_id = 1, user_id = 1 }) {
  const list = lsRead(K_ARUS, []);
  const keyDate = new Date(tanggal).toISOString().slice(0, 10); // YYYY-MM-DD
  const idx = list.findIndex((r) => r.tanggal?.slice(0,10) === keyDate);

  const base = {
    id: list.length ? Math.max(...list.map((x) => x.id || 0)) + 1 : 1,
    toko_id,
    tanggal: new Date(keyDate).toISOString(),
    total_pemasukan: 0,
    total_pengeluaran: 0,
    total_pemasukan_lain: 0,
    total_pengeluaran_lain: 0,
    created_by: user_id,
    updated_by: user_id,
    sync_at: null,
    status: true,
    created_at: nowISO(),
    updated_at: nowISO(),
  };

  let row = idx >= 0 ? { ...list[idx] } : base;

  if (tipe === "Pemasukan") {
    row.total_pemasukan_lain = (row.total_pemasukan_lain || 0) + nominal;
  } else {
    row.total_pengeluaran_lain = (row.total_pengeluaran_lain || 0) + nominal;
  }

  row.updated_at = nowISO();

  if (idx >= 0) list[idx] = row; else list.push(row);
  lsWrite(K_ARUS, list);
  return row.id;
}

function insertArusKeuanganDetail({
  tanggal,
  nominal,
  tipe, // "Pemasukan" | "Pengeluaran"
  catatan = "",
  toko_id = 1,
  user_id = 1,
  pelanggan_id = null,
  supplier_id = null,
  arus_keuangan_id,
}) {
  const details = lsRead(K_DETAIL, []);
  const item = {
    id: details.length ? Math.max(...details.map((x) => x.id || 0)) + 1 : 1,
    toko_id,
    arus_keuangan_id: arus_keuangan_id ?? null,
    supplier_id,
    pelanggan_id,
    jenis: "lain",
    tipe,
    tanggal: new Date(tanggal).toISOString(),
    nominal,
    catatan,
    created_by: user_id,
    updated_by: user_id,
    sync_at: null,
    status: true,
    created_at: nowISO(),
    updated_at: nowISO(),
  };
  details.push(item);
  lsWrite(K_DETAIL, details);
  return item;
}

/* ============================ Komponen UI ============================= */
const chip = "inline-flex items-center px-3 py-1.5 rounded-full text-sm border";
const labelCls = "block mb-2 font-semibold text-gray-700";
const inputCls = "w-full border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white";

const Keuangan = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("Pemasukan");
  const [nominal, setNominal] = useState("Rp 0");
  const [kontak, setKontak] = useState("");
  const [tanggal, setTanggal] = useState("2025-08-05");
  const [catatan, setCatatan] = useState("");
  const [cashdrawer, setCashdrawer] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // preset nominal cepat
  const presets = useMemo(() => [50000, 100000, 200000, 500000], []);

  const formatRp = useCallback((num) => "Rp " + Number(num || 0).toLocaleString("id-ID"), []);
  const setNominalFromInt = useCallback((intVal) => setNominal(formatRp(intVal)), [formatRp]);

  const onSave = useCallback(async () => {
    setError("");
    const nilai = parseRupiahToInt(nominal);

    if (!nilai || nilai <= 0) {
      setError("Nominal harus lebih dari 0");
      return;
    }
    if (!tanggal) {
      setError("Tanggal belum dipilih");
      return;
    }

    setSaving(true);
    try {
      const aggrId = upsertArusKeuangan({
        tanggal,
        tipe: tab,
        nominal: nilai,
      });

      insertArusKeuanganDetail({
        tanggal,
        nominal: nilai,
        tipe: tab,
        catatan,
        arus_keuangan_id: aggrId,
        pelanggan_id: tab === "Pemasukan" ? (kontak ? 1 : null) : null,
        supplier_id: tab === "Pengeluaran" ? (kontak ? 1 : null) : null,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // reset ringan catatan & kalkulator
      setCatatan("");
      setCalcDisplay("0");
      // jangan reset tanggal/nominal biar entry berikutnya mudah
    } finally {
      setSaving(false);
    }
  }, [tab, nominal, tanggal, catatan, kontak]);

  useNavbar(
    {
      variant: "page",
      title: "Keuangan",
      backTo: null,
      actions: [
        {
          type: "button",
          title: "Simpan",
          onClick: onSave,
          className: "inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50",
          label: saving ? "Menyimpan..." : "Simpan",
        },
      ],
    },
    [onSave, saving]
  );

  // sinkron kalkulator ke nominal
  const handleCalcClick = (val) => {
    if (val === "AC") {
      setCalcDisplay("0");
      setNominalFromInt(0);
      return;
    }
    if (val === "→") {
      setCalcDisplay((p) => (p.length > 1 ? p.slice(0, -1) : "0"));
      const current = parseRupiahToInt(nominal);
      const next = Math.floor(current / 10);
      setNominalFromInt(next);
      return;
    }
    if (val === ",") return; // kita abaikan desimal

    if (/\d/.test(val)) {
      setCalcDisplay((p) => (p === "0" ? val : p + val));
      const next = parseInt((parseRupiahToInt(nominal).toString() + val).replace(/^0+/, "")) || Number(val);
      setNominalFromInt(next);
      return;
    }

    // operator (dummy)
    // ["÷", "×", "−", "+", "%", "±"]
  };

  const kontakOptions = [
    { value: "", label: "Pilih Kontak" },
    { value: "kontak1", label: "Kontak 1" },
    { value: "kontak2", label: "Kontak 2" },
  ];
  const calcRows = [
    ["AC", "→", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", "0", ","],
  ];

  return (
    <div className="h-full w-screen bg-gradient-to-b from-violet-50 to-white text-gray-800 flex flex-col">
      {/* Banner sukses / error */}
      {(saved || error) && (
        <div className="px-4 pt-3">
          {saved && (
            <div className="mb-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-800">
              Data tersimpan ke localStorage ✅
            </div>
          )}
          {error && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full flex flex-col xl:flex-row">
          {/* ===================== Kiri: Form ===================== */}
          <div className="w-full xl:w-1/2 p-6 md:p-8 overflow-auto">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Tabs */}
              <div className="bg-white/70 backdrop-blur rounded-2xl border p-1 shadow-sm w-fit">
                {["Pemasukan", "Pengeluaran"].map((t) => (
                  <button
                    key={t}
                    className={`px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-semibold text-base md:text-lg transition
                      ${tab === t ? "bg-violet-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Nominal */}
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <label className={labelCls}>Nominal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={nominal}
                    onChange={(e) => {
                      const v = parseRupiahToInt(e.target.value);
                      setNominalFromInt(v);
                      setCalcDisplay(String(v));
                    }}
                    className={`${inputCls} text-2xl md:text-3xl`}
                  />
                </div>
                {/* Presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`${chip} border-violet-300 text-violet-700 hover:bg-violet-50`}
                      onClick={() => {
                        const cur = parseRupiahToInt(nominal);
                        const next = cur + p;
                        setNominalFromInt(next);
                        setCalcDisplay(String(next));
                      }}
                    >
                      + {formatRp(p)}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${chip} border-gray-300 text-gray-600 hover:bg-gray-50`}
                    onClick={() => { setNominalFromInt(0); setCalcDisplay("0"); }}
                  >
                    Reset
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Contoh: Rp 150.000</p>
              </div>

              {/* Kontak & Tanggal */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border shadow-sm p-5">
                  <label className={labelCls}>Kontak</label>
                  <select
                    className={inputCls}
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                  >
                    {kontakOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-white rounded-2xl border shadow-sm p-5">
                  <label className={labelCls}>Tanggal Dibuat</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Catatan */}
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <label className={labelCls}>Catatan</label>
                <input
                  type="text"
                  placeholder="Catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Cashdrawer + Simpan */}
              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-6 h-6 accent-violet-600"
                    checked={cashdrawer}
                    onChange={() => setCashdrawer((v) => !v)}
                  />
                  <span className="text-base md:text-lg">Masukkan ke Cashdrawer</span>
                </label>

                <button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition text-white font-semibold px-6 py-3 rounded-xl shadow-sm"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 p-6 md:p-8 bg-white/60 backdrop-blur border-l overflow-auto">
            <div className="max-w-lg mx-auto w-full">
              <div className="text-right text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {calcDisplay}
              </div>

              <div className="grid grid-cols-4 gap-3 md:gap-4 text-center text-2xl md:text-3xl font-bold">
                {calcRows.map((row, rIdx) =>
                  row.map((btn, cIdx) => {
                    const isWideZero = rIdx === 4 && cIdx === 0;
                    const isFunction = ["AC", "→", "%"].includes(btn);
                    const isOperator = ["÷", "×", "−", "+"].includes(btn);
                    return (
                      <button
                        key={`${rIdx}-${cIdx}-${btn}`}
                        className={
                          "py-5 md:py-6 rounded-xl transition active:scale-[0.99] shadow-sm " +
                          (isWideZero ? "col-span-2 " : "") +
                          (isFunction
                            ? "bg-violet-100 hover:bg-violet-200 text-violet-800"
                            : isOperator
                            ? "bg-violet-600 text-white hover:bg-violet-700"
                            : "bg-white border hover:bg-gray-50")
                        }
                        onClick={() => handleCalcClick(btn)}
                      >
                        {btn}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Tips kecil */}
              <div className="mt-6 text-sm text-gray-500">
                Tips: gunakan tombol angka untuk menambah nominal,{" "}
                <span className="font-medium">AC</span> untuk reset,{" "}
                <span className="font-medium">→</span> untuk hapus 1 digit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keuangan;
