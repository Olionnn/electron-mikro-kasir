import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const PosCartItem = ({ item, index, onRemove }) => {
  const initials = item.nama.substring(0, 2).toUpperCase();
  
  const formattedIndex = (index + 1).toString().padStart(2, '0');

  const formatCurrency = (value) => 
    new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(value);

  const lineTotal = item.hargaJual * item.quantity;

  return (
    <div className="flex items-center py-3">
      <span className="font-semibold text-gray-500 mr-3">{formattedIndex}</span>
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
        <span className="font-bold text-gray-600">{initials}</span>
      </div>
      <div className="flex-1">
        <p className="font-bold text-lg">{item.nama}</p>
        <p className="text-sm text-gray-500">
          {item.quantity} x Rp.{formatCurrency(item.hargaJual)} = {formatCurrency(lineTotal)}
        </p>
      </div>
      <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
        <FaTrashAlt size={20} />
      </button>
    </div>
  );
};

export default PosCartItem;