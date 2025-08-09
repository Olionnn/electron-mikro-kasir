import React from 'react';

const PosItemCard = ({ item, index, onAddItem  }) => {
  const formattedId = (index + 1).toString().padStart(2, '0');
  
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(item.hargaJual);

  return (
    <div onClick={() => onAddItem(item)} className="flex items-center p-3  cursor-pointer hover:bg-gray-100 transition">
      <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center mr-4">
        <span className="font-bold text-gray-600">{formattedId}</span>
      </div>
      <div>
        <p className="font-semibold text-lg">{item.nama}</p>
        <p className="text-sm text-gray-500">
          Sisa {item.stok} - {formattedPrice}
        </p>
      </div>
    </div>
  );
};

export default PosItemCard;
