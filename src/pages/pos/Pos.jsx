"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MdOutlineRefresh, MdOutlineSearch, MdSettings } from "react-icons/md";
import { FaConciergeBell } from "react-icons/fa";
import { BsStarFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import PosItemCard from "../../component/positemcard";
import PosCartItem from "../../component/poscartitem";
import { useNavbar } from "../../hooks/useNavbar";
import { IoSearch, IoBarcode, IoReceiptOutline } from "react-icons/io5";
import Modal from "../../component/Modal";

/* ---------------- storage helpers ---------------- */
const STORAGE_KEY_ITEMS = "pos.barangList";
const STORAGE_KEY_CART = "pos.cart";
const STORAGE_KEY_HISTORY = "pos.history";
const STORAGE_KEY_DISCOUNTS = "pos.discounts";
const STORAGE_KEY_TAXDEF = "pos.taxDefault";
const COSTS_KEY = "pos.costs";

const seedItems = [
  {
    id: 1,
    nama: "Beras Ramos 5kg",
    hargaDasar: 70000,
    hargaJual: 72000,
    stok: 8,
    kode: "BR5K",
  },
  {
    id: 2,
    nama: "Minyak Goreng 1L",
    hargaDasar: 15000,
    hargaJual: 18000,
    stok: 24,
    kode: "MG1L",
  },
  {
    id: 3,
    nama: "Gula Pasir 1kg",
    hargaDasar: 12000,
    hargaJual: 15000,
    stok: 15,
    kode: "GP1K",
  },
  {
    id: 4,
    nama: "Teh Celup 25s",
    hargaDasar: 10000,
    hargaJual: 12000,
    stok: 12,
    kode: "TC25",
  },
  {
    id: 5,
    nama: "Kopi Bubuk 200g",
    hargaDasar: 20000,
    hargaJual: 25000,
    stok: 9,
    kode: "KB20",
  },
  {
    id: 6,
    nama: "Susu UHT 1L",
    hargaDasar: 20000,
    hargaJual: 21000,
    stok: 14,
    kode: "SU1L",
  },
  {
    id: 7,
    nama: "Air Mineral 600ml",
    hargaDasar: 2000,
    hargaJual: 4000,
    stok: 48,
    kode: "AM60",
  },
  {
    id: 8,
    nama: "Indomie Goreng",
    hargaDasar: 2000,
    hargaJual: 3500,
    stok: 120,
    kode: "IMGR",
  },
  {
    id: 9,
    nama: "Sabun Mandi Batang",
    hargaJual: 6000,
    stok: 30,
    kode: "SMBT",
  },
  { id: 10, nama: "Shampoo Sachet", hargaJual: 3000, stok: 70, kode: "SHSC" },
];

const seedHistory = [
  {
    id: "TRX-20250813-001",
    code: "TRX-20250813-001",
    date: "2025-08-13 10:22:31",
    customer: "Umum",
    items: [
      {
        id: 2,
        nama: "Minyak Goreng 1L",
        hargaJual: 18000,
        quantity: 2,
        diskonRp: 0,
        diskonPct: 0,
        note: "",
      },
      {
        id: 8,
        nama: "Indomie Goreng",
        hargaJual: 3500,
        quantity: 5,
        diskonRp: 0,
        diskonPct: 10,
        note: "Promo mie",
      },
    ],
  },
  {
    id: "TRX-20250812-004",
    code: "TRX-20250812-004",
    date: "2025-08-12 20:04:11",
    customer: "Andi",
    items: [
      {
        id: 1,
        nama: "Beras Ramos 5kg",
        hargaJual: 72000,
        quantity: 1,
        diskonRp: 2000,
        diskonPct: 0,
        note: "",
      },
      {
        id: 7,
        nama: "Air Mineral 600ml",
        hargaJual: 4000,
        quantity: 6,
        diskonRp: 0,
        diskonPct: 0,
        note: "",
      },
    ],
  },
];

const seedDiscounts = [
  { id: "DISC10", name: "Diskon 10%", type: "pct", value: 10 },
  { id: "DISC2000", name: "Potongan 2.000", type: "rp", value: 2000 },
  { id: "DISC50", name: "Diskon 50%", type: "pct", value: 50 },
];

const promotionEvents = [
  {
    id: "PROMO1",
    name: "Promo Spesial 1",
    type: "pct",
    value: 20,
    img: "https://via.placeholder.com/50",
    description: "Diskon 20% untuk pembelian 3 item atau lebih",
  },
  {
    id: "PROMO2",
    name: "Promo Spesial 2",
    type: "rp",
    value: 5000,
    img: "https://via.placeholder.com/50",
    description: "Potongan Rp 5.000 untuk pembelian total di atas Rp 100.000",
  },
  {
    id: "PROMO3",
    name: "Promo Spesial 3",
    type: "pct",
    value: 15,
    img: "https://via.placeholder.com/50",
    description: "Diskon 15% untuk produk tertentu",
  },
];

const seedTaxDefault = { name: "PPN", pct: 11 };

const loadOrSeed = (key, seed) => {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
};

const loadItems = () => loadOrSeed(STORAGE_KEY_ITEMS, seedItems);
const saveItems = (arr) =>
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(arr));
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_CART) || "[]");
  } catch {
    return [];
  }
};
const saveCart = (cart) =>
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
const loadHistory = () => loadOrSeed(STORAGE_KEY_HISTORY, seedHistory);
const loadDiscounts = () => loadOrSeed(STORAGE_KEY_DISCOUNTS, seedDiscounts);
const loadTaxDefault = () => loadOrSeed(STORAGE_KEY_TAXDEF, seedTaxDefault);

