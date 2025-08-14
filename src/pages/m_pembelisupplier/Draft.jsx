import React, { useCallback } from "react";
import {
  MdSearch,
  MdArrowBack,
  MdDelete,
  MdShare,
  MdPrint,
  MdEdit,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar"; // sesuaikan path hook-mu

export default function DraftPembelianPage() {
  const navigate = useNavigate();

  /* -------- Handlers utk Navbar -------- */
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onShare = useCallback(() => {
    // aksi share (dummy)
    alert("Bagikan draft pembelian (dummy)");
  }, []);
  const onPrint = useCallback(() => {
    // aksi print (dummy)
    window.print();
  }, []);
  const onEdit = useCallback(() => {
    // aksi edit (dummy)
    alert("Edit draft (dummy)");
  }, []);

  // Terapkan konfigurasi navbar saat mount
  useNavbar(
    {
      variant: "page",
      title: "Draft Pembelian",
      backTo: onBack, // gunakan history back
      actions: [
        {
          type: "button",
          title: "Bagikan",
          onClick: onShare,
          className:
            "w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-green-600",
          icon: <MdShare className="text-xl" />,
        },
        {
          type: "button",
          title: "Cetak",
          onClick: onPrint,
          className:
            "w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-green-600",
          icon: <MdPrint className="text-xl" />,
        },
        {
          type: "button",
          title: "Edit",
          onClick: onEdit,
          className:
            "w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-green-600",
          icon: <MdEdit className="text-xl" />,
        },
      ],
      rightExtra: null,
    },
    [onBack, onShare, onPrint, onEdit]
  );

  return (
    <div className="w-full h-full flex overflow-hidden bg-white">
      {/* Panel Kiri */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">


        {/* Search & Filter */}
        <div className="flex items-center px-4 py-2 gap-2 border-b border-gray-100">
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden">
            <MdSearch className="mx-2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari Pembelian / Supplier"
              className="w-full py-2 text-sm outline-none"
            />
          </div>
        </div>

        {/* Pilih Semua */}
        <label className="flex items-center px-4 py-3 gap-2 text-sm">
          <input type="checkbox" className="w-4 h-4" />
          Pilih Semua
        </label>

        {/* List Draft */}
        <div className="px-4 pb-4 overflow-y-auto">
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm border flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-green-500" />
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Baru
              </span>
              <span className="ml-auto text-xs flex items-center gap-1 text-green-600">
                Open <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </span>
            </div>
            <div className="text-sm text-gray-800">Suo</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              12 Aug 2025
            </div>
            <div className="text-xs text-gray-500">1 Item · Rp 1.000</div>
            <div className="text-xs text-gray-500 ml-auto">J/T: 12 Aug 2025</div>
          </div>
        </div>
      </div>

      {/* Panel Kanan */}
      <div className="w-1/2 flex flex-col relative">
       

        {/* Detail List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center text-sm font-medium border-b pb-2 mb-4">
            <span>Total Awal PO:</span>
            <span>Rp 1.000</span>
          </div>

          <div className="text-sm">
            <div className="font-medium">1. Ik</div>
            <div className="text-gray-600">1 x Rp 1.000 = Rp 1.000</div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex items-center gap-2">
          <button className="p-3 rounded-full bg-green-100" onClick={onShare} title="Bagikan">
            <MdShare className="text-green-600 text-xl" />
          </button>
          <button className="p-3 rounded-full bg-green-100" onClick={onPrint} title="Cetak">
            <MdPrint className="text-green-600 text-xl" />
          </button>
          <button className="p-3 rounded-full bg-green-100" onClick={onEdit} title="Edit">
            <MdEdit className="text-green-600 text-xl" />
          </button>
          <button className="flex-1 bg-green-600 text-white py-3 rounded-full font-medium">
            BAYAR SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
}