import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import {
  FiSearch,
  FiMenu,
  FiPlus,
  FiFilter,
  FiTrash2,
  FiX,
  FiMinus,
  FiPlus as FiPlusSm,
} from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";

/* ======================= LocalStorage Keys & Seed ======================= */
const LS_ITEMS = "pembelian.items";
const LS_SUPPLIERS = "pembelian.suppliers";
const LS_LIST = "pembelian.list";
const LS_CURRENT = "pembelian.current";

const seedItems = [
{ id: 302, kode: "GL1L", nama: "Gula 1KG", stok: 25, hargaBeli: 12000 },
{ id: 303, kode: "GL5K", nama: "Gula 5KG", stok: 15, hargaBeli: 55000 },
{ id: 304, kode: "TLPK", nama: "Telur Ayam 1KG", stok: 20, hargaBeli: 23000 },
{ id: 305, kode: "TLPB", nama: "Telur Bebek 1KG", stok: 12, hargaBeli: 27000 },
{ id: 306, kode: "MNY2L", nama: "Minyak 2L", stok: 18, hargaBeli: 34000 },
{ id: 307, kode: "MNY5L", nama: "Minyak 5L", stok: 10, hargaBeli: 85000 },
{ id: 308, kode: "KCPR", nama: "Kecap Refill", stok: 30, hargaBeli: 3500 },
{ id: 309, kode: "SKM", nama: "Susu Kental Manis", stok: 40, hargaBeli: 8000 },
{ id: 310, kode: "SKM2", nama: "Susu Kental Manis 2KG", stok: 15, hargaBeli: 15000 },
{ id: 311, kode: "MSG", nama: "MSG 500gr", stok: 50, hargaBeli: 5000 },
{ id: 312, kode: "MSG1", nama: "MSG 1KG", stok: 20, hargaBeli: 9000 },
{ id: 313, kode: "TMBH", nama: "Tepung Terigu 1KG", stok: 25, hargaBeli: 12000 },
{ id: 314, kode: "TMB5", nama: "Tepung Terigu 5KG", stok: 10, hargaBeli: 55000 },
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
{ id: 325, kode: "CKL1", nama: "Coklat Bubuk 1KG", stok: 10, hargaBeli: 70000 },
{ id: 326, kode: "CKL2", nama: "Coklat Bubuk 2KG", stok: 5, hargaBeli: 130000 },
{ id: 327, kode: "BHN1", nama: "Bumbu Nasi Goreng", stok: 30, hargaBeli: 5000 },
{ id: 328, kode: "BHN2", nama: "Bumbu Ayam Goreng", stok: 25, hargaBeli: 6000 },
{ id: 329, kode: "BHN3", nama: "Bumbu Soto", stok: 20, hargaBeli: 7000 },
{ id: 330, kode: "BHN4", nama: "Bumbu Rendang", stok: 15, hargaBeli: 8000 },
{ id: 331, kode: "BHN5", nama: "Bumbu Kari", stok: 10, hargaBeli: 9000 },
{ id: 332, kode: "BHN6", nama: "Bumbu Opor", stok: 15, hargaBeli: 8500 },
{ id: 333, kode: "BHN7", nama: "Bumbu Pecel", stok: 20, hargaBeli: 7500 },
{ id: 334, kode: "BHN8", nama: "Bumbu Rawon", stok: 12, hargaBeli: 9500 },
{ id: 335, kode: "BHN9", nama: "Bumbu Sate", stok: 18, hargaBeli: 8000 },
{ id: 336, kode: "BHN10", nama: "Bumbu Sambal Goreng", stok: 25, hargaBeli: 7000 },
{ id: 337, kode: "BHN11", nama: "Bumbu Soto Ayam", stok: 30, hargaBeli: 6500 },
{ id: 338, kode: "BHN12", nama: "Bumbu Gulai", stok: 20, hargaBeli: 9000 },
{ id: 339, kode: "BHN13", nama: "Bumbu Ayam Bakar", stok: 15, hargaBeli: 8500 },
{ id: 340, kode: "BHN14", nama: "Bumbu Ikan Bakar", stok: 10, hargaBeli: 9500 },
{ id: 341, kode: "BHN15", nama: "Bumbu Rica-Rica", stok: 12, hargaBeli: 8000 },
{ id: 342, kode: "BHN16", nama: "Bumbu Ayam Goreng Kalasan", stok: 18, hargaBeli: 7500 },
{ id: 343, kode: "BHN17", nama: "Bumbu Ayam Goreng Kremes", stok: 25, hargaBeli: 7000 },
{ id: 344, kode: "BHN18", nama: "Bumbu Ayam Goreng Lengkuas", stok: 30, hargaBeli: 6500 },
{ id: 345, kode: "BHN19", nama: "Bumbu Ayam Goreng Serundeng", stok: 20, hargaBeli: 9000 },
{ id: 346, kode: "BHN20", nama: "Bumbu Ayam Goreng Padang", stok: 15, hargaBeli: 8500 },
{ id: 347, kode: "BHN21", nama: "Bumbu Ayam Goreng Betutu", stok: 10, hargaBeli: 9500 },
{ id: 348, kode: "BHN22", nama: "Bumbu Ayam Goreng Bali", stok: 12, hargaBeli: 8000 },
{ id: 349, kode: "BHN23", nama: "Bumbu Ayam Goreng Taliwang", stok: 18, hargaBeli: 7500 },
{ id: 350, kode: "BHN24", nama: "Bumbu Ayam Goreng Bumbu Rujak", stok: 25, hargaBeli: 7000 },
{ id: 351, kode: "BHN25", nama: "Bumbu Ayam Goreng Bumbu Kuning", stok: 30, hargaBeli: 6500 },
{ id: 352, kode: "BHN26", nama: "Bumbu Ayam Goreng Bumbu Merah", stok: 20, hargaBeli: 9000 },
{ id: 353, kode: "BHN27", nama: "Bumbu Ayam Goreng Bumbu Hitam", stok: 15, hargaBeli: 8500 },
{ id: 354, kode: "BHN28", nama: "Bumbu Ayam Goreng Bumbu Putih", stok: 10, hargaBeli: 9500 },
{ id: 355, kode: "BHN29", nama: "Bumbu Ayam Goreng Bumbu Hijau", stok: 12, hargaBeli: 8000 },
{ id: 356, kode: "BHN30", nama: "Bumbu Ayam Goreng Bumbu Ungu", stok: 18, hargaBeli: 7500 },
{ id: 357, kode: "BHN31", nama: "Bumbu Ayam Goreng Bumbu Biru", stok: 25, hargaBeli: 7000 },
{ id: 358, kode: "BHN32", nama: "Bumbu Ayam Goreng Bumbu Coklat", stok: 30, hargaBeli: 6500 },
{ id: 359, kode: "BHN33", nama: "Bumbu Ayam Goreng Bumbu Pelangi", stok: 20, hargaBeli: 9000 },
{ id: 360, kode: "BHN34", nama: "Bumbu Ayam Goreng Bumbu Nusantara", stok: 15, hargaBeli: 8500 },
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

  // Navbar
  const onSave = useCallback(() => handleSave(false), []); // draft
  const onBayar = useCallback(() => handleSave(true), []); // lunas

  useNavbar(
    {
      variant: "page",
      title: "Pembelian Supplier",
      backTo: null,
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
    [onSave, onBayar]
  );

  // Masters
  const [items] = useState(() => loadOrSeed(LS_ITEMS, seedItems));
  const [suppliers] = useState(() => loadOrSeed(LS_SUPPLIERS, seedSuppliers));

  // UI States
  const [query, setQuery] = useState("");
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || null);
  const [sortAsc, setSortAsc] = useState(true);

  // Cart: {id, kode, nama, harga, qty}
  const [cart, setCart] = useState([]);

  // Global diskon & pajak
  const [discType, setDiscType] = useState("rp"); // 'rp' | 'pct'
  const [discValue, setDiscValue] = useState(0);
  const [taxPct, setTaxPct] = useState(0);

  // Biaya modal
  const [costOpen, setCostOpen] = useState(false);
  const [costForm, setCostForm] = useState({ name: "", amount: "", note: "" });
  const [costs, setCosts] = useState([]); // {id,name,amount,note}

  // Filtered items
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = !q
      ? items
      : items.filter(
          (i) =>
            i.nama.toLowerCase().includes(q) ||
            (i.kode || "").toLowerCase().includes(q)
        );
    data = [...data].sort((a, b) =>
      sortAsc
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama)
    );
    return data;
  }, [items, query, sortAsc]);

  // Subtotal items
  const subItems = useMemo(
    () => cart.reduce((s, it) => s + it.harga * it.qty, 0),
    [cart]
  );

  // Diskon
  const totalDiskon = useMemo(() => {
    if (!discValue) return 0;
    if (discType === "pct") {
      return Math.min(subItems * (Number(discValue) / 100), subItems);
    }
    return Math.min(Number(discValue || 0), subItems);
  }, [discType, discValue, subItems]);

  // Pajak dihitung dari (subtotal - diskon)
  const totalPajak = useMemo(() => {
    const base = Math.max(0, subItems - totalDiskon);
    return Math.round(base * (Number(taxPct || 0) / 100));
  }, [subItems, totalDiskon, taxPct]);

  // Biaya tambahan
  const totalBiaya = useMemo(
    () => costs.reduce((s, c) => s + Number(c.amount || 0), 0),
    [costs]
  );

  // Grand Total
  const grandTotal = useMemo(
    () => Math.max(0, subItems - totalDiskon) + totalPajak + totalBiaya,
    [subItems, totalDiskon, totalPajak, totalBiaya]
  );

  // Actions: add to cart
  const addToCart = (it) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === it.id);
      if (found) {
        return prev.map((p) =>
          p.id === it.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [
        ...prev,
        {
          id: it.id,
          kode: it.kode,
          nama: it.nama,
          harga: it.hargaBeli,
          qty: 1,
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
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  };
  const removeLine = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
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
    return `PB-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${d.getTime()}`;
  };

  const handleSave = (isPay) => {
    if (!supplierId) return alert("Pilih supplier terlebih dahulu.");
    if (cart.length === 0) return alert("Keranjang masih kosong.");

    const now = new Date().toISOString();
    const record = {
      // ====== sesuai model 'pembelian' ======
      id: Date.now(),
      toko_id: 1,
      supplier_id: supplierId,
      tanggal_waktu: now,
      total_harga: grandTotal,          // grand total
      total_diskon: totalDiskon,
      total_pajak: totalPajak,
      nominal_bayar: grandTotal,        // yang harus dibayar
      nominal_dibayar: isPay ? grandTotal : 0,
      nominal_biaya: totalBiaya,
      nominal_kembalian: 0,
      keterangan: "",
      no_struk: genNoStruk(),
      nama_biaya: costs.map((c) => c.name).join(", ") || null,
      is_use_hutang: !isPay,            // contoh: draft dianggap hutang
      created_by: 1,
      updated_by: null,
      sync_at: null,
      status: true,
      created_at: now,
      updated_at: now,

      // tambahan: detail item (agar mudah direview dari localStorage)
      items: cart.map((c) => ({
        barang_id: c.id,
        kode: c.kode,
        nama: c.nama,
        qty: c.qty,
        harga_beli: c.harga,
        subtotal: c.harga * c.qty,
      })),
    };

    // simpan ke list
    const list = loadList();
    saveList([record, ...list]);
    saveCurrent(record);

    alert(isPay ? "Pembelian disimpan (Lunas)." : "Draft pembelian disimpan.");
  };

  // Batalkan draft
  const resetAll = () => {
    setCart([]);
    setDiscValue(0);
    setTaxPct(0);
    setCosts([]);
    clearCurrent();
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

  return (
    <div className="flex h-full w-full bg-white">
      {/* LEFT: daftar barang */}
      <div className="w-[60%] border-r border-gray-200 flex flex-col p-6 gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <button className="border px-4 py-2 rounded-full text-sm hover:bg-gray-50">
            Semua
          </button>
          <button className="border px-4 py-2 rounded-full text-sm hover:bg-gray-50">
            Bahan Pokok
          </button>

          <div className="flex-1 relative">
            <FiSearch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
            <input
              type="text"
              placeholder="Cari barang…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-green-500 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <button
            className="text-green-600 inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            title="Filter"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Grid barang */}
        <div className="flex overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {filtered.map((it) => (
            <button
              key={it.id}
              onClick={() => addToCart(it)}
              className="text-left rounded-xl border hover:shadow-sm transition p-3"
              title="Tambah ke keranjang"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-xl w-12 h-12 flex items-center justify-center text-xs font-bold">
                  {it.kode}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{it.nama}</div>
                  <div className="text-xs text-gray-500">
                    Stok {it.stok} • {rp(it.hargaBeli)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <button className="flex items-center gap-3 text-green-700 hover:text-green-900 text-sm">
            <span className="w-10 h-10 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
              <FiPlus className="text-lg" />
            </span>
            <span className="font-semibold">Tambah Barang Baru</span>
          </button>
        </div>
      </div>

      <div className="w-[40%] flex flex-col p-6 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-white text-xs px-3 py-1 rounded-full">
              Draft
            </span>
            <button
              className="text-xs text-red-600 border border-red-400 px-3 py-1 rounded-full hover:bg-red-50"
              onClick={resetAll}
            >
              Batalkan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Urut:</label>
            <button
              className="text-xs border px-3 py-1 rounded-full hover:bg-gray-50 inline-flex items-center gap-1"
              onClick={() => setSortAsc((v) => !v)}
              title="Urut nama"
            >
              <HiArrowsUpDown /> Nama
            </button>
          </div>
        </div>

        <div className="rounded-xl border p-3 grid gap-3">
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
              <span className="text-xs text-gray-600">Diskon</span>
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
                  type="number"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  min={0}
                  value={discValue}
                  onChange={(e) => setDiscValue(e.target.value)}
                  placeholder="0"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-gray-600">Pajak (%)</span>
              <input
                type="number"
                className="border rounded-lg px-3 py-2 text-sm"
                min={0}
                value={taxPct}
                onChange={(e) => setTaxPct(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <div>
            <button
              onClick={openCost}
              className="text-xs inline-flex items-center gap-2 border px-3 py-1.5 rounded-full hover:bg-gray-50"
              title="Tambah biaya (ongkir/jasa)"
            >
              + Biaya (Ctrl+B)
            </button>
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

        <div className="flex-1 rounded-xl border p-3 overflow-auto">
          {cart.length === 0 ? (
            <div className="h-full border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500 text-sm">
              Belum ada barang yang dipilih
            </div>
          ) : (
            <div className="grid gap-2">
              {cart.map((row) => (
                <div
                  key={row.id}
                  className="border rounded-lg p-2 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {row.nama}
                    </div>
                    <div className="text-xs text-gray-500">
                      {row.kode} • {rp(row.harga)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border hover:bg-gray-50 flex items-center justify-center"
                      onClick={() => decQty(row.id)}
                      title="Kurangi"
                    >
                      <FiMinus />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) =>
                        setCart((prev) =>
                          prev.map((p) =>
                            p.id === row.id
                              ? { ...p, qty: Math.max(1, Number(e.target.value || 1)) }
                              : p
                          )
                        )
                      }
                      className="w-14 text-center border rounded-md py-1 text-sm"
                    />
                    <button
                      className="w-8 h-8 rounded-full border hover:bg-gray-50 flex items-center justify-center"
                      onClick={() => incQty(row.id)}
                      title="Tambah"
                    >
                      <FiPlusSm />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border hover:bg-red-50 text-red-600 flex items-center justify-center"
                      onClick={() => removeLine(row.id)}
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

        <div className="rounded-xl border overflow-hidden">
          <div className="bg-white px-4 py-3 grid gap-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{rp(subItems)}</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon {discType === "pct" ? `(${discValue || 0}%)` : ""}</span>
              <span className="font-medium text-amber-700">- {rp(totalDiskon)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak ({taxPct || 0}%)</span>
              <span className="font-medium text-blue-700">{rp(totalPajak)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya</span>
              <span className="font-medium text-teal-700">{rp(totalBiaya)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-green-600 text-white px-4 py-4">
            <span className="text-xl font-bold">{rp(grandTotal)}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(true)}
                className="text-sm font-bold bg-white/10 hover:bg-white/20 rounded-full px-4 py-2"
              >
                Bayar (F12)
              </button>
            </div>
          </div>
          <button
            onClick={() => handleSave(false)}
            className="w-full border-2 border-green-600 text-green-700 py-3 hover:bg-green-50 text-sm font-semibold rounded-b-xl"
          >
            SIMPAN
          </button>
        </div>
      </div>

      {costOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5">
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
                <span className="text-sm font-medium">Keterangan (opsional)</span>
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
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
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