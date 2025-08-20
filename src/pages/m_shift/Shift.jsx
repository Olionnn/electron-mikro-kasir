import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdCalendarToday,
  MdAdd,
  MdDownload,
  MdUpload,
  MdClose,
  MdDelete,
  MdPointOfSale,
  MdHistory,
  MdArrowForward,
} from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";
import { useNavigate } from "react-router-dom";

// Utils
const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const nowISO = () => new Date().toISOString();
const byDescTime = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
const readLS = (k, def) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(def) && !Array.isArray(v) ? def : (v ?? def); }
  catch { return def; }
};
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Local “modal” (simple)
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 grid place-items-center">
            <MdClose />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function ShiftManagementPage() {
  const navigate = useNavigate();
  const onBack = useCallback(() => navigate(-1), [navigate]);

  // Navbar
  useNavbar(
    {
      variant: "page",
      title: "SHIFT",
      backTo: null,
      actions: [
        {
          type: "button",
          title: "Pengaturan Tanggal",
          onClick: () => console.log("Pengaturan tanggal"),
          className: "rounded-full w-10 h-10 inline-grid place-items-center text-gray-700 hover:bg-gray-100",
          icon: <MdCalendarToday size={18} />,
        },
      ],
    },
    [onBack]
  );

  // ===== STATE & STORAGE =====
  const [shifts, setShifts] = useState(() => readLS("shifts", []));
  const [moves, setMoves] = useState(() => readLS("shift_movements", []));

  useEffect(() => writeLS("shifts", shifts), [shifts]);
  useEffect(() => writeLS("shift_movements", moves), [moves]);

  const currentShift = useMemo(() => shifts.find((s) => s.status === "open") || null, [shifts]);
  const recentClosed = useMemo(() => shifts.filter((s) => s.status === "closed").slice(0, 5), [shifts]);

  const movesForCurrent = useMemo(
    () => (currentShift ? moves.filter((m) => m.shiftId === currentShift.id).sort(byDescTime) : []),
    [moves, currentShift]
  );

  // ===== MODALS =====
  const [openStart, setOpenStart] = useState(false);
  const [openCashIn, setOpenCashIn] = useState(false);
  const [openCashOut, setOpenCashOut] = useState(false);
  const [openClose, setOpenClose] = useState(false);

  // ===== HANDLERS =====
  const handleStartShift = (openingCash, cashier = "Anda") => {
    if (currentShift) return;
    const id = `SFT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(Math.random()).slice(2, 6)}`;
    const row = {
      id,
      cashier,
      startAt: nowISO(),
      endAt: null,
      openingCash: Number(openingCash || 0),
      sales: 0,
      cashIn: 0,
      cashOut: 0,
      closingCash: null,
      status: "open",
      note: "",
      createdAt: nowISO(),
    };
    setShifts((p) => [row, ...p]);
  };

  const pushMove = (type, amount, note) => {
    if (!currentShift) return;
    const item = {
      id: `MV-${String(Math.random()).slice(2, 8)}`,
      shiftId: currentShift.id,
      type, // 'cash_in' | 'cash_out' | 'sale'
      amount: Number(amount || 0),
      note: note || "",
      createdAt: nowISO(),
    };
    setMoves((p) => [item, ...p]);
    // update aggregate ke shift
    setShifts((rows) =>
      rows.map((s) =>
        s.id === currentShift.id
          ? {
              ...s,
              sales: s.sales + (type === "sale" ? item.amount : 0),
              cashIn: s.cashIn + (type === "cash_in" ? item.amount : 0),
              cashOut: s.cashOut + (type === "cash_out" ? item.amount : 0),
            }
          : s
      )
    );
  };

  const removeMove = (moveId) => {
    const mv = moves.find((m) => m.id === moveId);
    if (!mv) return;
    setMoves((p) => p.filter((m) => m.id !== moveId));
    if (currentShift && mv.shiftId === currentShift.id) {
      setShifts((rows) =>
        rows.map((s) =>
          s.id === currentShift.id
            ? {
                ...s,
                sales: s.sales - (mv.type === "sale" ? mv.amount : 0),
                cashIn: s.cashIn - (mv.type === "cash_in" ? mv.amount : 0),
                cashOut: s.cashOut - (mv.type === "cash_out" ? mv.amount : 0),
              }
            : s
        )
      );
    }
  };

  const handleCloseShift = (closingCash, note) => {
    if (!currentShift) return;
    const expected = currentShift.openingCash + currentShift.sales + currentShift.cashIn - currentShift.cashOut;
    const toClose = {
      ...currentShift,
      endAt: nowISO(),
      closingCash: Number(closingCash || 0),
      status: "closed",
      note: note || "",
      variance: Number(closingCash || 0) - expected,
    };
    setShifts((rows) => rows.map((s) => (s.id === currentShift.id ? toClose : s)));
  };

  // Quick demo: tambahkan “penjualan” agar kas tidak hanya cash in/out
  const addDummySale = () => {
    const rnd = Math.floor(50_000 + Math.random() * 300_000);
    pushMove("sale", rnd, "Penjualan cepat");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] border-t">
        {/* LEFT: Management Panel */}
        <div className="flex-1 flex flex-col p-8 bg-white">
          {/* Hero / Header */}
          <div className="mx-auto w-full max-w-2xl">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-violet-50 border border-violet-100 shadow-sm">
                <MdPointOfSale className="text-3xl text-violet-600" />
              </div>
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold text-gray-800">Manajemen Shift Kasir</h2>
            <p className="text-center text-gray-600">Buka/tutup shift, catat kas masuk/keluar, dan kelola laci kas di sini.</p>

            {/* Status / CTA */}
            {!currentShift ? (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setOpenStart(true)}
                  className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-full shadow"
                >
                  <MdAdd size={18} /> Mulai Shift
                </button>
                <div className="text-xs text-gray-500 mt-2">Tentukan modal awal laci kas</div>
              </div>
            ) : (
              <div className="mt-6 bg-violet-50 border border-violet-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Shift Berjalan</div>
                    <div className="font-semibold text-gray-800">
                      {currentShift.id} • {currentShift.cashier}
                    </div>
                    <div className="text-xs text-gray-500">
                      Mulai: {new Date(currentShift.startAt).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-violet-100 text-violet-700">OPEN</span>
                </div>

                {/* cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="rounded-xl border bg-white p-3">
                    <div className="text-[11px] text-gray-500">Modal Awal</div>
                    <div className="font-semibold">{fmtIDR(currentShift.openingCash)}</div>
                  </div>
                  <div className="rounded-xl border bg-white p-3">
                    <div className="text-[11px] text-gray-500">Penjualan</div>
                    <div className="font-semibold text-violet-700">{fmtIDR(currentShift.sales)}</div>
                  </div>
                  <div className="rounded-xl border bg-white p-3">
                    <div className="text-[11px] text-gray-500">Kas Masuk</div>
                    <div className="font-semibold">{fmtIDR(currentShift.cashIn)}</div>
                  </div>
                  <div className="rounded-xl border bg-white p-3">
                    <div className="text-[11px] text-gray-500">Kas Keluar</div>
                    <div className="font-semibold">{fmtIDR(currentShift.cashOut)}</div>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setOpenCashIn(true)}
                    className="inline-flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50"
                  >
                    <MdDownload /> Kas Masuk
                  </button>
                  <button
                    onClick={() => setOpenCashOut(true)}
                    className="inline-flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50"
                  >
                    <MdUpload /> Kas Keluar
                  </button>
                  <button
                    onClick={addDummySale}
                    className="inline-flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50"
                  >
                    + Penjualan
                  </button>
                  <button
                    onClick={() => setOpenClose(true)}
                    className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-2"
                  >
                    Tutup Shift <MdArrowForward />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Riwayat Shift singkat */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Shift Terakhir</h3>
            {recentClosed.length === 0 ? (
              <div className="text-sm text-gray-500">Belum ada riwayat.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {recentClosed.map((s) => {
                  const expected = s.openingCash + s.sales + s.cashIn - s.cashOut;
                  const variance = (s.closingCash ?? 0) - expected;
                  return (
                    <div key={s.id} className="rounded-xl border bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{s.id}</div>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">CLOSED</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(s.startAt).toLocaleString("id-ID")} – {new Date(s.endAt).toLocaleString("id-ID")}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                        <div>
                          <div className="text-gray-500">Kas Akhir</div>
                          <div className="font-semibold">{fmtIDR(s.closingCash ?? 0)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Selisih</div>
                          <div className={`font-semibold ${variance === 0 ? "text-gray-600" : variance > 0 ? "text-violet-700" : "text-red-600"}`}>
                            {fmtIDR(variance)}
                          </div>
                        </div>
                      </div>
                      {s.note && <div className="text-xs text-gray-500 mt-2">Catatan: {s.note}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Movements List */}
        <div className="w-full md:w-1/2 border-l bg-white p-6 flex flex-col shadow-inner">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h2 className="font-bold text-gray-800 text-lg tracking-wide flex items-center gap-2">
              <MdHistory /> PERGERAKAN KAS
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Shift:</span>
              <div className="px-3 py-1 rounded-lg border text-sm bg-gray-50">
                {currentShift ? currentShift.id : "—"}
              </div>
            </div>
          </div>

          {!currentShift ? (
            <div className="flex-1 grid place-items-center text-gray-500 text-sm">Belum ada shift yang berjalan.</div>
          ) : movesForCurrent.length === 0 ? (
            <div className="flex-1 grid place-items-center text-gray-400 text-sm">Belum ada pergerakan kas.</div>
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="divide-y">
                {movesForCurrent.map((m) => (
                  <div key={m.id} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {m.type === "cash_in" && <span className="text-violet-700">Kas Masuk</span>}
                        {m.type === "cash_out" && <span className="text-red-600">Kas Keluar</span>}
                        {m.type === "sale" && <span className="text-gray-700">Penjualan</span>}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString("id-ID")}</div>
                      {m.note && <div className="text-xs text-gray-600 mt-1">{m.note}</div>}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${m.type === "cash_out" ? "text-red-600" : "text-violet-700"}`}>
                        {fmtIDR(m.amount)}
                      </div>
                      <button
                        onClick={() => removeMove(m.id)}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                        title="Hapus item"
                      >
                        <MdDelete /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==== MODALS ==== */}

      {/* Mulai Shift */}
      <Modal open={openStart} title="Mulai Shift" onClose={() => setOpenStart(false)}>
        <StartForm
          onSubmit={(val) => {
            handleStartShift(val.openingCash, val.cashier);
            setOpenStart(false);
          }}
        />
      </Modal>

      {/* Kas Masuk */}
      <Modal open={openCashIn} title="Kas Masuk" onClose={() => setOpenCashIn(false)}>
        <CashForm
          label="Nominal Kas Masuk"
          onSubmit={(val) => {
            pushMove("cash_in", val.amount, val.note);
            setOpenCashIn(false);
          }}
        />
      </Modal>

      {/* Kas Keluar */}
      <Modal open={openCashOut} title="Kas Keluar" onClose={() => setOpenCashOut(false)}>
        <CashForm
          label="Nominal Kas Keluar"
          onSubmit={(val) => {
            pushMove("cash_out", val.amount, val.note);
            setOpenCashOut(false);
          }}
        />
      </Modal>

      {/* Tutup Shift */}
      <Modal open={openClose} title="Tutup Shift" onClose={() => setOpenClose(false)}>
        <CloseForm
          expected={
            currentShift
              ? currentShift.openingCash + currentShift.sales + currentShift.cashIn - currentShift.cashOut
              : 0
          }
          onSubmit={(val) => {
            handleCloseShift(val.closingCash, val.note);
            setOpenClose(false);
          }}
        />
      </Modal>
    </div>
  );
}

/* ====== FORM COMPONENTS ====== */

function Input({ label, suffix, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-200">
        <input {...props} className="flex-1 outline-none" />
        {suffix}
      </div>
    </label>
  );
}

function StartForm({ onSubmit }) {
  const [openingCash, setOpeningCash] = useState(200000);
  const [cashier, setCashier] = useState("Anda");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ openingCash: Number(openingCash || 0), cashier });
      }}
      className="space-y-3"
    >
      <Input
        label="Nama Kasir"
        value={cashier}
        onChange={(e) => setCashier(e.target.value)}
        placeholder="Nama kasir"
      />
      <Input
        label="Modal Awal"
        type="number"
        value={openingCash}
        onChange={(e) => setOpeningCash(e.target.value)}
        suffix={<span className="text-xs text-gray-500">IDR</span>}
      />
      <button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2 font-semibold">
        Mulai Shift
      </button>
    </form>
  );
}

function CashForm({ label, onSubmit }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ amount: Number(amount || 0), note });
      }}
      className="space-y-3"
    >
      <Input
        label={label}
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        suffix={<span className="text-xs text-gray-500">IDR</span>}
      />
      <label className="block">
        <span className="text-sm text-gray-700">Catatan (opsional)</span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          placeholder="Contoh: setoran awal kasir pengganti"
        />
      </label>
      <button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2 font-semibold">
        Simpan
      </button>
    </form>
  );
}

function CloseForm({ expected = 0, onSubmit }) {
  const [closingCash, setClosingCash] = useState(expected);
  const [note, setNote] = useState("");
  const variance = Number(closingCash || 0) - expected;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ closingCash: Number(closingCash || 0), note });
      }}
      className="space-y-3"
    >
      <div className="rounded-lg border bg-gray-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Perkiraan Kas Akhir</span>
          <span className="font-semibold">{fmtIDR(expected)}</span>
        </div>
      </div>
      <Input
        label="Hitung Kas Fisik (Kasir)"
        type="number"
        value={closingCash}
        onChange={(e) => setClosingCash(e.target.value)}
        suffix={<span className="text-xs text-gray-500">IDR</span>}
      />
      <div className="text-sm">
        Selisih:{" "}
        <span className={`font-semibold ${variance === 0 ? "text-gray-700" : variance > 0 ? "text-violet-700" : "text-red-600"}`}>
          {fmtIDR(variance)}
        </span>
      </div>
      <label className="block">
        <span className="text-sm text-gray-700">Catatan (opsional)</span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          placeholder="Contoh: uang kurang karena tips belum dihitung"
        />
      </label>
      <button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2 font-semibold">
        Tutup Shift
      </button>
    </form>
  );
}