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
import { IoSearch } from "react-icons/io5";

/* ---------------- storage helpers ---------------- */
const STORAGE_KEY_ITEMS = "pos.barangList";
const STORAGE_KEY_CART  = "pos.cart";

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

const loadItems = () => {
  const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(seedItems));
  return seedItems;
};

const saveItems = (arr) => {
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(arr));
};

const loadCart = () => {
  const raw = localStorage.getItem(STORAGE_KEY_CART);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
};

const saveCart = (cart) => {
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
};
/* ------------------------------------------------- */

const Pos = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState(() => loadItems());
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [cart, setCart] = useState(() => loadCart());
  const totalPrice = useMemo(
    () => cart.reduce((sum, it) => sum + (it.hargaJual * it.quantity), 0),
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
  const onCancel = useCallback(() => navigate(-1), [navigate]);

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

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!debounced.trim()) return items;
    const q = debounced.toLowerCase();
    return items.filter(
      (i) =>
        i.nama.toLowerCase().includes(q) ||
        (i.kode || "").toLowerCase().includes(q)
    );
  }, [items, debounced]);

  // Actions
  const handleRefresh = useCallback(() => {
    // reload dari storage (kalau mau reset ke seed, uncomment 2 baris di bawah)
    // localStorage.removeItem(STORAGE_KEY_ITEMS);
    // setItems(loadItems());

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
        return [...prev, { ...itemToAdd, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleRemoveItemFromCart = (itemIdToRemove) => {
    setCart((prev) => prev.filter((p) => p.id !== itemIdToRemove));
  };

  const handleSimpanPesananClick = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    navigate("/pesanan/tambah", {
      state: { cartItems: cart, totalPrice },
    });
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    const orderData = {
      id: Date.now(),
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
      {/* LEFT: items */}
      <div className="w-3/5 border-2 border-gray-100 bg-white p-8 flex flex-col gap-6 overflow-y-auto">
        {/* top tools */}
        <div className="flex items-center gap-4">
          <button className="bg-green-600 text-white p-3 rounded-full" title="Cari">
            <IoSearch />
          </button>
          <button className="bg-white text-black p-3 rounded-full" title="Cari">
            
          </button>
          <button className="bg-white text-black p-3 rounded-full" title="Cari">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
              <path fill="currentColor" d="m15.7 14.3l-4.2-4.2c-.2-.2-.5-.3-.8-.3c.8-1 1.3-2.4 1.3-3.8c0-3.3-2.7-6-6-6S0 2.7 0 6s2.7 6 6 6c1.4 0 2.8-.5 3.8-1.4c0 .3 0 .6.3.8l4.2 4.2c.2.2.5.3.7.3s.5-.1.7-.3c.4-.3.4-.9 0-1.3zM6 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5s4.5 2 4.5 4.5s-2 4.5-4.5 4.5z"/>
            </svg>
          </button>

          <div className="flex items-center flex-1 border px-6 py-3 rounded-full text-lg">
            <MdOutlineSearch size={30} />
            <input
              type="text"
              placeholder="Cari Barang / Kode"
              className="flex-1 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="flex gap-3 text-2xl" onClick={handleRefresh}>
            Refresh <MdOutlineRefresh size={30} />
          </button>
        </div>

        <div className="flex gap-4">
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">Semua</button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">+ Ctrl + T</button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">📋 Ctrl + J</button>
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">🖨 Ctrl + P</button>
        </div>

        {/* list items */}
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
      </div>

      {/* RIGHT: cart */}
      <div className="w-2/5 bg-white border-2 border-gray-100 flex flex-col justify-between">
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex gap-10 border-b pb-4 text-lg">
            <span>Diskon : %</span>
            <span>Pajak : %</span>
          </div>

          {cart.length === 0 ? (
            <div className="mt-6 text-gray-400 text-xl">(daftar item muncul di sini)</div>
          ) : (
            <div className="mt-4">
              {cart.map((cartItem, index) => (
                <PosCartItem
                  key={cartItem.id}
                  item={cartItem}
                  index={index}
                  onRemove={handleRemoveItemFromCart}
                />
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
    </div>
  );
};

export default Pos;