const Pos = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState(() => loadItems());
  const [history] = useState(() => loadHistory());
  const [discounts] = useState(() => loadDiscounts());
  const [taxDefault] = useState(() => loadTaxDefault());

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [cart, setCart] = useState(() => loadCart());
  const [selectedIcon, setSelectedIcon] = useState("search");

  const [currentTrxCode, setCurrentTrxCode] = useState("TRX-NEW");
  const [editingTrxId, setEditingTrxId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [openTitipan, setOpenTitipan] = useState(false);
  const [titipanForm, setTitipanForm] = useState({
    nama: "",
    kode: "",
    hargaDasar: "",
    hargaJual: "",
    unit: "pcs",
  });

  const [openDiskon, setOpenDiskon] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState(null);

  const [openPajak, setOpenPajak] = useState(false);
  const [taxMode, setTaxMode] = useState("default");
  const [customTax, setCustomTax] = useState({ name: "", pct: "" });
  const [globalTax, setGlobalTax] = useState(null);

  const [profitOpen, setProfitOpen] = useState(false);
  const [promotionOpen, setPromotionOpen] = useState(false);

  const [costModalOpen, setCostModalOpen] = useState(false);
  const [costForm, setCostForm] = useState({ name: "", note: "", amount: "" });
  const [costs, setCosts] = useState(() => {
    try {
      const raw = localStorage.getItem(COSTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [costDetail, setCostDetail] = useState(null); // object biaya yg di-klik

  const totalCosts = useMemo(
    () => costs.reduce((s, c) => s + Number(c.amount || 0), 0),
    [costs]
  );

  const subtotalItems = useMemo(
    () =>
      cart.reduce((sum, it) => {
        const base = (it.hargaJualOverride ?? it.hargaJual) * it.quantity;
        const dPct = it.diskonPct ? (base * it.diskonPct) / 100 : 0;
        const dRp = it.diskonRp || 0;
        return sum + Math.max(0, base - dPct - dRp);
      }, 0),
    [cart]
  );

  // const totalPrice = useMemo(() => {
  //   let afterDisc = subtotalItems;
  //   if (globalDiscount) {
  //     afterDisc =
  //       globalDiscount.type === "pct"
  //         ? Math.max(0, afterDisc - (afterDisc * globalDiscount.value) / 100)
  //         : Math.max(0, afterDisc - globalDiscount.value);
  //   }
  //   const taxPct = Number(globalTax?.pct || 0);
  //   return Math.round(afterDisc + (afterDisc * taxPct) / 100);
  // }, [subtotalItems, globalDiscount, globalTax]);

  const totalPrice = useMemo(() => {
    // subtotal item setelah diskon per-item
    let afterDisc = subtotalItems;
  
    // diskon global (opsional)
    if (globalDiscount) {
      afterDisc =
        globalDiscount.type === "pct"
          ? Math.max(0, afterDisc - (afterDisc * globalDiscount.value) / 100)
          : Math.max(0, afterDisc - globalDiscount.value);
    }
  
    // pajak dari omzet setelah diskon
    const taxPct = Number(globalTax?.pct || 0);
    const taxed = Math.round(afterDisc + (afterDisc * taxPct) / 100);
  
    // TAMBAHKAN BIAYA DI SINI
    return taxed + totalCosts;
  }, [subtotalItems, globalDiscount, globalTax, totalCosts]);
  

  const profitCalc = useMemo(() => {
    // revenue (sebelum diskon)
    const revenueBase = cart.reduce(
      (s, it) => s + (it.hargaJualOverride ?? it.hargaJual) * it.quantity,
      0
    );
    // COGS
    const cogs = cart.reduce(
      (s, it) => s + Number(it.hargaDasar || 0) * it.quantity,
      0
    );
    // Diskon per-item
    const itemDiscTotal = cart.reduce((s, it) => {
      const base = (it.hargaJualOverride ?? it.hargaJual) * it.quantity;
      const dPct = base * (Number(it.diskonPct || 0) / 100);
      const dRp = Number(it.diskonRp || 0);
      return s + dPct + dRp;
    }, 0);

    // Setelah diskon per-item
    const revenueAfterItemDisc = revenueBase - itemDiscTotal;

    // Diskon global
    let globalDiscTotal = 0;
    if (globalDiscount) {
      globalDiscTotal =
        globalDiscount.type === "pct"
          ? revenueAfterItemDisc * (Number(globalDiscount.value) / 100)
          : Number(globalDiscount.value || 0);
      // guard
      globalDiscTotal = Math.min(
        Math.max(globalDiscTotal, 0),
        revenueAfterItemDisc
      );
    }

    const totalDiscount = itemDiscTotal + globalDiscTotal;

    // Omzet setelah semua diskon
    const revenueAfterAllDisc = Math.max(0, revenueBase - totalDiscount);

    // Untung kotor (sebelum diskon)
    const grossBeforeDisc = revenueBase - cogs;

    // Potensi untung (setelah semua diskon, sebelum pajak)
    const profitAfterDisc = revenueAfterAllDisc - cogs;

    // Pajak dihitung dari omzet setelah diskon
    const taxPct = Number(globalTax?.pct || 0) / 100;
    const taxAmount = revenueAfterAllDisc * taxPct;

    // Untung setelah dikurangi pajak
    const profitAfterTax = profitAfterDisc - taxAmount;

    const itemsCount = cart.reduce((n, it) => n + Number(it.quantity || 0), 0);

    return {
      itemsCount,
      revenueBase,
      cogs,
      itemDiscTotal,
      globalDiscTotal,
      totalDiscount,
      revenueAfterAllDisc,
      grossBeforeDisc,
      profitAfterDisc,
      taxAmount,
      profitAfterTax,
    };
  }, [cart, globalDiscount, globalTax]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(COSTS_KEY, JSON.stringify(costs));
  }, [costs]);

  const openCostModal = () => {
    setCostForm({ name: "", note: "", amount: "" });
    setCostModalOpen(true);
  };


  const resetCostForm = () => setCostForm({ name: "", note: "", amount: "" });

  const saveCost = () => {
    const name = costForm.name.trim();
    const amount = parseInt(costForm.amount || "0", 10);
    if (!name) return alert("Nama Biaya wajib diisi.");
    if (isNaN(amount) || amount <= 0)
      return alert("Harga/nominal harus lebih dari 0.");
    setCosts((prev) => [
      ...prev,
      { id: Date.now(), name, note: costForm.note?.trim() || "", amount },
    ]);
    setCostModalOpen(false);
  };

  const deleteCost = (id) => {
    setCosts((prev) => prev.filter((c) => c.id !== id));
    setCostDetail(null);
  };

  const onCancel = useCallback(() => {
    setCart([]);
    saveCart([]);
    setCurrentTrxCode("TRX-NEW");
    setEditingTrxId(null);
    setGlobalDiscount(null);
    setGlobalTax(null);
    setTaxMode("default");
    setCustomTax({ name: "", pct: "" });
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

  const handleRefresh = useCallback(() => {
    alert("Refreshing items...");
    setItems(loadItems());
  }, []);

  const handleAddItemToCart = (itemToAdd) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === itemToAdd.id);
      if (exist) {
        if (exist.quantity < (itemToAdd.stok ?? 99999)) {
          return prev.map((p) =>
            p.id === itemToAdd.id ? { ...p, quantity: p.quantity + 1 } : p
          );
        }
        return prev;
      }
      return [
        ...prev,
        { ...itemToAdd, quantity: 1, diskonRp: 0, diskonPct: 0, note: "" },
      ];
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
              hargaJualOverride: Math.max(
                0,
                parseInt(editRow.hargaJualOverride || 0, 10)
              ),
              diskonRp: Math.max(0, parseInt(editRow.diskonRp || 0, 10)),
              diskonPct: Math.max(
                0,
                Math.min(100, parseInt(editRow.diskonPct || 0, 10))
              ),
              note: editRow.note || "",
            }
          : p
      )
    );
    setEditOpen(false);
  };

  const loadHistoryToCart = (trx) => {
    setCart(
      trx.items.map((it) => ({
        ...it,
        hargaJualOverride: it.hargaJual,
      }))
    );
    setCurrentTrxCode(trx.code || trx.id);
    setEditingTrxId(trx.id);
    setGlobalDiscount(null);
    setGlobalTax(null);
  };

  const handleSimpanPesananClick = () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    navigate("/pesanan/tambah", {
      state: { cartItems: cart, totalPrice, currentTrxCode, editingTrxId },
    });
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    const orderData = {
      id: editingTrxId || Date.now(),
      code: currentTrxCode,
      customer: "Umum",
      items: cart,
      total: totalPrice,
      meta: {
        globalDiscount,
        globalTax,
        costs,            
        totalCosts        
      },
    };
    localStorage.setItem("currentCheckout", JSON.stringify(orderData));
    navigate("/trx");
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(v);

  const submitTitipan = (e) => {
    e.preventDefault();
    const { nama, kode, hargaDasar, hargaJual, unit } = titipanForm;
    if (!nama || !hargaJual) return alert("Nama & Harga Jual wajib diisi");
    const newId = `TITIPAN-${Date.now()}`;
    const item = {
      id: newId,
      nama,
      kode: kode || newId,
      hargaDasar: parseInt(hargaDasar || 0, 10),
      hargaJual: parseInt(hargaJual || 0, 10),
      unit: unit || "pcs",
      stok: 999999,
    };
    setCart((prev) => [
      ...prev,
      { ...item, quantity: 1, diskonRp: 0, diskonPct: 0, note: "(Titipan)" },
    ]);
    setOpenTitipan(false);
    setTitipanForm({
      nama: "",
      kode: "",
      hargaDasar: "",
      hargaJual: "",
      unit: "pcs",
    });
  };

  const applySelectedDiscount = (d) => {
    setGlobalDiscount(d);
    setOpenDiskon(false);
  };

  const applyTax = () => {
    if (taxMode === "default") {
      setGlobalTax({ name: taxDefault.name, pct: Number(taxDefault.pct) || 0 });
      setOpenPajak(false);
      return;
    }
    const pct = Number(customTax.pct);
    if (!customTax.name || isNaN(pct))
      return alert("Nama pajak & persentase valid diperlukan");
    setGlobalTax({ name: customTax.name, pct: Math.max(0, pct) });
    setOpenPajak(false);
  };

  return (
    <div className="flex h-full">
      <div className="w-3/5 border-2 border-gray-100 bg-white p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center gap-4">
          <button
            className={`p-3 rounded-full ${
              selectedIcon === "search"
                ? "bg-green-600 text-white"
                : "bg-white text-black"
            }`}
            title="Cari"
            onClick={() => setSelectedIcon("search")}
          >
            <IoSearch size={20} />
          </button>

          <button
            className={`p-3 rounded-full ${
              selectedIcon === "barcode"
                ? "bg-green-600 text-white"
                : "bg-white text-black"
            }`}
            title="Barcode"
            onClick={() => setSelectedIcon("barcode")}
          >
            <IoBarcode size={20} />
          </button>

          <button
            className={`p-3 rounded-full ${
              selectedIcon === "receipt"
                ? "bg-green-600 text-white"
                : "bg-white text-black"
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
                selectedIcon === "receipt"
                  ? "Cari Kode/Customer Transaksi..."
                  : "Cari Barang / Kode"
              }
              className="flex-1 outline-none ml-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="flex gap-3 text-2xl items-center"
            onClick={handleRefresh}
          >
            Refresh <MdOutlineRefresh size={30} />
          </button>
        </div>

        <div className="flex gap-4">
          <button className="bg-green-100 px-6 py-3 rounded-lg text-lg">
            Semua
          </button>
          <button
            className="bg-green-100 px-6 py-3 rounded-lg text-lg"
            onClick={() => setOpenTitipan(true)}
          >
            Barang Titipan
          </button>
          <button
            className="bg-green-100 px-6 py-3 rounded-lg text-lg"
            onClick={() => setOpenDiskon(true)}
          >
            Diskon
          </button>
          <button
            className="bg-green-100 px-6 py-3 rounded-lg text-lg"
            onClick={() => setOpenPajak(true)}
          >
            Pajak
          </button>
        </div>

        {selectedIcon === "receipt" ? (
          <div className="flex flex-col gap-2">
            {filteredHistory.map((trx) => {
              const sum = trx.items.reduce(
                (s, it) => s + it.hargaJual * it.quantity,
                0
              );
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
                    {trx.customer} • {trx.items.length} item • Rp{" "}
                    {formatCurrency(sum)}
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
              <span className="text-3xl mr-3 bg-green-50 rounded-lg w-12 h-12 p-1 text-center">
                +
              </span>
              Tambah Barang Baru
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT: cart */}
      <div className="w-2/5 bg-white border-2 border-gray-100 flex flex-col justify-between">
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Header kecil */}
          <div className="flex items-center justify-between border-b pb-4 text-sm md:text-base">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openCostModal}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl shadow-sm"
                title="Tambah biaya (ongkir/jasa/dll)"
              >
                <span className="text-lg">＋</span> Biaya
              </button>

              <span>
                <b>Diskon:</b>{" "}
                {globalDiscount
                  ? (globalDiscount.type === "pct"
                      ? `${globalDiscount.value}%`
                      : `Rp ${formatCurrency(globalDiscount.value)}`) +
                    ` (${globalDiscount.name})`
                  : "-"}
              </span>
              <span>
                <b>Pajak:</b>{" "}
                {globalTax ? `${globalTax.name} ${globalTax.pct}%` : "-"}
              </span>


            </div>

            <div className="text-gray-600">
              Kode: <span className="font-semibold">{currentTrxCode}</span>
            </div>
            
          </div>

          <br />
          {costs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCostDetail(c)}
                  className="ml-1 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100"
                  title="Lihat detail biaya"
                >
                  <span className="text-xs font-semibold">{c.name}</span>
                  <span className="text-xs">Rp {formatCurrency(c.amount)}</span>
                </button>
              ))}
          {cart.length === 0 ? (
            <div className="mt-6 text-gray-400 text-xl">
              (daftar item muncul di sini)
            </div>
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
              <button
                onClick={() => setProfitOpen(true)}
                className="w-full flex items-center justify-between gap-3 border rounded-xl px-4 py-3 bg-white hover:bg-gray-50 transition"
                title="Lihat potensi untung"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="font-medium">Potensi Untung</span>
                  <HiOutlineQuestionMarkCircle
                    size={22}
                    className="text-gray-500 hover:text-green-600 transition"
                  />
                </span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                  {profitCalc.itemsCount} Item
                </span>
              </button>
            </div>

            <button
              onClick={() => setPromotionOpen(true)}
              className="w-1/2 h-[70px] bg-teal-100 text-teal-800 px-3 border border-teal-600 text-lg font-medium hover:bg-teal-200 transition flex items-center justify-center gap-2"
            >
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
                  onChange={(e) =>
                    setEditRow((r) => ({ ...r, quantity: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm">Harga (override)</span>
                <input
                  type="number"
                  min={0}
                  value={editRow.hargaJualOverride}
                  onChange={(e) =>
                    setEditRow((r) => ({
                      ...r,
                      hargaJualOverride: e.target.value,
                    }))
                  }
                  className="border rounded-lg px-3 py-2"
                />
                <div className="text-xs text-gray-500">
                  Harga asli: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(editRow.hargaJual)}
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
                    onChange={(e) =>
                      setEditRow((r) => ({ ...r, diskonPct: e.target.value }))
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Diskon (Rp)</span>
                  <input
                    type="number"
                    min={0}
                    value={editRow.diskonRp}
                    onChange={(e) =>
                      setEditRow((r) => ({ ...r, diskonRp: e.target.value }))
                    }
                    className="border rounded-lg px-3 py-2"
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-sm">Catatan</span>
                <input
                  type="text"
                  value={editRow.note}
                  onChange={(e) =>
                    setEditRow((r) => ({ ...r, note: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  placeholder="Catatan singkat…"
                />
              </label>

              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                {(() => {
                  const qty = Math.max(1, parseInt(editRow.quantity || 1, 10));
                  const price = Math.max(
                    0,
                    parseInt(editRow.hargaJualOverride || 0, 10)
                  );
                  const base = qty * price;
                  const dPct = Math.max(
                    0,
                    Math.min(100, parseInt(editRow.diskonPct || 0, 10))
                  );
                  const dRp = Math.max(0, parseInt(editRow.diskonRp || 0, 10));
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
                <button
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => setEditOpen(false)}
                >
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

      {openTitipan && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={submitTitipan}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold">Tambah Barang Titipan</div>
              <button
                type="button"
                onClick={() => setOpenTitipan(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <label className="grid gap-1">
              <span className="text-sm">Nama Barang / Jasa</span>
              <input
                type="text"
                value={titipanForm.nama}
                onChange={(e) =>
                  setTitipanForm((f) => ({ ...f, nama: e.target.value }))
                }
                className="border rounded-lg px-3 py-2"
                required
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Kode Barang</span>
              <input
                type="text"
                value={titipanForm.kode}
                onChange={(e) =>
                  setTitipanForm((f) => ({ ...f, kode: e.target.value }))
                }
                className="border rounded-lg px-3 py-2"
                placeholder="(opsional)"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Harga Dasar</span>
                <input
                  type="number"
                  min={0}
                  value={titipanForm.hargaDasar}
                  onChange={(e) =>
                    setTitipanForm((f) => ({
                      ...f,
                      hargaDasar: e.target.value,
                    }))
                  }
                  className="border rounded-lg px-3 py-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Harga Jual</span>
                <input
                  type="number"
                  min={0}
                  value={titipanForm.hargaJual}
                  onChange={(e) =>
                    setTitipanForm((f) => ({ ...f, hargaJual: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm">Unit</span>
              <input
                type="text"
                value={titipanForm.unit}
                onChange={(e) =>
                  setTitipanForm((f) => ({ ...f, unit: e.target.value }))
                }
                className="border rounded-lg px-3 py-2"
                placeholder="pcs / botol / dus"
              />
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border"
                onClick={() => setOpenTitipan(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Tambah ke Cart
              </button>
            </div>
          </form>
        </div>
      )}

      {openDiskon && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Pilih Diskon</div>
              <button
                onClick={() => setOpenDiskon(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-auto">
              {discounts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => applySelectedDiscount(d)}
                  className="w-full border rounded-lg p-3 text-left hover:bg-gray-50"
                >
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-gray-600">
                    {d.type === "pct"
                      ? `${d.value}%`
                      : `Rp ${formatCurrency(d.value)}`}
                  </div>
                </button>
              ))}
              {discounts.length === 0 && (
                <div className="text-sm text-gray-500">
                  Belum ada diskon di localStorage.
                </div>
              )}
            </div>

            {globalDiscount && (
              <div className="mt-3 text-sm">
                Terpilih: <b>{globalDiscount.name}</b> (
                {globalDiscount.type === "pct"
                  ? `${globalDiscount.value}%`
                  : `Rp ${formatCurrency(globalDiscount.value)}`}
                )
              </div>
            )}
          </div>
        </div>
      )}

      {openPajak && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Pengaturan Pajak</div>
              <button
                onClick={() => setOpenPajak(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="taxmode"
                    value="default"
                    checked={taxMode === "default"}
                    onChange={() => setTaxMode("default")}
                  />
                  <span>
                    Gunakan pajak default ({taxDefault.name} {taxDefault.pct}%)
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="taxmode"
                    value="custom"
                    checked={taxMode === "custom"}
                    onChange={() => setTaxMode("custom")}
                  />
                  <span>Pajak custom</span>
                </label>
              </div>

              {taxMode === "custom" && (
                <div className="grid gap-3 border rounded-lg p-3">
                  <label className="grid gap-1">
                    <span className="text-sm">Nama Pajak</span>
                    <input
                      type="text"
                      value={customTax.name}
                      onChange={(e) =>
                        setCustomTax((c) => ({ ...c, name: e.target.value }))
                      }
                      className="border rounded-lg px-3 py-2"
                      placeholder="PPN, Service, dll."
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm">Persentase (%)</span>
                    <input
                      type="number"
                      min={0}
                      value={customTax.pct}
                      onChange={(e) =>
                        setCustomTax((c) => ({ ...c, pct: e.target.value }))
                      }
                      className="border rounded-lg px-3 py-2"
                      placeholder="cth: 10"
                    />
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => setOpenPajak(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={applyTax}
                >
                  Terapkan
                </button>
              </div>

              {globalTax && (
                <div className="text-sm">
                  Terpilih: <b>{globalTax.name}</b> {globalTax.pct}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {profitOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">
                Ringkasan Potensi Untung
              </div>
              <button
                className="w-9 h-9 rounded-full hover:bg-gray-100"
                onClick={() => setProfitOpen(false)}
                title="Tutup"
              >
                ✕
              </button>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl border bg-green-50">
                <div className="text-sm text-gray-600">
                  Total Untung (kotor)
                </div>
                <div className="text-xl font-bold text-green-700">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.grossBeforeDisc
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-amber-50">
                <div className="text-sm text-gray-600">Total Diskon</div>
                <div className="text-xl font-bold text-amber-700">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.totalDiscount
                  )}
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  (Item: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.itemDiscTotal
                  )}{" "}
                  • Global: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.globalDiscTotal
                  )}
                  )
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-blue-50">
                <div className="text-sm text-gray-600">Potensi Untung</div>
                <div className="text-xl font-bold text-blue-700">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.profitAfterDisc
                  )}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Omzet setelah diskon: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.revenueAfterAllDisc
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-purple-50">
                <div className="text-sm text-gray-600">
                  Untung setelah dikurangi pajak
                  {globalTax ? ` (${globalTax.name} ${globalTax.pct}%)` : ""}
                </div>
                <div className="text-xl font-bold text-purple-700">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    profitCalc.profitAfterTax
                  )}
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  Pajak dari omzet: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(profitCalc.taxAmount)}
                </div>
              </div>
            </div>

            {/* detail ringkas */}
            <div className="rounded-xl border p-4 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Omzet (sebelum diskon)</span>
                  <span className="font-medium">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      profitCalc.revenueBase
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modal (COGS)</span>
                  <span className="font-medium">
                    Rp {new Intl.NumberFormat("id-ID").format(profitCalc.cogs)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Omzet setelah diskon</span>
                  <span className="font-medium">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      profitCalc.revenueAfterAllDisc
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Item</span>
                  <span className="font-medium">{profitCalc.itemsCount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setProfitOpen(false)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {promotionOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Promosi yang Sedang Berjalan
              </h2>
              <button
                onClick={() => setPromotionOpen(false)}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {promotionEvents.map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center gap-4 border rounded-lg p-3 hover:shadow-md transition"
                >
                  <img
                    src={promo.img}
                    alt={promo.name}
                    className="w-16 h-16 rounded-md object-cover border"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{promo.name}</h3>
                    <p className="text-sm text-gray-600">{promo.description}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      promo.type === "pct"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {promo.type === "pct"
                      ? `${promo.value}%`
                      : `Rp ${promo.value.toLocaleString("id-ID")}`}
                  </div>
                </div>
              ))}
            </div>

            {/* Tombol Tutup */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setPromotionOpen(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {costModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Tambah Biaya</div>
              <button
                onClick={() => setCostModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Nama Biaya</span>
                <input
                  type="text"
                  value={costForm.name}
                  onChange={(e) =>
                    setCostForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  placeholder="Ongkir / Jasa pasang / dll"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">
                  Keterangan (opsional)
                </span>
                <input
                  type="text"
                  value={costForm.note}
                  onChange={(e) =>
                    setCostForm((f) => ({ ...f, note: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  placeholder="Catatan tambahan…"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Harga</span>
                <input
                  type="number"
                  min={0}
                  value={costForm.amount}
                  onChange={(e) =>
                    setCostForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  placeholder="0"
                />
              </label>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={resetCostForm}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Reset
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCostModalOpen(false)}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Batal
                  </button>
                  <button
                    onClick={saveCost}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {costDetail && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Detail Biaya</div>
              <button
                onClick={() => setCostDetail(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama</span>
                <span className="font-medium">{costDetail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harga</span>
                <span className="font-semibold">
                  Rp {formatCurrency(costDetail.amount)}
                </span>
              </div>
              {costDetail.note && (
                <div className="mt-2">
                  <div className="text-gray-600">Keterangan</div>
                  <div className="font-medium">{costDetail.note}</div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => deleteCost(costDetail.id)}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>
              <button
                onClick={() => setCostDetail(null)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pos;
