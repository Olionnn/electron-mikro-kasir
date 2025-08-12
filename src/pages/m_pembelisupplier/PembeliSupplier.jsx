import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

import { HiArrowsUpDown } from "react-icons/hi2";

import { FiSearch, FiMenu, FiPlus, FiFilter } from "react-icons/fi";
const PembeliSuplier = () => {
  const navigate = useNavigate();

  // Navbar (history back via navigate(-1))
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onSave = useCallback(() => alert("Simpan draft (dummy)"), []);
  const onBayar = useCallback(() => alert("Bayar (dummy)"), []);

  useNavbar(
    {
      variant: "page",
      title: "Pembelian Supplier",
      backTo: null, // gunakan history back
      actions: [
        {
          type: "button",
          title: "Simpan",
          onClick: onSave,
          label: "Simpan",
          className:
            "inline-flex items-center gap-2 border border-green-600 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50",
        },
        {
          type: "button",
          title: "Bayar",
          onClick: onBayar,
          label: "Bayar",
          className:
            "inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700",
        },
      ],
    },
    [onBack, onSave, onBayar]
  );

  // Dummy items (kiri)
  const items = useMemo(
    () => [
      { code: "Be", nama: "Beras 5KG", sisa: 5, harga: 70000 },
      { code: "Be", nama: "Beras", sisa: 9, harga: 11000 },
      { code: "Ke", nama: "Kecap", sisa: 10, harga: 4000 },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      !query
        ? items
        : items.filter((i) =>
            i.nama.toLowerCase().includes(query.trim().toLowerCase())
          ),
    [items, query]
  );

  return (
    <div className="flex h-full w-full"> {/* area konten di bawah navbar */}
      {/* Kiri: daftar barang */}
      <div className="w-[60%] border-r border-gray-200 flex flex-col p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button className="border px-4 py-2 rounded-full text-base hover:bg-gray-50">
            Semua
          </button>
          <button className="border px-4 py-2 rounded-full text-base hover:bg-gray-50">
            aenfa
          </button>

          <div className="flex-1 relative">
            <FiSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-green-500 rounded-full pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <button
            className="text-green-600 inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            title="Filter"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* List barang */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filtered.map((it) => (
            <button
              key={it.nama}
              className="flex items-center gap-4 w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition"
            >
              <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-base font-bold">
                {it.code}
              </div>
              <div>
                <p className="text-base font-semibold">{it.nama}</p>
                <p className="text-sm text-gray-600">
                  Sisa {it.sisa} • Rp {it.harga.toLocaleString("id-ID")}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Tambah barang */}
        <div className="mt-6">
          <button className="flex items-center gap-3 text-green-700 hover:text-green-900 text-base">
            <span className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <FiPlus className="text-xl" />
            </span>
            <span className="font-semibold">Tambah Barang Baru</span>
          </button>
        </div>
      </div>

      {/* Kanan: ringkasan & aksi */}
      <div className="w-[40%] flex flex-col p-6">
        {/* Header kanan */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-white text-sm px-3 py-1 rounded-full">
              Draft
            </span>
            <button className="text-sm text-red-600 border border-red-400 px-4 py-1 rounded-full hover:bg-red-50">
              Batalkan
            </button>
            <button className="text-sm border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 inline-flex items-center gap-2">
              <HiArrowsUpDown /> Nama
            </button>
          </div>
          <button className="text-sm text-green-700 font-semibold hover:underline">
            + Biaya (Ctrl+B)
          </button>
        </div>

        {/* Keranjang kosong */}
        <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 text-base flex items-center justify-center">
          Belum ada barang yang dipilih
        </div>

        {/* Footer ringkasan */}
        <div className="mt-6">
          <div className="flex items-center justify-between bg-green-600 text-white px-6 py-4 rounded-t-xl">
            <span className="text-xl font-bold">Rp 0</span>
            <button className="text-base font-bold hover:opacity-90">
              Bayar (F12)
            </button>
          </div>
          <button className="w-full border-2 border-green-600 text-green-700 py-3 rounded-b-xl hover:bg-green-50 text-base font-semibold">
            SIMPAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembeliSuplier;