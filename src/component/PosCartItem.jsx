import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";

const PosCartItem = ({ item, index, onRemove, openEditItem, onQtyChange }) => {
  const initials = (item?.nama || "").substring(0, 2).toUpperCase();
  const formattedIndex = String((index ?? 0) + 1).padStart(2, "0");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(
      Number(value || 0)
    );

  const handleDec = (e) => {
    e.stopPropagation();
    if (!onQtyChange) return;
    const next = Math.max(1, Number(item.quantity || 1) - 1);
    onQtyChange(item.id, next);
  };

  const handleInc = (e) => {
    e.stopPropagation();
    if (!onQtyChange) return;
    const next = Number(item.quantity || 1) + 1;
    onQtyChange(item.id, next);
  };

  const handleInput = (e) => {
    e.stopPropagation();
    if (!onQtyChange) return;
    const raw = e.target.value.replace(/[^\d]/g, "");
    const val = Math.max(1, Number(raw || 1));
    onQtyChange(item.id, val);
  };

  const preventWheel = (e) => e.currentTarget.blur();

  const lineTotal = Number(item.hargaJual || 0) * Number(item.quantity || 0);

  return (
    <div className="grid grid-cols-12 w-full items-center border-b border-gray-200 last:border-b-0">
      {/* Kiri: Index, Avatar, Nama + Harga */}
      <div
        className="flex col-span-8 items-center py-3 w-full cursor-pointer"
        onClick={() => openEditItem?.(item)}
      >
        <span className="font-semibold text-gray-500 mr-3">{formattedIndex}</span>

        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 shadow-sm">
          <span className="font-bold text-gray-700">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg text-gray-800 truncate">{item.nama}</p>
          <p className="text-sm text-gray-500">
            {formatCurrency(item.quantity)} x Rp.{formatCurrency(item.hargaJual)} ={" "}
            <span className="font-semibold text-gray-700">
              Rp.{formatCurrency(lineTotal)}
            </span>
          </p>
        </div>
      </div>

      {/* Tengah: Kontrol Qty */}
      <div
        className="col-span-3 flex justify-end items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDec}
          className="px-2 py-1 text-green-700 hover:bg-green-50 border border-green-300 rounded-l-lg disabled:opacity-50"
          disabled={Number(item.quantity || 1) <= 1}
        >
          <FiMinus />
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={item.quantity ?? 1}
          onChange={handleInput}
          onWheel={preventWheel}
          className="w-12 text-center border-t border-b border-green-300 outline-none"
        />

        <button
          type="button"
          onClick={handleInc}
          className="px-2 py-1 text-green-700 hover:bg-green-50 border border-green-300 rounded-r-lg"
        >
          <FiPlus />
        </button>
      </div>

      {/* Kanan: Tombol hapus */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(item.id);
        }}
        className="text-red-500 hover:text-red-700 transition-colors duration-200 col-span-1 flex justify-center"
        aria-label="Remove item"
        title="Hapus"
      >
        <FaTrashAlt size={20} />
      </button>
    </div>
  );
};

export default PosCartItem;