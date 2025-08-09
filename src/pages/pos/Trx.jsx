import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheck, FaExchangeAlt, FaStar, FaMoneyBillAlt, FaBackspace } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Transaksi = () => {
  const navigate = useNavigate();
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem('currentCheckout'));
    if (!orderData) {
      navigate('/pesanan'); // Jika tidak ada order yang dipilih
      return;
    }
    setCheckoutOrder(orderData);
  }, [navigate]);

  const handleAddAmount = (value) => {
    setPaidAmount(prev => prev + value);
  };

  const handleClearAmount = () => {
    setPaidAmount(0);
  };

  const handlePaymentSuccess = () => {
    if (checkoutOrder) {
      const paidOrders = JSON.parse(localStorage.getItem('paidOrders')) || [];
      paidOrders.push({
        ...checkoutOrder,
        paidAt: new Date().toISOString(),
        paidAmount
      });
      localStorage.setItem('paidOrders', JSON.stringify(paidOrders));
      localStorage.removeItem('currentCheckout');
      navigate('/struk'); // Redirect ke halaman struk
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <button 
          className="flex items-center text-green-600 font-semibold"
          onClick={() => navigate('/pesanan')}
        >
          <FaArrowLeft className="mr-1" /> Kembali
        </button>
        <h1 className="font-semibold">Transaksi</h1>
        <button 
          className="bg-green-500 text-white px-4 py-1 rounded-full flex items-center"
          onClick={handlePaymentSuccess}
        >
          Selesai (F12) <FaCheck className="ml-2" />
        </button>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="border rounded px-3 py-1 bg-white shadow text-sm font-medium">
          TOTAL: <strong>Rp {checkoutOrder?.total?.toLocaleString('id-ID')}</strong>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 p-4 gap-6 overflow-hidden">
        {/* Kiri */}
        <div className="flex flex-col w-1/2 gap-4">
          <div className="flex gap-2">
            <button className="flex items-center border border-green-600 text-green-600 px-3 py-1 rounded-full">
              <FaStar className="mr-1" /> + 0 POIN
            </button>
            <button className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full">
              <FaExchangeAlt className="mr-1" /> Pisah Bayar
            </button>
          </div>

          <div className="text-4xl font-bold text-center text-black mt-4">
            Rp {paidAmount.toLocaleString('id-ID')}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-5 h-5" />
            <span>Piutang</span>
            <button className="border border-red-500 text-red-500 px-3 py-1 rounded-full font-medium">
              {checkoutOrder?.customer || 'Pelanggan'}
            </button>
            <input
              type="text"
              placeholder="No.Meja"
              className="border px-3 py-1 rounded w-24"
            />
          </div>

          <div className="bg-gray-300 text-gray-800 px-3 py-1 rounded">
            Keterangan
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="border border-gray-400 px-3 py-1 rounded-full text-sm">Disc : 0%</div>
            <div className="border border-gray-400 px-3 py-1 rounded-full text-sm">Tax : 0%</div>
            <div className="border border-green-600 text-green-600 px-3 py-1 rounded-full text-sm">Metode : cash</div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button 
              onClick={() => handleAddAmount(checkoutOrder?.total || 0)}
              className="bg-green-500 text-white py-3 rounded"
            >
              Uang Pas (F2)
            </button>
            <button 
              onClick={() => handleAddAmount(20000)}
              className="bg-green-500 text-white py-3 rounded"
            >
              Rp 20.000
            </button>
            <button 
              onClick={() => handleAddAmount(50000)}
              className="bg-green-500 text-white py-3 rounded"
            >
              Rp 50.000
            </button>
            <button 
              onClick={() => handleAddAmount(100000)}
              className="bg-green-500 text-white py-3 rounded"
            >
              Rp 100.000
            </button>
            <button className="bg-green-500 text-white py-3 rounded col-span-2">
              Lainnya
            </button>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-1/2 grid grid-cols-4 gap-2">
          {['7','8','9','C','4','5','6',<FaBackspace />, '1','2','3',<FaMoneyBillAlt />, '0','00','000','.'].map((val, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (val === 'C') handleClearAmount();
                else if (!isNaN(val)) setPaidAmount(prev => prev * 10 + parseInt(val));
              }}
              className="bg-gray-300 py-6 rounded text-2xl font-bold flex items-center justify-center"
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
