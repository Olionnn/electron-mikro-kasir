import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaTrashAlt, FaPrint, FaPencilAlt } from 'react-icons/fa';
import { useNavbar } from '../../hooks/useNavbar';

const OrderItem = ({ order, isSelected, onClick, onRemove }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan "${order.customer}"?`)) {
      onRemove(order.id);
    }
  };

  const formattedDate = new Date(order.date).toLocaleString('id-ID', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div
      onClick={onClick}
      className={`border-t border-gray-200 cursor-pointer transition-colors ${
        isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="mt-1 w-5 h-5 form-checkbox text-violet-600 accent-violet-600"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{order.customer}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-400 leading-5">
              <p>JT: {order.jatuhTempo || '-'}</p>
              <p>Dibuat {order.author}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button className="text-violet-600 font-semibold text-sm hover:underline">
                Split
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600"
                title="Hapus"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pesanan = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pasang NAVBAR: back ke /pos, judul "Pesanan"
  useNavbar(
    { variant: 'page', title: 'Pesanan', backTo: '/pos', actions: [] },
    []
  );

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];
    setOrders(savedOrders);
    if (savedOrders.length > 0) {
      setSelectedOrder(savedOrders[0]);
    }
  }, []);

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('savedOrders', JSON.stringify(updatedOrders));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updatedOrders.length > 0 ? updatedOrders[0] : null);
    }
  };

  return (
    <div className="h-full w-screen bg-gray-100 flex flex-col">
      {/* Header dihapus, karena sudah digantikan Navbar global */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left list */}
        <div className="w-3/5 bg-white flex flex-col border-r border-gray-200">
          {/* Toolbar */}
          <div className="p-4">
            <div className="flex border-b border-gray-200 font-semibold mb-4">
              <div className="pb-2 px-1 border-b-2 border-violet-500 text-gray-900">
                Daftar Pesanan
              </div>
              <div className="pb-2 px-4 text-gray-400">Arsip</div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 form-checkbox text-violet-600 accent-violet-600"
                />
                <span>Umum</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 form-checkbox text-violet-600 accent-violet-600"
                />
                <span>Olshopin</span>
              </label>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center border rounded-md px-3 py-2 flex-1 focus-within:ring-2 focus-within:ring-violet-500">
                <FaFilter className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Nama"
                  className="w-full outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Jatuh Tempo"
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
              <button
                className="text-2xl text-gray-400 hover:text-gray-500 px-2 rounded-md hover:bg-gray-100"
                title="Bersihkan filter"
              >
                ✕
              </button>
            </div>

            <div className="mb-1">
              <label className="flex items-center gap-2 text-sm text-violet-700">
                <input type="checkbox" className="w-5 h-5 form-checkbox" />
                <span>Pilih Semua</span>
              </label>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto">
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  isSelected={selectedOrder && selectedOrder.id === order.id}
                  onClick={() => setSelectedOrder(order)}
                  onRemove={handleDeleteOrder}
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Belum ada pesanan yang disimpan.
              </div>
            )}
          </div>
        </div>

        {/* Right detail */}
        <div className="w-2/5 bg-white p-6 flex flex-col justify-between">
          {selectedOrder ? (
            <>
              <div className="flex-1 min-h-0">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Rincian Pesanan</h2>
                  <p className="text-sm text-gray-500">{selectedOrder.customer}</p>
                </div>

                <div className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="py-3">
                      <p className="font-medium">
                        {index + 1}. {item.nama}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x Rp {item.hargaJual.toLocaleString('id-ID')} ={' '}
                        <span className="text-gray-700 font-medium">
                          Rp {(item.quantity * item.hargaJual).toLocaleString('id-ID')}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diskon</span>
                    <span className="font-medium">Rp 0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pajak</span>
                    <span className="font-medium">Rp 0</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t pt-3">
                    <span>Total</span>
                    <span>
                      Rp {selectedOrder.total?.toLocaleString('id-ID') ?? '0'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex items-center justify-center gap-2 bg-violet-100 text-violet-700 font-semibold py-3 rounded-md w-1/3 hover:bg-green-200 transition">
                  <FaPrint /> Cetak
                </button>
                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-md w-1/3 hover:bg-gray-200 transition">
                  <FaPencilAlt /> Edit
                </button>
                <Link
                  to="/trx"
                  onClick={() => {
                    if (selectedOrder) {
                      localStorage.setItem('currentCheckout', JSON.stringify(selectedOrder));
                    }
                  }}
                  className="bg-orange-500 text-white font-bold py-3 rounded-md w-1/3 text-center hover:bg-orange-600 transition"
                >
                  CHECKOUT
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Pilih pesanan untuk melihat rincian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pesanan;