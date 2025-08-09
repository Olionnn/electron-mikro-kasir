import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaFilter, FaTrashAlt, FaPrint, FaPencilAlt } from 'react-icons/fa';

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
    <div onClick={onClick} className={`border-t border-gray-200 cursor-pointer ${isSelected ? 'bg-green-50' : ''}`}>
      <div className="flex items-start space-x-3 p-3">
        <input type="checkbox" checked={isSelected} readOnly className="mt-1 w-5 h-5 form-checkbox text-green-600 accent-green-600" />
        <div className="flex-grow">
          <p className="font-semibold">{order.customer}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-400">
              <p>JT: {order.jatuhTempo || '-'}</p>
              <p>Dibuat {order.author}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-green-600 font-semibold text-sm">Split</button>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700"><FaTrashAlt /></button>
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

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];
    setOrders(savedOrders);
    if (savedOrders.length > 0) {
      setSelectedOrder(savedOrders[0]);
    }
  }, []);

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('savedOrders', JSON.stringify(updatedOrders));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updatedOrders.length > 0 ? updatedOrders[0] : null);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <header className="flex items-center space-x-4 p-4 bg-white border-b border-gray-200">
        <Link to="/pos">
          <FaChevronLeft className="text-2xl text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">PESANAN</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-3/5 bg-white flex flex-col border-r border-gray-200">
          <div className="p-4">
            <div className="flex border-b border-gray-200 font-semibold mb-4">
              <div className="pb-2 px-1 border-b-2 border-green-500 text-black">Daftar Pesanan</div>
              <div className="pb-2 px-4 text-gray-400">Arsip</div>
            </div>
            <div className="flex items-center space-x-6 mb-4">
              <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked className="w-5 h-5 form-checkbox text-green-600 accent-green-600" /><span>Umum</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked className="w-5 h-5 form-checkbox text-green-600 accent-green-600" /><span>Olshopin</span></label>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center border rounded-md px-3 py-2 flex-grow">
                <FaFilter className="text-gray-400 mr-2" />
                <input type="text" placeholder="Nama" className="w-full outline-none" />
              </div>
              <input type="text" placeholder="Jatuh Tempo" className="border rounded-md px-3 py-2" />
              <button className="text-2xl text-gray-400">✕</button>
            </div>
            <div className="mb-2"><label className="flex items-center space-x-2"><input type="checkbox" className="w-5 h-5 form-checkbox" /><span>Pilih Semua</span></label></div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {orders.length > 0 ? (
              orders.map(order => (
                <OrderItem 
                  key={order.id} 
                  order={order} 
                  isSelected={selectedOrder && selectedOrder.id === order.id}
                  onClick={() => setSelectedOrder(order)}
                  onRemove={handleDeleteOrder}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">Belum ada pesanan yang disimpan.</p>
            )}
          </div>
        </div>

        <div className="w-2/5 bg-white p-6 flex flex-col justify-between">
          {selectedOrder ? (
            <>
              <div className="flex-1">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 py-3">
                    <p className="font-semibold">{index + 1}. {item.nama}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x Rp {item.hargaJual.toLocaleString('id-ID')} = Rp {(item.quantity * item.hargaJual).toLocaleString('id-ID')}</p>
                  </div>
                ))}
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between"><span>Diskon</span><span>Rp 0</span></div>
                  <div className="flex justify-between"><span>Pajak</span><span>Rp 0</span></div>
                </div>
              </div>
              

              <div className="flex space-x-3">
                <button className="flex items-center justify-center gap-2 bg-green-100 text-green-700 font-semibold py-3 rounded-md w-1/3 hover:bg-green-200 transition"><FaPrint /> Cetak</button>
                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-md w-1/3 hover:bg-gray-200 transition"><FaPencilAlt /> Edit</button>
                {/* <button className="bg-orange-500 text-white font-bold py-3 rounded-md w-1/3 hover:bg-orange-600 transition">CHECKOUT</button> */}
                <Link 
                    to="/trx" 
                    onClick={() => {
                      if (selectedOrder) {
                        localStorage.setItem('currentCheckout', JSON.stringify(selectedOrder));
                      }
                    }}
                    className="bg-orange-500 text-white font-bold py-3 rounded-md w-1/3 hover:bg-orange-600 transition text-center"
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