import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiTrash2,
  FiX,
  FiMinus,
  FiPlus as FiPlusSm,
  FiBell,
} from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";
import { MdRefresh } from "react-icons/md";
import { BiBarcode } from "react-icons/bi";

const LS_ITEMS = "pembelian.items";
const LS_SUPPLIERS = "pembelian.suppliers";
const LS_LIST = "pembelian.list";
const LS_CURRENT = "pembelian.current";

const seedItems = [
  { id: 302, kode: "GL1L", nama: "Gula 1KG", stok: 25, hargaBeli: 12000 },
  { id: 303, kode: "GL5K", nama: "Gula 5KG", stok: 15, hargaBeli: 55000 },
  { id: 304, kode: "TLPK", nama: "Telur Ayam 1KG", stok: 20, hargaBeli: 23000 },
  {
    id: 305,
    kode: "TLPB",
    nama: "Telur Bebek 1KG",
    stok: 12,
    hargaBeli: 27000,
  },
  { id: 306, kode: "MNY2L", nama: "Minyak 2L", stok: 18, hargaBeli: 34000 },
  { id: 307, kode: "MNY5L", nama: "Minyak 5L", stok: 10, hargaBeli: 85000 },
  { id: 308, kode: "KCPR", nama: "Kecap Refill", stok: 30, hargaBeli: 3500 },
  {
    id: 309,
    kode: "SKM",
    nama: "Susu Kental Manis",
    stok: 40,
    hargaBeli: 8000,
  },
  {
    id: 310,
    kode: "SKM2",
    nama: "Susu Kental Manis 2KG",
    stok: 15,
    hargaBeli: 15000,
  },
  { id: 311, kode: "MSG", nama: "MSG 500gr", stok: 50, hargaBeli: 5000 },
  { id: 312, kode: "MSG1", nama: "MSG 1KG", stok: 20, hargaBeli: 9000 },
  {
    id: 313,
    kode: "TMBH",
    nama: "Tepung Terigu 1KG",
    stok: 25,
    hargaBeli: 12000,
  },
  {
    id: 314,
    kode: "TMB5",
    nama: "Tepung Terigu 5KG",
    stok: 10,
    hargaBeli: 55000,
  },
  { id: 315, kode: "KRN1", nama: "Kornet 1KG", stok: 15, hargaBeli: 45000 },
  { id: 316, kode: "KRN2", nama: "Kornet 2KG", stok: 8, hargaBeli: 85000 },
  { id: 317, kode: "SRP1", nama: "Sirup 1L", stok: 20, hargaBeli: 25000 },
  { id: 318, kode: "SRP2", nama: "Sirup 2L", stok: 10, hargaBeli: 45000 },
  { id: 319, kode: "KOP1", nama: "Kopi Sachet", stok: 100, hargaBeli: 2000 },
  { id: 320, kode: "KOP2", nama: "Kopi Bubuk 1KG", stok: 15, hargaBeli: 60000 },
  { id: 321, kode: "THT1", nama: "Teh Celup", stok: 50, hargaBeli: 5000 },
  { id: 322, kode: "THT2", nama: "Teh Bubuk 1KG", stok: 20, hargaBeli: 40000 },
  { id: 323, kode: "MKR1", nama: "Margarin 1KG", stok: 15, hargaBeli: 25000 },
  { id: 324, kode: "MKR2", nama: "Margarin 2KG", stok: 10, hargaBeli: 45000 },
  {
    id: 325,
    kode: "CKL1",
    nama: "Coklat Bubuk 1KG",
    stok: 10,
    hargaBeli: 70000,
  },
  {
    id: 326,
    kode: "CKL2",
    nama: "Coklat Bubuk 2KG",
    stok: 5,
    hargaBeli: 130000,
  },
  {
    id: 327,
    kode: "BHN1",
    nama: "Bumbu Nasi Goreng",
    stok: 30,
    hargaBeli: 5000,
  },
  {
    id: 328,
    kode: "BHN2",
    nama: "Bumbu Ayam Goreng",
    stok: 25,
    hargaBeli: 6000,
  },
  { id: 329, kode: "BHN3", nama: "Bumbu Soto", stok: 20, hargaBeli: 7000 },
  { id: 330, kode: "BHN4", nama: "Bumbu Rendang", stok: 15, hargaBeli: 8000 },
  { id: 331, kode: "BHN5", nama: "Bumbu Kari", stok: 10, hargaBeli: 9000 },
  { id: 332, kode: "BHN6", nama: "Bumbu Opor", stok: 15, hargaBeli: 8500 },
  { id: 333, kode: "BHN7", nama: "Bumbu Pecel", stok: 20, hargaBeli: 7500 },
  { id: 334, kode: "BHN8", nama: "Bumbu Rawon", stok: 12, hargaBeli: 9500 },
  { id: 335, kode: "BHN9", nama: "Bumbu Sate", stok: 18, hargaBeli: 8000 },
  {
    id: 336,
    kode: "BHN10",
    nama: "Bumbu Sambal Goreng",
    stok: 25,
    hargaBeli: 7000,
  },
  {
    id: 337,
    kode: "BHN11",
    nama: "Bumbu Soto Ayam",
    stok: 30,
    hargaBeli: 6500,
  },
  { id: 338, kode: "BHN12", nama: "Bumbu Gulai", stok: 20, hargaBeli: 9000 },
  {
    id: 339,
    kode: "BHN13",
    nama: "Bumbu Ayam Bakar",
    stok: 15,
    hargaBeli: 8500,
  },
  {
    id: 340,
    kode: "BHN14",
    nama: "Bumbu Ikan Bakar",
    stok: 10,
    hargaBeli: 9500,
  },
  {
    id: 341,
    kode: "BHN15",
    nama: "Bumbu Rica-Rica",
    stok: 12,
    hargaBeli: 8000,
  },
  {
    id: 342,
    kode: "BHN16",
    nama: "Bumbu Ayam Goreng Kalasan",
    stok: 18,
    hargaBeli: 7500,
  },
  {
    id: 343,
    kode: "BHN17",
    nama: "Bumbu Ayam Goreng Kremes",
    stok: 25,
    hargaBeli: 7000,
  },
  {
    id: 344,
    kode: "BHN18",
    nama: "Bumbu Ayam Goreng Lengkuas",
    stok: 30,
    hargaBeli: 6500,
  },
  {
    id: 345,
    kode: "BHN19",
    nama: "Bumbu Ayam Goreng Serundeng",
    stok: 20,
    hargaBeli: 9000,
  },
  {
    id: 346,
    kode: "BHN20",
    nama: "Bumbu Ayam Goreng Padang",
    stok: 15,
    hargaBeli: 8500,
  },
  {
    id: 347,
    kode: "BHN21",
    nama: "Bumbu Ayam Goreng Betutu",
    stok: 10,
    hargaBeli: 9500,
  },
  {
    id: 348,
    kode: "BHN22",
    nama: "Bumbu Ayam Goreng Bali",
    stok: 12,
    hargaBeli: 8000,
  },
  {
    id: 349,
    kode: "BHN23",
    nama: "Bumbu Ayam Goreng Taliwang",
    stok: 18,
    hargaBeli: 7500,
  },
  {
    id: 350,
    kode: "BHN24",
    nama: "Bumbu Ayam Goreng Bumbu Rujak",
    stok: 25,
    hargaBeli: 7000,
  },
  {
    id: 351,
    kode: "BHN25",
    nama: "Bumbu Ayam Goreng Bumbu Kuning",
    stok: 30,
    hargaBeli: 6500,
  },
  {
    id: 352,
    kode: "BHN26",
    nama: "Bumbu Ayam Goreng Bumbu Merah",
    stok: 20,
    hargaBeli: 9000,
  },
  {
    id: 353,
    kode: "BHN27",
    nama: "Bumbu Ayam Goreng Bumbu Hitam",
    stok: 15,
    hargaBeli: 8500,
  },
  {
    id: 354,
    kode: "BHN28",
    nama: "Bumbu Ayam Goreng Bumbu Putih",
    stok: 10,
    hargaBeli: 9500,
  },
  {
    id: 355,
    kode: "BHN29",
    nama: "Bumbu Ayam Goreng Bumbu Hijau",
    stok: 12,
    hargaBeli: 8000,
  },
  {
    id: 356,
    kode: "BHN30",
    nama: "Bumbu Ayam Goreng Bumbu Ungu",
    stok: 18,
    hargaBeli: 7500,
  },
  {
    id: 357,
    kode: "BHN31",
    nama: "Bumbu Ayam Goreng Bumbu Biru",
    stok: 25,
    hargaBeli: 7000,
  },
  {
    id: 358,
    kode: "BHN32",
    nama: "Bumbu Ayam Goreng Bumbu Coklat",
    stok: 30,
    hargaBeli: 6500,
  },
  {
    id: 359,
    kode: "BHN33",
    nama: "Bumbu Ayam Goreng Bumbu Pelangi",
    stok: 20,
    hargaBeli: 9000,
  },
  {
    id: 360,
    kode: "BHN34",
    nama: "Bumbu Ayam Goreng Bumbu Nusantara",
    stok: 15,
    hargaBeli: 8500,
  },
];

