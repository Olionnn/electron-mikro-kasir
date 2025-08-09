import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPrint, FaPencilAlt, FaChevronLeft } from 'react-icons/fa';

const Review = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lastOrderId = localStorage.getItem('lastSavedOrderId');
    if (!lastOrderId) {
      navigate('/pos');
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];
    const orderToReview = savedOrders.find(o => o.id === parseInt(lastOrderId));

    if (orderToReview) {
      setOrder(orderToReview);
    } else {
      alert("Pesanan tidak ditemukan.");
      navigate('/pos');
    }
  }, [navigate]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  const handleCheckout = () => {
    if (!order) return;
    // Simpan order ini ke localStorage untuk transaksi
    localStorage.setItem('currentCheckout', JSON.stringify(order));
    // Arahkan ke halaman transaksi
    navigate('/trx');
  };

  if (!order) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-2xl">Memuat data pesanan...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans">
      {/* Kiri */}
      <div className="w-1/2 bg-white flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <Link to="/pos" className="text-2xl text-gray-700 hover:text-black">
                <FaChevronLeft />
              </Link>
              <h2 className="font-semibold text-xl">REVIEW</h2>
            </div>
            <h3 className="font-semibold text-xl">{formatCurrency(order.total)}</h3>
          </div>

          {/* Items */}
          <div className="px-6 py-4 border-b">
            {order.items.map((item, index) => (
              <div key={item.id} className="mb-3">
                <p className="font-bold text-base">
                  {index + 1} {item.nama}
                </p>
                <p className="text-sm text-gray-600 ml-4">
                  {item.quantity} x {formatCurrency(item.hargaJual)} = {formatCurrency(item.quantity * item.hargaJual)}
                </p>
              </div>
            ))}
          </div>

          {/* Diskon & Pajak */}
          <div className="px-6 py-4 space-y-2 text-base">
            <div className="flex justify-between">
              <span>Diskon</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak</span>
              <span>Rp 0</span>
            </div>
          </div>
        </div>

        {/* Tombol */}
        <div className="flex justify-between px-6 py-6 space-x-4 border-t">
          <button className="flex items-center justify-center w-1/3 bg-green-100 text-green-700 py-2 rounded-full hover:bg-green-200 transition text-sm font-medium">
            <FaPrint className="mr-2" /> Cetak
          </button>
          <button className="flex items-center justify-center w-1/3 bg-green-200 text-green-800 py-2 rounded-full hover:bg-green-300 transition text-sm font-medium">
            <FaPencilAlt className="mr-2" /> Edit
          </button>
          <button
            onClick={handleCheckout}
            className="w-1/3 bg-orange-500 text-white py-2 rounded-full font-bold hover:bg-orange-600 transition text-sm"
          >
            CHECKOUT
          </button>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 bg-gray-50"></div>
    </div>
  );
};

export default Review;
