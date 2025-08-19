import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { FaCheck, FaExchangeAlt, FaStar, FaMoneyBillAlt, FaBackspace } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNavbar } from '../../hooks/useNavbar';

const SALE_METHODS = [
  { name: 'Cash', checked: true },
  { name: 'Debit', checked: true },
  { name: 'GoPay', checked: true },
  { name: 'OVO', checked: true },
  { name: 'Cashlez', checked: true },
  { name: 'Dana', checked: true },
  { name: 'LikAja', checked: true },
  { name: 'QRIS', checked: true },
  { name: 'Transfer', checked: true },
  { name: 'Cicilan', checked: false },
];

const Transaksi = () => {
  const navigate = useNavigate();
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);

  // "sale" | "purchase"
  const [mode, setMode] = useState('sale');
  const [allowCredit, setAllowCredit] = useState(false);

  // --- tambahan ---
  const [note, setNote] = useState('');
  const [splitOpen, setSplitOpen] = useState(false);
  const [methods] = useState(SALE_METHODS);
  const enabledMethods = useMemo(() => methods.filter(m => m.checked), [methods]);
  const [splits, setSplits] = useState([]); // [{method:'Cash', amount:10000}, ...]

  // penentu nama pihak (pelanggan/supplier)
  const partyName = useMemo(() => {
    if (mode === 'purchase') {
      return (
        checkoutOrder?.supplier?.nama ||
        checkoutOrder?.supplier_name ||
        checkoutOrder?.supplier ||
        'Tanpa Supplier'
      );
    }
    return (
      checkoutOrder?.customer?.nama ||
      checkoutOrder?.customer ||
      'Umum'
    );
  }, [mode, checkoutOrder]);

  // tampilkan poin hanya untuk penjualan & bukan pelanggan "Umum"
  const showPoints = useMemo(() => {
    return mode === 'sale' && String(partyName || '').toLowerCase() !== 'umum';
  }, [mode, partyName]);

  // baca order dari localStorage: utamakan penjualan, fallback pembelian
  useEffect(() => {
    const sale = JSON.parse(localStorage.getItem('currentCheckout') || 'null');
    const purchase = JSON.parse(localStorage.getItem('pembelian.current') || 'null');

    const data = sale || purchase;
    if (!data) {
      navigate('/pesanan');
      return;
    }

    const detected = data.type === 'purchase' || data.supplier_id ? 'purchase' : 'sale';
    setMode(detected);
    setCheckoutOrder(data);
  }, [navigate]);

  // total dari split -> override paidAmount
  useEffect(() => {
    if (splitOpen) {
      const totalSplit = splits.reduce((s, r) => s + Number(r.amount || 0), 0);
      setPaidAmount(totalSplit);
    }
  }, [splits, splitOpen]);

  // === Navbar actions ===
  const handlePaymentSuccess = useCallback(() => {
    const total = Number(checkoutOrder?.total || 0);

    if (!allowCredit && paidAmount < total) {
      alert('Uang tidak boleh kurang dari total yang harus dibayar');
      return;
    }

    if (checkoutOrder) {
      const paidOrders = JSON.parse(localStorage.getItem('paidOrders') || '[]');
      paidOrders.push({
        ...checkoutOrder,
        paidAt: new Date().toISOString(),
        paidAmount,
        mode,                 // histori
        creditUsed: allowCredit,
        note,                 // simpan keterangan
        payments: splitOpen ? splits : [{ method: 'Single', amount: paidAmount }],
      });
      localStorage.setItem('paidOrders', JSON.stringify(paidOrders));

      // bersihkan sumber yang digunakan tanpa mengganggu yang lain
      if (mode === 'sale') {
        localStorage.removeItem('currentCheckout');
        navigate('/struk');
      } else {
        localStorage.removeItem('pembelian.current');
        navigate('/pembelian-supplier');
      }
    }
  }, [checkoutOrder, paidAmount, mode, allowCredit, note, splits, splitOpen, navigate]);

  const actions = useMemo(
    () => [
      {
        type: 'button',
        title: 'Selesai (F12)',
        onClick: handlePaymentSuccess,
        label: 'Selesai (F12)',
        className:
          'bg-violet-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-violet-700',
        icon: <FaCheck size={18} />,
      },
    ],
    [handlePaymentSuccess]
  );

  const onBack = useCallback(() => {navigate(-1);}, [navigate]);

  useNavbar(
    {
      variant: 'page',
      title: 'Transaksi',
      backTo: onBack,
      actions,
    },
    [actions]
  );

  // shortcut F12 -> selesai, F2 -> uang pas
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
        handlePaymentSuccess();
      } else if (e.key === 'F2') {
        e.preventDefault();
        setPaidAmount((prev) => prev + (checkoutOrder?.total || 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePaymentSuccess, checkoutOrder?.total]);

  const handleAddAmount = (value) => {
    if (splitOpen) {
      // saat pisah bayar aktif, angka keypad tidak dipakai (supaya tidak rancu)
      return;
    }
    setPaidAmount((prev) => prev + (Number(value) || 0));
  };

  const handleClearAmount = () => {
    setPaidAmount(0);
    if (splitOpen) setSplits([]);
  };

  const total = Number(checkoutOrder?.total || 0);
  const totalDisplay = total.toLocaleString('id-ID');

  // --------- Diskon & Pajak dari meta ---------
  const globalDiscount = checkoutOrder?.meta?.globalDiscount || null;
  const globalTax = checkoutOrder?.meta?.globalTax || null;

  const discountAmount = useMemo(() => {
    if (!globalDiscount) return 0;
    return globalDiscount.type === 'pct'
      ? Math.max(0, Math.floor((total * Number(globalDiscount.value || 0)) / (100 + Number(globalTax?.pct || 0) || 100))) // pendekatan: diskon dihitung sebelum pajak jika total yang tersimpan pasca (opsional)
      : Number(globalDiscount.value || 0);
  }, [globalDiscount, total, globalTax]);

  const taxPct = Number(globalTax?.pct || 0);

  // --------- Poin pelanggan (hanya penjualan) ---------
  const earnablePoints = useMemo(() => {
    if (!showPoints) return 0; // mengikuti role toko: "Umum" tidak dapat poin & pembelian tidak ada poin
    // contoh aturan: 1 poin / Rp10.000 dari total
    return Math.floor(total / 10000);
  }, [showPoints, total]);

  // --------- UI ----------
  const mainPaymentBadge = useMemo(() => {
    if (splitOpen && splits.length > 0) {
      return `Metode: ${splits.map(s => `${s.method} (Rp ${Number(s.amount||0).toLocaleString('id-ID')})`).join(' + ')}`;
    }
    return `Metode: Cash`;
  }, [splitOpen, splits]);

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* TOTAL */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
        <div className="rounded px-3 py-1 border bg-white shadow-sm text-sm font-medium">
          TOTAL: <strong>Rp {totalDisplay}</strong>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700">
            {mode === 'sale' ? 'Penjualan' : 'Pembelian'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Bayar: <span className="font-semibold">Rp {paidAmount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 p-4 gap-6 overflow-hidden">
        {/* KIRI */}
        <div className="flex flex-col w-1/2 gap-4">
          <div className="flex gap-2">
            {showPoints && (
              <button className="flex items-center border border-violet-600 text-violet-600 px-3 py-1 rounded-full hover:bg-violet-50">
                <FaStar className="mr-1" /> + {earnablePoints} POIN
              </button>
            )}
            {mode === 'sale' && (
              <button
                className="flex items-center bg-violet-500 text-white px-3 py-1 rounded-full hover:bg-violet-600"
                onClick={() => setSplitOpen(true)}
              >
                <FaExchangeAlt className="mr-1" /> Pisah Bayar
              </button>
            )}
          </div>

          <div className="text-4xl font-bold text-center text-black mt-2 tracking-wide">
            Rp {paidAmount.toLocaleString('id-ID')}
          </div>

          <div className="flex items-center gap-2">
            {/* Piutang/Hutang */}
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="w-5 h-5 accent-violet-600"
                checked={allowCredit}
                onChange={(e) => setAllowCredit(e.target.checked)}
              />
              <span>{mode === 'sale' ? 'Piutang' : 'Hutang'}</span>
            </label>

            <button className="border border-red-500 text-red-500 px-3 py-1 rounded-full font-medium hover:bg-red-50">
              {partyName || 'Pelanggan / Supplier'}
            </button>

            {/* Nomor meja hanya untuk penjualan */}
            {mode === 'sale' && (
              <input
                type="text"
                placeholder="No.Meja"
                className="border px-3 py-1 rounded w-24 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            )}
          </div>

          {/* Input Keterangan */}
          <input
            type="text"
            placeholder="Keterangan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Info diskon/pajak/metode */}
          <div className="flex gap-2 flex-wrap">
            <div className="border border-gray-300 px-3 py-1 rounded-full text-sm">
              Disc : {globalDiscount ? (globalDiscount.type === 'pct' ? `${globalDiscount.value}%` : `Rp ${Number(globalDiscount.value).toLocaleString('id-ID')}`) : '0%'}
            </div>
            <div className="border border-gray-300 px-3 py-1 rounded-full text-sm">
              Tax : {taxPct}%
            </div>
            <div className="border border-violet-600 text-violet-600 px-3 py-1 rounded-full text-sm">
              {mainPaymentBadge}
            </div>
          </div>

          {/* Tombol cepat nominal */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => handleAddAmount(checkoutOrder?.total || 0)}
              className="bg-violet-600 text-white py-3 rounded hover:bg-violet-700"
            >
              Uang Pas (F2)
            </button>
            <button
              onClick={() => handleAddAmount(20000)}
              className="bg-violet-600 text-white py-3 rounded hover:bg-violet-700"
            >
              Rp 20.000
            </button>
            <button
              onClick={() => handleAddAmount(50000)}
              className="bg-violet-600 text-white py-3 rounded hover:bg-violet-700"
            >
              Rp 50.000
            </button>
            <button
              onClick={() => handleAddAmount(100000)}
              className="bg-violet-600 text-white py-3 rounded hover:bg-violet-700"
            >
              Rp 100.000
            </button>
            <button className="bg-violet-600 text-white py-3 rounded col-span-2 hover:bg-violet-700">
              Lainnya
            </button>
          </div>
        </div>

        {/* KANAN: keypad */}
        <div className="w-1/2 grid grid-cols-4 gap-2">
          {['7','8','9','C','4','5','6','BK','1','2','3','PAS','0','00','000','.'].map((key, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (splitOpen) return; // saat pisah bayar, keypad dinonaktifkan
                if (key === 'C') return handleClearAmount();
                if (key === 'BK') return setPaidAmount((prev) => Math.floor(prev / 10));
                if (key === 'PAS') return handleAddAmount(checkoutOrder?.total || 0);
                if (key === '00') return setPaidAmount((prev) => prev * 100);
                if (key === '000') return setPaidAmount((prev) => prev * 1000);
                if (key === '.') return; // integer
                if (!isNaN(key)) return setPaidAmount((prev) => prev * 10 + parseInt(key, 10));
              }}
              className="bg-gray-100 hover:bg-gray-200 py-6 rounded text-2xl font-bold flex items-center justify-center border border-gray-200"
            >
              {key === 'BK' ? <FaBackspace /> : key === 'PAS' ? <FaMoneyBillAlt /> : key}
            </button>
          ))}
        </div>
      </div>

      {/* Modal Pisah Bayar */}
      {splitOpen && mode === 'sale' && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Pisah Bayar</div>
              <button
                onClick={() => setSplitOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {splits.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="border rounded-lg px-2 py-2 flex-1"
                    value={row.method}
                    onChange={(e) =>
                      setSplits(arr => arr.map((r, idx) => idx === i ? { ...r, method: e.target.value } : r))
                    }
                  >
                    {enabledMethods.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    className="border rounded-lg px-3 py-2 w-40"
                    placeholder="0"
                    value={row.amount}
                    onChange={(e) =>
                      setSplits(arr => arr.map((r, idx) => idx === i ? { ...r, amount: Number(e.target.value || 0) } : r))
                    }
                  />
                  <button
                    className="px-3 py-2 rounded-lg border text-red-600 hover:bg-red-50"
                    onClick={() => setSplits(arr => arr.filter((_, idx) => idx !== i))}
                  >
                    Hapus
                  </button>
                </div>
              ))}

              <div className="flex justify-between text-sm mt-2 px-1">
                <div className="text-gray-600">Total Harus Bayar</div>
                <div className="font-semibold">Rp {total.toLocaleString('id-ID')}</div>
              </div>
              <div className="flex justify-between text-sm px-1">
                <div className="text-gray-600">Total Split</div>
                <div className="font-semibold text-violet-700">Rp {splits.reduce((s, r) => s + Number(r.amount||0), 0).toLocaleString('id-ID')}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={() => setSplits(arr => [...arr, { method: enabledMethods[0]?.name || 'Cash', amount: 0 }])}
              >
                + Tambah Baris
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border" onClick={() => { setSplits([]); setSplitOpen(false); }}>
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                  onClick={() => {
                    // validasi sederhana
                    const sum = splits.reduce((s, r) => s + Number(r.amount||0), 0);
                    if (!allowCredit && sum < total) {
                      alert('Total split kurang dari total yang harus dibayar.');
                      return;
                    }
                    setSplitOpen(false);
                  }}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaksi;