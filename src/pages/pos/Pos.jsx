'use client'
import React, {useState, useEffect, useCallback, useMemo} from "react";
import { MdOutlineRefresh, MdOutlineSearch, MdSettings } from "react-icons/md";
import { FaConciergeBell } from "react-icons/fa";
import { BsStarFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import PosItemCard from "../../component/positemcard";
import PosCartItem from "../../component/poscartitem";
import { useNavbar } from "../../hooks/useNavbar";
import { IoSearch, IoBarcode, IoReceiptOutline } from "react-icons/io5";

/* ---------------- storage helpers ---------------- */
const STORAGE_KEY_ITEMS   = "pos.barangList";
const STORAGE_KEY_CART    = "pos.cart";
const STORAGE_KEY_HISTORY = "pos.history";

const seedItems = [
  { id: 1,  nama: "Beras Ramos 5kg",   hargaJual: 72000, stok: 8,  kode:"BR5K" },
  { id: 2,  nama: "Minyak Goreng 1L",  hargaJual: 18000, stok: 24, kode:"MG1L" },
  { id: 3,  nama: "Gula Pasir 1kg",    hargaJual: 15000, stok: 15, kode:"GP1K" },
  { id: 4,  nama: "Teh Celup 25s",     hargaJual: 12000, stok: 12, kode:"TC25" },
  { id: 5,  nama: "Kopi Bubuk 200g",   hargaJual: 25000, stok: 9,  kode:"KB20" },
  { id: 6,  nama: "Susu UHT 1L",       hargaJual: 21000, stok: 14, kode:"SU1L" },
  { id: 7,  nama: "Air Mineral 600ml", hargaJual: 4000,  stok: 48, kode:"AM60" },
  { id: 8,  nama: "Indomie Goreng",    hargaJual: 3500,  stok: 120,kode:"IMGR" },
  { id: 9,  nama: "Sabun Mandi Batang",hargaJual: 6000,  stok: 30, kode:"SMBT" },
  { id: 10, nama: "Shampoo Sachet",    hargaJual: 3000,  stok: 70, kode:"SHSC" },
];

const seedHistory = [
  {
    id: "TRX-20250813-001",
    code: "TRX-20250813-001",
    date: "2025-08-13 10:22:31",
    customer: "Umum",
    items: [
      { id: 2, nama: "Minyak Goreng 1L", hargaJual: 18000, quantity: 2, diskonRp: 0, diskonPct: 0, note: "" },
      { id: 8, nama: "Indomie Goreng", hargaJual: 3500, quantity: 5, diskonRp: 0, diskonPct: 10, note: "Promo mie" },
    ],
  },
  {
    id: "TRX-20250812-004",
    code: "TRX-20250812-004",
    date: "2025-08-12 20:04:11",
    customer: "Andi",
    items: [
      { id: 1, nama: "Beras Ramos 5kg", hargaJual: 72000, quantity: 1, diskonRp: 2000, diskonPct: 0, note: "" },
      { id: 7, nama: "Air Mineral 600ml", hargaJual: 4000, quantity: 6, diskonRp: 0, diskonPct: 0, note: "" },
    ],
  },
];

const loadItems = () => {
  const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(seedItems));
  return seedItems;
};
const saveItems = (arr) => localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(arr));

const loadCart = () => {
  const raw = localStorage.getItem(STORAGE_KEY_CART);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
};
const saveCart = (cart) => localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));

const loadHistory = () => {
  const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(seedHistory));
  return seedHistory;
};
const saveHistory = (h) => localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(h));
/* ------------------------------------------------- */

const Pos = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState(() => loadItems());
  const [history, setHistory] = useState(() => loadHistory());

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [cart, setCart] = useState(() => loadCart());
  const [selectedIcon, setSelectedIcon] = useState("search");

  // transaksi yg sedang diedit (jika load dari receipt)
  const [currentTrxCode, setCurrentTrxCode] = useState("TRX-NEW");
  const [editingTrxId, setEditingTrxId] = useState(null); // jika null = transaksi baru

  // Modal edit cart item
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null); // { id, nama, hargaJual, quantity, diskonRp, diskonPct, note }

  // total
  const totalPrice = useMemo(
    () =>
      cart.reduce((sum, it) => {
        const base = (it.hargaJualOverride ?? it.hargaJual) * it.quantity;
        const discPct = it.diskonPct ? (base * it.diskonPct) / 100 : 0;
        const discRp  = it.diskonRp || 0;
        return sum + Math.max(0, base - discPct - discRp);
      }, 0),
    [cart]
  );

  // debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // persist cart tiap berubah
  useEffect(() => { saveCart(cart); }, [cart]);

  // Navbar
  const onCancel = useCallback(() => {
    // kosongkan keranjang + reset editing
    setCart([]);
    saveCart([]);
    setCurrentTrxCode("TRX-NEW");
    setEditingTrxId(null);
  }, []);

  useNavbar(
    {
      variant: "pos",
      title: "Transaksi",
      actions: [
        {
          type: "link",
          to: "/pesanan",
          title: "Pesanan",
          className: "bg-orange-400 text-white rounded-full w-12 h-12",
          icon: <FaConciergeBell size={22} />,
        },
        {
          type: "button",
          title: "Favorit",
          onClick: () => console.log("favorit"),
          className: "bg-green-600 text-white rounded-full w-12 h-12",
          icon: <BsStarFill size={18} />,
        },
        {
          type: "button",
          title: "Batalkan",
          onClick: onCancel,
          label: "Batalkan",
          className:
            "border border-red-500 text-red-500 px-6 py-2 rounded-full font-semibold text-lg",
        },
        {
          type: "button",
          title: "Pengaturan",
          onClick: () => navigate("/pengaturan/pos"),
          className: "rounded-full w-12 h-12 text-gray-700 hover:bg-gray-100",
          icon: <MdSettings size={22} />,
        },
      ],
    },
    [onCancel, navigate]
  );

  // Icon kiri input
  const renderSelectedIcon = () => {
    switch (selectedIcon) {
      case "search":
        return <IoSearch size={30} className="text-gray-500" />;
      case "barcode":
        return <IoBarcode size={30} className="text-gray-500" />;
      case "receipt":
        return <IoReceiptOutline size={30} className="text-gray-500" />;
      default:
        return <MdOutlineSearch size={30} className="text-gray-500" />;
    }
  };

  // Filter items atau history sesuai mode
  const filteredItems = useMemo(() => {
    if (selectedIcon !== "search") return items;
    if (!debounced.trim()) return items;
    const q = debounced.toLowerCase();
    return items.filter(
      (i) =>
        i.nama.toLowerCase().includes(q) ||
        (i.kode || "").toLowerCase().includes(q)
    );
  }, [items, debounced, selectedIcon]);

  const filteredHistory = useMemo(() => {
    if (selectedIcon !== "receipt") return history;
    if (!debounced.trim()) return history;
    const q = debounced.toLowerCase();
    return history.filter(
      (h) =>
        h.id.toLowerCase().includes(q) ||
        (h.code || "").toLowerCase().includes(q) ||
        (h.customer || "").toLowerCase().includes(q)
    );
  }, [history, debounced, selectedIcon]);

  // Actions
  const handleRefresh = useCallback(() => {
    setItems(loadItems());
  }, []);

  const handleAddItemToCart = (itemToAdd) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === itemToAdd.id);
      if (exist) {
        if (exist.quantity < itemToAdd.stok) {
          return prev.map((p) =>
            p.id === itemToAdd.id ? { ...p, quantity: p.quantity + 1 } : p
          );
        }
        return prev; // stok habis
      }
      if (itemToAdd.stok > 0) {
        return [...prev, { ...itemToAdd, quantity: 1, diskonRp: 0, diskonPct: 0, note: "" }];
      }
      return prev;
    });
  };

  const handleRemoveItemFromCart = (itemIdToRemove) => {
    setCart((prev) => prev.filter((p) => p.id !== itemIdToRemove));
  };

  const openEditItem = (it) => {
    setEditRow({
      id: it.id,
      nama: it.nama,
      hargaJual: it.hargaJual,
      hargaJualOverride: it.hargaJualOverride ?? it.hargaJual,
      quantity: it.quantity,
      diskonRp: it.diskonRp || 0,
      diskonPct: it.diskonPct || 0,
      note: it.note || "",
      stok: it.stok ?? 9999,
    });
    setEditOpen(true);
  };

  const applyEditItem = () => {
    if (!editRow) return;
    setCart((prev) =>
      prev.map((p) =>
        p.id === editRow.id
          ? {
              ...p,
              quantity: Math.max(1, parseInt(editRow.quantity || 1, 10)),
              hargaJualOverride: Math.max(0, parseInt(editRow.hargaJualOverride || 0, 10)),
              diskonRp: Math.max(0, parseInt(editRow.diskonRp || 0, 10)),
              diskonPct: Math.max(0, Math.min(100, parseInt(editRow.diskonPct || 0, 10))),
              note: editRow.note || "",
            }
          : p
      )
    );
    setEditOpen(false);
  };

  // Load transaksi dari history (receipt mode) → muat ke cart dan izinkan edit
  const loadHistoryToCart = (trx) => {
    setCart(
      trx.items.map((it) => ({
        ...it,
        hargaJualOverride: it.hargaJual, // bisa diedit
      }))
    );
    setCurrentTrxCode(trx.code || trx.id);
    setEditingTrxId(trx.id);
  };

  const handleSimpanPesananClick = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    navigate("/pesanan/tambah", {
      state: { cartItems: cart, totalPrice, currentTrxCode, editingTrxId },
    });
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    const orderData = {
      id: editingTrxId || Date.now(), // kalau sedang edit, pakai ID lama
      code: currentTrxCode,
      customer: "Umum",
      items: cart,
      total: totalPrice,
    };
    localStorage.setItem("currentCheckout", JSON.stringify(orderData));
    navigate("/trx");
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(v);

  return (
    <div className="flex h-full">
      {/* LEFT */}
      <div className="w-3/5 border-2 border-gray-100 bg-white p-8 flex flex-col gap-6 overflow-y-auto">
        {/* top tools */}
        <div className="flex items-center gap-4">
          <button
            className={`p-3 rounded-full ${
              selectedIcon === "search" ? "bg-green-600 text-white" : "bg-white text-black"
            }`}
            title="Cari"
            onClick={() => setSelectedIcon("search")}
          >
            <IoSearch size={20} />
          </button>

          <button
            className={`p-3 rounded-full ${
              selectedIcon === "barcode" ? "bg-green-600 text-white" : "bg-white text-black"
            }`}
            title="Barcode"
            onClick={() => setSelectedIcon("barcode")}
          >
            <IoBarcode size={20} />
          </button>

          <button
            className={`p-3 rounded-full ${
              selectedIcon === "receipt" ? "bg-green-600 text-white" : "bg-white text-black"
            }`}
            title="Receipt"
            onClick={() => setSelectedIcon("receipt")}
          >
            <IoReceiptOutline size={20} />
          </button>

          <div className="flex items-center flex-1 border px-6 py-3 rounded-full text-lg">
            {renderSelectedIcon()}
            <input
              type="text"
              placeholder={
                selectedIcon === "receipt" ? "Cari Kode/Customer Transaksi..." : "Cari Barang / Kode"
              }
              className="flex-1 outline-none ml-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="flex gap-3 text-2xl items-center" onClick={handleRefresh}>
            Refresh <MdOutlineRefresh size={30} />
          </button>
        </div>

        <div className="flex gap-4">
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">Semua</button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">+ Ctrl + T</button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">📋 Ctrl + J</button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">🖨 Ctrl + P</button>
        </div>

        {/* list */}
        {selectedIcon === "receipt" ? (
          <div className="flex flex-col gap-2">
            {filteredHistory.map((trx) => {
              const sum = trx.items.reduce((s, it) => s + it.hargaJual * it.quantity, 0);
              return (
                <button
                  key={trx.id}
                  onClick={() => loadHistoryToCart(trx)}
                  className="w-full text-left px-3 py-3 rounded-lg border hover:bg-gray-50"
                  title="Muat transaksi ini"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{trx.code}</div>
                    <div className="text-sm text-gray-500">{trx.date}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {trx.customer} • {trx.items.length} item • Rp {formatCurrency(sum)}
                  </div>
                </button>
              );
            })}
            {filteredHistory.length === 0 && (
              <div className="text-gray-400 text-sm">Tidak ada riwayat</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredItems.map((item, index) => (
              <PosItemCard
                key={item.id}
                item={item}
                index={index}
                onAddItem={handleAddItemToCart}
              />
            ))}
            <Link
              to="/barang/tambah"
              className="flex items-center text-left px-3 py-3 rounded-lg w-fit text-green-600 text-xl"
            >
              <span className="text-3xl mr-3 bg-green-50 rounded-lg w-12 h-12 p-1 text-center">+</span>
              Tambah Barang Baru
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT: cart */}
      <div className="w-2/5 bg-white border-2 border-gray-100 flex flex-col justify-between">
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Header kecil */}
          <div className="flex items-center justify-between border-b pb-4 text-lg">
            <div className="flex gap-6">
              <span>Diskon : %</span>
              <span>Pajak : %</span>
            </div>
            {/* trx-code */}
            <div className="text-sm text-gray-600">
              Kode: <span className="font-semibold">{currentTrxCode}</span>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="mt-6 text-gray-400 text-xl">(daftar item muncul di sini)</div>
          ) : (
            <div className="mt-4 space-y-2">
              {cart.map((cartItem, index) => (
                <div key={cartItem.id} onClick={() => openEditItem(cartItem)}>
                  <PosCartItem
                    item={cartItem}
                    index={index}
                    onRemove={handleRemoveItemFromCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-1 bg-gray-100 w-full">
          <div className="flex items-center justify-between gap-2 text-lg w-full bg-white">
            <div className="w-1/2 p-3">
              <button className="flex gap-3">
                <span>Potensi Untung</span>
                <HiOutlineQuestionMarkCircle size={30} />
              </button>
            </div>

            <button className="w-1/2 h-[70px] bg-teal-100 text-teal-800 px-3 border border-teal-600 text-lg">
              Lihat Promosi
            </button>
          </div>

          <div className="flex gap-10 items-center p-5">
            <button
              onClick={handleSimpanPesananClick}
              className="w-2xl bg-white border border-green-600 text-green-600 px-8 py-3 rounded text-lg"
            >
              Simpan Pesanan
            </button>
            <button
              onClick={handleCheckoutClick}
              className="w-2xl bg-green-600 text-white px-8 py-3 rounded text-lg"
            >
              Rp.{formatCurrency(totalPrice)} Bayar
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editOpen && editRow && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Edit Item</div>
              <button
                onClick={() => setEditOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-500">{editRow.nama}</div>

              <label className="grid gap-1">
                <span className="text-sm">Jumlah</span>
                <input
                  type="number"
                  min={1}
                  max={editRow.stok}
                  value={editRow.quantity}
                  onChange={(e) => setEditRow((r) => ({ ...r, quantity: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm">Harga (override)</span>
                <input
                  type="number"
                  min={0}
                  value={editRow.hargaJualOverride}
                  onChange={(e) => setEditRow((r) => ({ ...r, hargaJualOverride: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                />
                <div className="text-xs text-gray-500">
                  Harga asli: Rp {new Intl.NumberFormat("id-ID").format(editRow.hargaJual)}
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-sm">Diskon (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editRow.diskonPct}
                    onChange={(e) => setEditRow((r) => ({ ...r, diskonPct: e.target.value }))}
                    className="border rounded-lg px-3 py-2"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Diskon (Rp)</span>
                  <input
                    type="number"
                    min={0}
                    value={editRow.diskonRp}
                    onChange={(e) => setEditRow((r) => ({ ...r, diskonRp: e.target.value }))}
                    className="border rounded-lg px-3 py-2"
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-sm">Catatan</span>
                <input
                  type="text"
                  value={editRow.note}
                  onChange={(e) => setEditRow((r) => ({ ...r, note: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                  placeholder="Catatan singkat…"
                />
              </label>

              {/* preview total baris */}
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                {(() => {
                  const qty = Math.max(1, parseInt(editRow.quantity || 1, 10));
                  const price = Math.max(0, parseInt(editRow.hargaJualOverride || 0, 10));
                  const base = qty * price;
                  const dPct = Math.max(0, Math.min(100, parseInt(editRow.diskonPct || 0, 10)));
                  const dRp  = Math.max(0, parseInt(editRow.diskonRp || 0, 10));
                  const after = Math.max(0, base - (base * dPct) / 100 - dRp);
                  return (
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        Rp {new Intl.NumberFormat("id-ID").format(after)}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button className="px-4 py-2 rounded-lg border" onClick={() => setEditOpen(false)}>
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={applyEditItem}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pos;