const seedSuppliers = [
  { id: 1, nama: "PT Sumber Pangan" },
  { id: 2, nama: "CV Sejahtera Abadi" },
  { id: 3, nama: "UD Maju Jaya" },
];

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

const loadList = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_LIST) || "[]");
  } catch {
    return [];
  }
};
const saveList = (arr) => localStorage.setItem(LS_LIST, JSON.stringify(arr));

const saveCurrent = (obj) =>
  localStorage.setItem(LS_CURRENT, JSON.stringify(obj));
const clearCurrent = () => localStorage.removeItem(LS_CURRENT);

const rp = (n) =>
  `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

const PembeliSuplier = () => {
  const navigate = useNavigate();

  // Masters
  const [items] = useState(() => loadOrSeed(LS_ITEMS, seedItems));
  const [suppliers] = useState(() => loadOrSeed(LS_SUPPLIERS, seedSuppliers));

  // UI States
  const [query, setQuery] = useState("");
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || null);

  const [sortKey, setSortKey] = useState("nama"); // 'nama' | 'kode' | 'stok'
  const [sortAsc, setSortAsc] = useState(true);
  const [searchMode, setSearchMode] = useState("nama"); // 'nama' | 'kode'

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifDetailOpen, setNotifDetailOpen] = useState(false);
  const [notifCategory, setNotifCategory] = useState(null); // 'habis' | 'menipis' | 'semua'
  const MENIPIS_THRESHOLD = 10;

  const [cart, setCart] = useState([]);

  const [discType, setDiscType] = useState("rp"); // 'rp' | 'pct'
  const [discValue, setDiscValue] = useState(0);
  const [taxPct, setTaxPct] = useState(0);

  const [costOpen, setCostOpen] = useState(false);
  const [costForm, setCostForm] = useState({ name: "", amount: "", note: "" });
  const [costs, setCosts] = useState([]); // {id,name,amount,note}

  const [lineEditOpen, setLineEditOpen] = useState(false);
  const [lineForm, setLineForm] = useState({
    id: null,
    harga: 0, // harga beli per item
    discountType: "rp", // 'rp' | 'pct'
    diskonPerQtyRp: 0, // nominal Rp per item
    diskonPerQtyPct: 0, // persen per item
    note: "",
  });

  // ===== Helpers Diskon Per Item =====
  const calcPerItemDiscount = (harga, type, rpVal, pctVal) => {
    const h = Math.max(0, Number(harga || 0));
    if (type === "pct") {
      const pct = Math.max(0, Number(pctVal || 0));
      return Math.min(h, (h * pct) / 100);
    }
    const rp = Math.max(0, Number(rpVal || 0));
    return Math.min(h, rp);
  };

  // Open modal edit line
  const openLineEdit = (row) => {
    setLineForm({
      id: row.id,
      harga: Number(row.harga || 0),
      discountType: row.discountType || "rp",
      diskonPerQtyRp: Number(row.diskonPerQtyRp || row.diskonPerQty || 0),
      diskonPerQtyPct: Number(row.diskonPerQtyPct || 0),
      note: row.note || "",
    });
    setLineEditOpen(true);
  };

  // Simpan modal edit line
  const saveLineEdit = () => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === lineForm.id
          ? {
              ...p,
              harga: Math.max(0, Number(lineForm.harga || 0)),
              discountType: lineForm.discountType,
              diskonPerQtyRp: Math.max(0, Number(lineForm.diskonPerQtyRp || 0)),
              diskonPerQtyPct: Math.max(
                0,
                Number(lineForm.diskonPerQtyPct || 0)
              ),
              note: lineForm.note || "",
            }
          : p
      )
    );
    setLineEditOpen(false);
  };

  // Filter + sort katalog
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = items;

    if (q) {
      if (searchMode === "nama")
        data = data.filter((i) => i.nama.toLowerCase().includes(q));
      else data = data.filter((i) => (i.kode || "").toLowerCase().includes(q));
    }

    const valOf = (it) =>
      sortKey === "nama"
        ? (it.nama || "").toLowerCase()
        : sortKey === "kode"
        ? (it.kode || "").toLowerCase()
        : Number(it.stok || 0);

    data = [...data].sort((a, b) => {
      const va = valOf(a);
      const vb = valOf(b);
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

    return data;
  }, [items, query, searchMode, sortKey, sortAsc]);

  // ====== Perhitungan total yang benar (memasukkan diskon per item) ======

  // Gross items (tanpa diskon apapun)
  const grossItems = useMemo(
    () =>
      cart.reduce(
        (s, it) => s + Number(it.harga || 0) * Number(it.qty || 0),
        0
      ),
    [cart]
  );

  // Total diskon per item (Rp/% per qty)
  const totalDiskonItem = useMemo(
    () =>
      cart.reduce((s, it) => {
        const perItemDisc = calcPerItemDiscount(
          it.harga,
          it.discountType || "rp",
          it.diskonPerQtyRp,
          it.diskonPerQtyPct
        );
        return s + perItemDisc * Math.max(1, Number(it.qty || 1));
      }, 0),
    [cart]
  );

  // Omzet setelah diskon per item (dasar diskon global)
  const baseAfterItemDisc = useMemo(
    () => Math.max(0, grossItems - totalDiskonItem),
    [grossItems, totalDiskonItem]
  );

  // Diskon global
  const totalDiskonGlobal = useMemo(() => {
    const v = Number(discValue || 0);
    if (!v) return 0;
    if (discType === "pct")
      return Math.min(baseAfterItemDisc * (v / 100), baseAfterItemDisc);
    return Math.min(v, baseAfterItemDisc);
  }, [discType, discValue, baseAfterItemDisc]);

  // Pajak dari omzet setelah semua diskon
  const totalPajak = useMemo(() => {
    const base = Math.max(0, baseAfterItemDisc - totalDiskonGlobal);
    return Math.round(base * (Number(taxPct || 0) / 100));
  }, [baseAfterItemDisc, totalDiskonGlobal, taxPct]);

  // Biaya tambahan
  const totalBiaya = useMemo(
    () => costs.reduce((s, c) => s + Number(c.amount || 0), 0),
    [costs]
  );

  // Grand total
  const grandTotal = useMemo(
    () =>
      Math.max(0, baseAfterItemDisc - totalDiskonGlobal) +
      totalPajak +
      totalBiaya,
    [baseAfterItemDisc, totalDiskonGlobal, totalPajak, totalBiaya]
  );

  const getSupplierName = (id, suppliers) => {
    return suppliers.find((s) => s.id === id)?.nama || "Tanpa Supplier";
  };

  const upsertListById = (arr, row) => {
    const idx = arr.findIndex((r) => r.id === row.id);
    if (idx === -1) return [row, ...arr];
    const next = [...arr];
    next[idx] = row;
    return next;
  };

  // Tambah ke keranjang (default field diskon per item)
  const addToCart = (it) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === it.id);
      if (found) {
        return prev.map((p) => (p.id === it.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          id: it.id,
          kode: it.kode,
          nama: it.nama,
          harga: it.hargaBeli,
          qty: 1,
          discountType: "rp",
          diskonPerQtyRp: 0,
          diskonPerQtyPct: 0,
          note: "",
        },
      ];
    });
  };

  const decQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );
  };
  const incQty = (id) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  };
  const removeLine = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const buildItemsPayload = () =>
    cart.map((c) => {
      const perItemDisc = calcPerItemDiscount(
        c.harga,
        c.discountType || "rp",
        c.diskonPerQtyRp,
        c.diskonPerQtyPct
      );
      const afterPerItem = Math.max(0, Number(c.harga || 0) - perItemDisc);
      return {
        barang_id: c.id,
        kode: c.kode,
        nama: c.nama,
        qty: Number(c.qty || 0),
        harga_beli: Number(c.harga || 0),
        discount_type: c.discountType || "rp",
        diskon_per_qty_rp: Number(c.diskonPerQtyRp || 0),
        diskon_per_qty_pct: Number(c.diskonPerQtyPct || 0),
        note: c.note || "",
        subtotal: afterPerItem * Number(c.qty || 0),
      };
    });

  const buildMeta = () => ({
    globalDiscount: { type: discType, value: Number(discValue || 0) },
    globalTax: { pct: Number(taxPct || 0) },
    costs,
  });

  const saveDraft = () => {
    if (!supplierId) return alert("Pilih supplier terlebih dahulu.");
    if (cart.length === 0) return alert("Keranjang masih kosong.");

    const now = new Date().toISOString();
    const current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");

    const baseRecord = {
      id: current?.id || Date.now(),
      type: "purchase",
      status: "draft",
      toko_id: 1,
      supplier_id: supplierId,
      supplier_name: getSupplierName(supplierId, suppliers),
      tanggal_waktu: now,
      total: grandTotal, // <— penting untuk Transaksi
      total_harga: grandTotal,
      total_diskon: totalDiskonItem + totalDiskonGlobal,
      total_pajak: totalPajak,
      nominal_biaya: totalBiaya,
      no_struk: current?.no_struk || genNoStruk(),
      is_use_hutang: true,
      created_by: 1,
      updated_by: null,
      created_at: now,
      updated_at: now,
      meta: buildMeta(),
      items: buildItemsPayload(),
    };

    const list = loadList();
    const nextList = upsertListById(list, baseRecord);
    saveList(nextList);
    saveCurrent(baseRecord);

    alert("Draft pembelian disimpan.");
  };

  const proceedToPay = () => {
    if (!supplierId) return alert("Pilih supplier terlebih dahulu.");
    if (cart.length === 0) return alert("Keranjang masih kosong.");

    const now = new Date().toISOString();
    const current = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");

    const record = {
      id: current?.id || Date.now(),
      type: "purchase",
      status: "paid", // <— sama seperti onPayDraft
      toko_id: 1,
      supplier_id: supplierId,
      supplier_name: getSupplierName(supplierId, suppliers),
      tanggal_waktu: now,
      total: grandTotal,
      total_harga: grandTotal,
      total_diskon: totalDiskonItem + totalDiskonGlobal,
      total_pajak: totalPajak,
      nominal_biaya: totalBiaya,
      no_struk: current?.no_struk || genNoStruk(),
      is_use_hutang: false,
      created_by: 1,
      updated_by: null,
      created_at: now,
      updated_at: now,
      meta: buildMeta(),
      items: buildItemsPayload(),
    };

    // update list juga (supaya riwayat ada), tapi status "paid"
    const list = loadList();
    const nextList = upsertListById(list, record);
    saveList(nextList);
    saveCurrent(record);

    // untuk halaman Transaksi.jsx
    localStorage.setItem("pembelian.current", JSON.stringify(record));
    // pergi ke trx
    navigate("/trx");
  };
  // Biaya handlers
  const openCost = () => {
    setCostForm({ name: "", amount: "", note: "" });
    setCostOpen(true);
  };
  const saveCost = () => {
    const name = costForm.name.trim();
    const amount = parseInt(costForm.amount || "0", 10);
    if (!name) return alert("Nama biaya wajib diisi");
    if (!(amount > 0)) return alert("Nominal biaya harus > 0");
    setCosts((prev) => [
      ...prev,
      { id: Date.now(), name, amount, note: costForm.note?.trim() || "" },
    ]);
    setCostOpen(false);
  };
  const deleteCost = (id) => setCosts((p) => p.filter((c) => c.id !== id));

  // Simpan / Bayar
  const genNoStruk = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `PB-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(
      d.getDate()
    )}-${d.getTime()}`;
  };

  const handleSave = (isPay) => {
    if (!supplierId) return alert("Pilih supplier terlebih dahulu.");
    if (cart.length === 0) return alert("Keranjang masih kosong.");

    const now = new Date().toISOString();

    // subtotal per item sesudah diskon item
    const itemsPayload = cart.map((c) => {
      const perItemDisc = calcPerItemDiscount(
        c.harga,
        c.discountType || "rp",
        c.diskonPerQtyRp,
        c.diskonPerQtyPct
      );
      const afterPerItem = Math.max(0, Number(c.harga || 0) - perItemDisc);
      return {
        barang_id: c.id,
        kode: c.kode,
        nama: c.nama,
        qty: c.qty,
        harga_beli: c.harga,
        discount_type: c.discountType || "rp",
        diskon_per_qty_rp: Number(c.diskonPerQtyRp || 0),
        diskon_per_qty_pct: Number(c.diskonPerQtyPct || 0),
        note: c.note || "",
        subtotal: afterPerItem * Number(c.qty || 0),
      };
    });

    const record = {
      id: Date.now(),
      toko_id: 1,
      supplier_id: supplierId,
      tanggal_waktu: now,
      total_harga: grandTotal,
      total_diskon: totalDiskonItem + totalDiskonGlobal, // gabungan item + global
      total_pajak: totalPajak,
      nominal_bayar: grandTotal,
      nominal_dibayar: isPay ? grandTotal : 0,
      nominal_biaya: totalBiaya,
      nominal_kembalian: 0,
      keterangan: "",
      no_struk: genNoStruk(),
      nama_biaya: costs.map((c) => c.name).join(", ") || null,
      is_use_hutang: !isPay,
      created_by: 1,
      updated_by: null,
      sync_at: null,
      status: true,
      created_at: now,
      updated_at: now,
      items: itemsPayload,
    };

    const list = loadList();
    saveList([record, ...list]);
    saveCurrent(record);

    alert(isPay ? "Pembelian disimpan (Lunas)." : "Draft pembelian disimpan.");
  };

  // Keyboard shortcut biaya (Ctrl+B)
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        openCost();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
      if (!cur) return;
      // hanya muat yang tipe purchase
      if (!(cur.type === "purchase" || cur.supplier_id)) return;

      setSupplierId(cur.supplier_id || suppliers[0]?.id || null);

      // meta global disc/tax
      const gd = cur.meta?.globalDiscount || null;
      const gt = cur.meta?.globalTax || null;
      if (gd) {
        setDiscType(gd.type === "pct" ? "pct" : "rp");
        setDiscValue(Number(gd.value || 0));
      }
      if (gt) setTaxPct(Number(gt.pct || 0));

      // biaya
      if (Array.isArray(cur.meta?.costs)) setCosts(cur.meta.costs);

      // cart
      const mapped = (cur.items || []).map((it) => ({
        id: it.barang_id ?? it.id,
        kode: it.kode,
        nama: it.nama,
        harga: Number(it.harga_beli || it.harga || 0),
        qty: Number(it.qty || 1),
        discountType: it.discount_type || "rp",
        diskonPerQtyRp: Number(it.diskon_per_qty_rp || 0),
        diskonPerQtyPct: Number(it.diskon_per_qty_pct || 0),
        note: it.note || "",
      }));
      if (mapped.length) setCart(mapped);
    } catch {}
  }, [suppliers]);

  // Navbar
  const onSave = useCallback(() => handleSave(false), []); // draft
  const onBayar = useCallback(() => handleSave(true), []); // lunas

  const resetAll = useCallback(() => {
    setCart([]);
    setDiscValue(0);
    setTaxPct(0);
    setCosts([]);
    clearCurrent();
  }, []);

  useNavbar(
    {
      variant: "page",
      title: "Pembelian Supplier",
      backTo: null,
      actions: [
        {
          type: "button",
          title: "Draft",
          onClick: navigate.bind(null, "/pembelian-supplier/draft"),
          label: "Draft",
          className:
            "bg-white-400 text-yellow-600 text-xs px-3 py-1 rounded-xl hover:bg-yellow-50 border border-yellow-500",
        },
        {
          type: "button",
          title: "Batalkan",
          onClick: resetAll,
          label: "Batalkan",
          className:
            "text-xs text-red-600 border border-red-400 px-3 py-1 rounded-full hover:bg-red-50",
        },
      ],
    },
    [resetAll, navigate]
  );

  // === Notif datasets ===
  const stokHabis = useMemo(
    () => items.filter((i) => Number(i.stok || 0) === 0),
    [items]
  );
  const stokMenipis = useMemo(
    () =>
      items.filter(
        (i) => Number(i.stok || 0) > 0 && Number(i.stok) <= MENIPIS_THRESHOLD
      ),
    [items]
  );
  const stokSemua = items;

  const openNotifCategory = (cat) => {
    setNotifCategory(cat);
    setNotifDetailOpen(true);
  };

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-violet-50 via-white to-sky-50">
      {/* LEFT: daftar barang */}
      <div className="w-[60%] border-r border-violet-100/70 bg-white/80 backdrop-blur-sm flex flex-col p-6 gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter dropdown */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
            <FiFilter className="w-5 h-5 text-violet-700" />
            <select
              className="bg-transparent text-sm outline-none"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              title="Urut/Filter"
            >
              <option value="nama">Nama</option>
              <option value="kode">Kode</option>
              <option value="stok">Stok</option>
            </select>
            <button
              className="text-xs inline-flex items-center gap-1 border border-violet-300 rounded-full px-2 py-0.5 bg-white hover:bg-violet-50"
              onClick={() => setSortAsc((v) => !v)}
              title="Urut naik/turun"
            >
              <HiArrowsUpDown /> {sortAsc ? "Asc" : "Desc"}
            </button>
          </div>

          {/* Notifikasi stok */}
          <button
            className="relative text-violet-700 inline-flex items-center gap-2 border border-violet-300 bg-violet-50 px-4 py-2 rounded-xl hover:bg-violet-100"
            title="Notifikasi Stok"
            onClick={() => setNotifOpen(true)}
          >
            <FiBell className="w-5 h-5" />
          </button>

          {/* Toggle search mode (nama/kode) */}
          <div className="flex items-center gap-2">
            <button
              className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${
                searchMode === "nama"
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
              title="Cari Nama"
              onClick={() => setSearchMode("nama")}
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${
                searchMode === "kode"
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
              title="Cari Kode / Barcode"
              onClick={() => setSearchMode("kode")}
            >
              <BiBarcode className="w-6 h-6" />
            </button>
          </div>

          {/* Input search */}
          <div className="flex-1 relative">
            <FiSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-violet-700" />
            <input
              type="text"
              placeholder={
                searchMode === "nama"
                  ? "Cari nama barang…"
                  : "Cari kode barang…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-violet-400 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <button
            className="text-violet-700 inline-flex items-center justify-center w-12 h-12 border border-violet-500 rounded-xl hover:bg-violet-50"
            title="Refresh"
            onClick={() => window.location.reload()}
          >
            <MdRefresh className="w-7 h-7" />
          </button>
        </div>

        {/* Kategori dummy */}
        <div className="flex items-center gap-2">
          <button className="border px-4 py-2 rounded-full text-sm hover:bg-violet-50 border-violet-300 text-violet-700">
            Semua
          </button>
          <button className="border px-4 py-2 rounded-full text-sm hover:bg-amber-50 border-amber-300 text-amber-700">
            Bahan Pokok
          </button>
          <button className="border px-4 py-2 rounded-full text-sm hover:bg-sky-50 border-sky-300 text-sky-700">
            Bumbu Masak
          </button>
        </div>

        {/* Grid barang */}
        <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {filtered.map((it) => (
            <button
              key={it.id}
              onClick={() => addToCart(it)}
              className="text-left rounded-xl border border-violet-200 hover:shadow-md transition p-3 bg-white/70"
              title="Tambah ke keranjang"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-200 rounded-xl w-12 h-12 flex items-center justify-center text-[10px] font-bold text-violet-700">
                  {it.kode}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-violet-800">
                    {it.nama}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700">
                      Stok {it.stok}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                      {rp(it.hargaBeli)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <button className="flex items-center gap-3 text-violet-700 hover:text-violet-900 text-sm">
            <span className="w-10 h-10 bg-violet-50 border border-violet-200 rounded-full flex items-center justify-center">
              <FiPlus className="text-lg" />
            </span>
            <span className="font-semibold">Tambah Barang Baru</span>
          </button>
        </div>
      </div>

      {/* RIGHT: ringkasan */}
      <div className="w-[40%] flex flex-col p-6 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={openCost}
              className="text-xs inline-flex items-center gap-2 border px-3 py-1.5 rounded-full hover:bg-violet-50 border-violet-300 text-violet-700 bg-white"
              title="Tambah biaya (ongkir/jasa)"
            >
              + Biaya (Ctrl+B)
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-violet-200 p-3 grid gap-3 bg-white/80">
          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Supplier</span>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={supplierId || ""}
              onChange={(e) => setSupplierId(Number(e.target.value))}
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-gray-600">Diskon Global</span>
              <div className="flex gap-2">
                <select
                  className="border rounded-lg px-2 text-sm"
                  value={discType}
                  onChange={(e) => setDiscType(e.target.value)}
                >
                  <option value="rp">Rp</option>
                  <option value="pct">%</option>
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm w-full"
                  min={0}
                  value={discValue}
                  onChange={(e) =>
                    setDiscValue(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="0"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-gray-600">Pajak (%)</span>
              <input
                type="text"
                inputMode="numeric"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                min={0}
                value={taxPct}
                onChange={(e) =>
                  setTaxPct(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="0"
              />
            </label>
          </div>

          <div>
            <div className="mt-2 flex flex-wrap gap-2">
              {costs.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full border text-xs bg-teal-50 border-teal-200 text-teal-700"
                  title={c.note || ""}
                >
                  {c.name}: {rp(c.amount)}
                  <button
                    className="text-teal-700/70 hover:text-red-600"
                    onClick={() => deleteCost(c.id)}
                    title="Hapus"
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-violet-200 p-3 overflow-auto bg-white/80">
          {cart.length === 0 ? (
            <div className="h-full border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500 text-sm">
              Belum ada barang yang dipilih
            </div>
          ) : (
            <div className="grid gap-2">
              {cart.map((row) => (
                <div
                  key={row.id}
                  className="border rounded-lg p-2 flex items-center justify-between bg-gradient-to-r from-white to-violet-50 cursor-pointer"
                  onClick={() => openLineEdit(row)}
                  title="Klik untuk edit baris"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate text-violet-800">
                      {row.nama}
                    </div>
                    <div className="text-xs text-gray-500">
                      {row.kode} • {rp(row.harga)}
                      {row.discountType === "pct" &&
                        Number(row.diskonPerQtyPct || 0) > 0 && (
                          <span className="ml-2 text-violet-700">
                            • Diskon/qty: {row.diskonPerQtyPct}%
                          </span>
                        )}
                      {row.discountType !== "pct" &&
                        Number(row.diskonPerQtyRp || 0) > 0 && (
                          <span className="ml-2 text-violet-700">
                            • Diskon/qty: {rp(row.diskonPerQtyRp)}
                          </span>
                        )}
                      {row.note && (
                        <span className="ml-2 text-gray-400">• {row.note}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border hover:bg-gray-50 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        decQty(row.id);
                      }}
                      title="Kurangi"
                    >
                      <FiMinus />
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value || 1));
                        setCart((prev) =>
                          prev.map((p) =>
                            p.id === row.id ? { ...p, qty: val } : p
                          )
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-14 text-center border rounded-md py-1 text-sm"
                      title="Ubah jumlah"
                    />

                    <button
                      className="w-8 h-8 rounded-full border hover:bg-gray-50 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        incQty(row.id);
                      }}
                      title="Tambah"
                    >
                      <FiPlusSm />
                    </button>

                    <button
                      className="w-8 h-8 rounded-full border hover:bg-red-50 text-red-600 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLine(row.id);
                      }}
                      title="Hapus baris"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rangkuman */}
        <div className="rounded-xl border border-violet-300 overflow-hidden bg-white">
          <div className="px-4 py-3 grid gap-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal (Sebelum diskon)</span>
              <span className="font-medium">{rp(grossItems)}</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon Item</span>
              <span className="font-medium text-amber-700">
                - {rp(totalDiskonItem)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                Diskon Global {discType === "pct" ? `(${discValue || 0}%)` : ""}
              </span>
              <span className="font-medium text-amber-700">
                - {rp(totalDiskonGlobal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pajak ({taxPct || 0}%)</span>
              <span className="font-medium text-blue-700">
                {rp(totalPajak)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biaya</span>
              <span className="font-medium text-teal-700">
                {rp(totalBiaya)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold text-xl">Total</span>
              <span className="font-bold text-violet-700 text-xl">
                {rp(grandTotal)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4 bg-violet-50">
            <button
              onClick={saveDraft}
              className="border-2 w-40 border-amber-600 text-amber-700 py-3 hover:bg-amber-50 text-sm font-semibold rounded-xl"
            >
              SIMPAN
            </button>
            <button
              onClick={proceedToPay}
              className="border-2 w-48 border-violet-600 text-violet-700 py-3 hover:bg-violet-100 text-sm font-semibold rounded-xl"
            >
              Bayar (F12)
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: BIAYA */}
      {costOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white w/full max-w-md rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Tambah Biaya</div>
              <button
                onClick={() => setCostOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                <FiX />
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
                  placeholder="Ongkir / Jasa / Lainnya"
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
                <span className="text-sm font-medium">Nominal</span>
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setCostOpen(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={saveCost}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOTIFIKASI STOK (utama) */}
      {notifOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Notifikasi Stok</div>
              <button
                onClick={() => setNotifOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-3">
              <button
                className="w-full border rounded-lg p-3 text-left hover:bg-red-50 border-red-200 flex items-center justify-between"
                onClick={() => openNotifCategory("habis")}
              >
                <div>
                  <div className="font-medium text-red-700">
                    1. Stok barang habis
                  </div>
                  <div className="text-xs text-gray-500">
                    Barang dengan stok = 0
                  </div>
                </div>
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {stokHabis.length}
                </span>
              </button>

              <button
                className="w-full border rounded-lg p-3 text-left hover:bg-amber-50 border-amber-200 flex items-center justify-between"
                onClick={() => openNotifCategory("menipis")}
              >
                <div>
                  <div className="font-medium text-amber-700">
                    2. Stok barang menipis
                  </div>
                  <div className="text-xs text-gray-500">
                    Stok &le; {MENIPIS_THRESHOLD}
                  </div>
                </div>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  {stokMenipis.length}
                </span>
              </button>

              <button
                className="w-full border rounded-lg p-3 text-left hover:bg-sky-50 border-sky-200 flex items-center justify-between"
                onClick={() => openNotifCategory("semua")}
              >
                <div>
                  <div className="font-medium text-sky-700">
                    3. Stok barang semua
                  </div>
                  <div className="text-xs text-gray-500">
                    Lihat semua daftar barang dan stoknya
                  </div>
                </div>
                <span className="text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">
                  {stokSemua.length}
                </span>
              </button>
            </div>

            {/* Modal detail di dalam modal */}
            {notifDetailOpen && (
              <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">
                      {notifCategory === "habis"
                        ? "Detail: Stok Habis"
                        : notifCategory === "menipis"
                        ? "Detail: Stok Menipis"
                        : "Detail: Semua Stok"}
                    </div>
                    <button
                      onClick={() => setNotifDetailOpen(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100"
                      title="Tutup"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="max-h-[60vh] overflow-auto space-y-2">
                    {(notifCategory === "habis"
                      ? stokHabis
                      : notifCategory === "menipis"
                      ? stokMenipis
                      : stokSemua
                    ).map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center justify-between border rounded-lg p-2 bg-white hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium text-sm">{i.nama}</div>
                          <div className="text-xs text-gray-500">
                            {i.kode} • Stok:{" "}
                            <span
                              className={
                                i.stok === 0
                                  ? "text-red-600"
                                  : i.stok <= MENIPIS_THRESHOLD
                                  ? "text-amber-700"
                                  : "text-violet-700"
                              }
                            >
                              {i.stok}
                            </span>{" "}
                            • {rp(i.hargaBeli)}
                          </div>
                        </div>
                        <button
                          className="text-xs border px-3 py-1 rounded-full bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-100"
                          onClick={() => addToCart(i)}
                        >
                          + Keranjang
                        </button>
                      </div>
                    ))}
                    {((notifCategory === "habis" && stokHabis.length === 0) ||
                      (notifCategory === "menipis" &&
                        stokMenipis.length === 0)) && (
                      <div className="text-center text-sm text-gray-500 py-4">
                        Tidak ada data.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setNotifDetailOpen(false)}
                      className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: EDIT BARIS */}
      {lineEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg">Edit Baris</div>
              <button
                onClick={() => setLineEditOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Harga per item */}
              <label className="grid gap-1">
                <span className="text-sm">Harga Beli (per item)</span>
                <input
                  type="number"
                  min={0}
                  value={lineForm.harga}
                  onChange={(e) =>
                    setLineForm((f) => ({ ...f, harga: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  placeholder="0"
                />
              </label>

              {/* PILIHAN TIPE DISKON */}
              <div className="grid gap-2">
                <span className="text-sm">Diskon per Jumlah (per item)</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg border ${
                      lineForm.discountType === "rp"
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setLineForm((f) => ({ ...f, discountType: "rp" }))
                    }
                    title="Diskon Rupiah per item"
                  >
                    Rp
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg border ${
                      lineForm.discountType === "pct"
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setLineForm((f) => ({ ...f, discountType: "pct" }))
                    }
                    title="Diskon Persen per item"
                  >
                    %
                  </button>
                </div>

                {lineForm.discountType === "pct" ? (
                  <label className="grid gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={lineForm.diskonPerQtyPct}
                      onChange={(e) =>
                        setLineForm((f) => ({
                          ...f,
                          diskonPerQtyPct: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-3 py-2"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-500">
                      Contoh: 10 berarti diskon 10% dari harga per item.
                    </span>
                  </label>
                ) : (
                  <label className="grid gap-1">
                    <input
                      type="number"
                      min={0}
                      value={lineForm.diskonPerQtyRp}
                      onChange={(e) =>
                        setLineForm((f) => ({
                          ...f,
                          diskonPerQtyRp: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-3 py-2"
                      placeholder="0"
                    />
                    <span className="text-xs text-gray-500">
                      Contoh: 500 berarti diskon Rp500 per item.
                    </span>
                  </label>
                )}
              </div>

              {/* Catatan */}
              <label className="grid gap-1">
                <span className="text-sm">Catatan Singkat</span>
                <input
                  type="text"
                  value={lineForm.note}
                  onChange={(e) =>
                    setLineForm((f) => ({ ...f, note: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2"
                  placeholder="Opsional"
                />
              </label>

              {/* Pratinjau subtotal baris */}
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                {(() => {
                  const row = cart.find((c) => c.id === lineForm.id);
                  const qty = row ? Math.max(1, Number(row.qty || 1)) : 1;
                  const perItemDisc = calcPerItemDiscount(
                    lineForm.harga,
                    lineForm.discountType,
                    lineForm.diskonPerQtyRp,
                    lineForm.diskonPerQtyPct
                  );
                  const perItemAfter = Math.max(
                    0,
                    Number(lineForm.harga || 0) - perItemDisc
                  );
                  const subtotal = Math.max(0, qty * perItemAfter);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Diskon/Item</span>
                        <span className="font-medium">{rp(perItemDisc)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Harga/Item setelah diskon</span>
                        <span className="font-medium">{rp(perItemAfter)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Qty</span>
                        <span className="font-medium">{qty}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span>Subtotal Baris (estimasi)</span>
                        <span className="font-semibold">{rp(subtotal)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => setLineEditOpen(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={saveLineEdit}
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

export default PembeliSuplier;
