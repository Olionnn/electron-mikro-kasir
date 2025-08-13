import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { FaArrowLeft, FaCheck, FaExchangeAlt, FaStar, FaMoneyBillAlt, FaBackspace } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNavbar } from '../../hooks/useNavbar';

const Transaksi = () => {
  const navigate = useNavigate();
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);

  // --- handlers dibuat stabil utk Navbar
  const handlePaymentSuccess = useCallback(() => {
    setPaidAmount((p) => p); // no-op menjaga referensi stabil
    // logic aslinya di bawah (tetap sama):
    if (checkoutOrder) {
      const paidOrders = JSON.parse(localStorage.getItem('paidOrders')) || [];
      paidOrders.push({
        ...checkoutOrder,
        paidAt: new Date().toISOString(),
        paidAmount
      });
      localStorage.setItem('paidOrders', JSON.stringify(paidOrders));
      localStorage.removeItem('currentCheckout');
      navigate('/struk');
    }
  }, [checkoutOrder, navigate, paidAmount]);

  // Pasang Navbar (back + tombol selesai)
  const actions = useMemo(
    () => [
      {
        type: 'button',
        title: 'Selesai (F12)',
        onClick: handlePaymentSuccess,
        label: 'Selesai (F12)',
        className:
          'bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700',
        icon: <FaCheck size={18} />,
      },
    ],
    [handlePaymentSuccess]
  );

  const onBack = useCallback(() => navigate(-1), [navigate]);

  useNavbar(
    {
      variant: 'page',
      title: 'Transaksi',
      backTo: onBack,
      actions,
    },
    [actions]
  );

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem('currentCheckout'));
    if (!orderData) {
      navigate('/pesanan');
      return;
    }
    setCheckoutOrder(orderData);
  }, [navigate]);

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
    setPaidAmount((prev) => prev + value);
  };

  const handleClearAmount = () => {
    setPaidAmount(0);
  };

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header lama disembunyikan karena sudah ada Navbar global */}
      {/* TOTAL */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
        <div className="rounded px-3 py-1 border bg-white shadow-sm text-sm font-medium">
          TOTAL: <strong>Rp {checkoutOrder?.total?.toLocaleString('id-ID')}</strong>
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
            <button className="flex items-center border border-green-600 text-green-600 px-3 py-1 rounded-full hover:bg-green-50">
              <FaStar className="mr-1" /> + 0 POIN
            </button>
            <button className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600">
              <FaExchangeAlt className="mr-1" /> Pisah Bayar
            </button>
          </div>

          <div className="text-4xl font-bold text-center text-black mt-2 tracking-wide">
            Rp {paidAmount.toLocaleString('id-ID')}
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-5 h-5 accent-green-600" />
              <span>Piutang</span>
            </label>
            <button className="border border-red-500 text-red-500 px-3 py-1 rounded-full font-medium hover:bg-red-50">
              {checkoutOrder?.customer || 'Pelanggan'}
            </button>
            <input
              type="text"
              placeholder="No.Meja"
              className="border px-3 py-1 rounded w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded">
            Keterangan
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="border border-gray-300 px-3 py-1 rounded-full text-sm">Disc : 0%</div>
            <div className="border border-gray-300 px-3 py-1 rounded-full text-sm">Tax : 0%</div>
            <div className="border border-green-600 text-green-600 px-3 py-1 rounded-full text-sm">
              Metode : cash
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => handleAddAmount(checkoutOrder?.total || 0)}
              className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Uang Pas (F2)
            </button>
            <button
              onClick={() => handleAddAmount(20000)}
              className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Rp 20.000
            </button>
            <button
              onClick={() => handleAddAmount(50000)}
              className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Rp 50.000
            </button>
            <button
              onClick={() => handleAddAmount(100000)}
              className="bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Rp 100.000
            </button>
            <button className="bg-green-600 text-white py-3 rounded col-span-2 hover:bg-green-700">
              Lainnya
            </button>
          </div>
        </div>

        {/* KANAN */}
        <div className="w-1/2 grid grid-cols-4 gap-2">
          {['7','8','9','C','4','5','6',<FaBackspace key="bk"/>, '1','2','3',<FaMoneyBillAlt key="cash"/>, '0','00','000','.'].map((val, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (val === 'C') {
                  handleClearAmount();
                } else if (!isNaN(val)) {
                  setPaidAmount(prev => prev * 10 + parseInt(val));
                }
                // Ikon/teks lain tetap no-op (sesuai fungsi sekarang)
              }}
              className="bg-gray-100 hover:bg-gray-200 py-6 rounded text-2xl font-bold flex items-center justify-center border border-gray-200"
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaksi;