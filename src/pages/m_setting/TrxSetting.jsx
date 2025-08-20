import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { MdSave, MdSettings, MdInfo } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/* ====== util kecil ====== */
const LS_KEY = "pos.trxSettings";

/* ====== komponen kecil ====== */
const Section = ({ title, desc, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
    <div className="mb-3">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

const Switch = ({ checked, onChange, label, note }) => (
    <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
            <div className="text-sm font-semibold text-gray-800">{label}</div>
            {note && <p className="text-sm text-gray-500 mt-1">{note}</p>}
        </div>
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-violet-500 transition-colors relative">
                <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        checked ? "translate-x-6" : ""
                    }`}
                ></span>
            </div>
            {/* <span className="ml-3 text-sm font-medium text-gray-700">
                {checked ? "Aktif" : "Nonaktif"}
            </span> */}
        </label>
    </div>
);

const Check = ({ checked, onChange, children }) => (
  <label className="inline-flex items-center gap-2">
    <input
      type="checkbox"
      className="w-5 h-5 accent-violet-600"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="text-sm text-gray-800">{children}</span>
  </label>
);

const Radio = ({ name, value, checked, onChange, children }) => (
  <label className="inline-flex items-center gap-2">
    <input
      type="radio"
      name={name}
      value={value}
      className="w-5 h-5 accent-violet-600"
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
    />
    <span className="text-sm text-gray-800">{children}</span>
  </label>
);

const TrxSetting = () => {
  const navigate = useNavigate();
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [itemView, setItemView] = useState("list"); // list | grid
  const [attr, setAttr] = useState({
    stok: true,
    diskon: true,
    harga: true,
    rak: false,
  });
  const [searchMode, setSearchMode] = useState({
    barangDefault: true,
    imei: false,
    varian: false,
    multisatuan: false,
  });
  const [showPriceTypeDialog, setShowPriceTypeDialog] = useState(false);
  const [showProfit, setShowProfit] = useState(true);
  const onBack = useCallback(() => navigate(-1), [navigate]);

  // load dari LS
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      setOnlineOnly(!!s.onlineOnly);
      setItemView(s.itemView || "list");
      setAttr({ stok: !!s.attr?.stok, diskon: !!s.attr?.diskon, harga: !!s.attr?.harga, rak: !!s.attr?.rak });
      setSearchMode({
        barangDefault: !!s.searchMode?.barangDefault,
        imei: !!s.searchMode?.imei,
        varian: !!s.searchMode?.varian,
        multisatuan: !!s.searchMode?.multisatuan,
      });
      setShowPriceTypeDialog(!!s.showPriceTypeDialog);
      setShowProfit(!!s.showProfit);
    } catch {}
  }, []);

  const onSave = useCallback(() => {
    const payload = {
      onlineOnly,
      itemView,
      attr,
      searchMode,
      showPriceTypeDialog,
      showProfit,
      saved_at: new Date().toISOString(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    onBack(); 
  }, [onlineOnly, itemView, attr, searchMode, showPriceTypeDialog, showProfit]);

  // useNavbar
  useNavbar(
    {
      variant: "page",
      title: "Pengaturan Transaksi",
      backTo: onBack,
      actions: [
        {
          type: "button",
          title: "Simpan",
          onClick: onSave,
          className:
            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700",
          icon: <MdSave className="text-lg" />,
          label: "Simpan",
        },
        // {
        //   type: "button",
        //   title: "Info",
        //   onClick: () => console.log("info"),
        //   className: "w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-gray-100",
        //   icon: <MdInfo className="text-2xl text-gray-700" />,
        // },
      ],
    },
    [onSave]
  );

  // helper setter
  const setAttrKey = (k, v) => setAttr((a) => ({ ...a, [k]: v }));
  const setSearchKey = (k, v) => setSearchMode((m) => ({ ...m, [k]: v }));

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* container */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* headline card */}
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
              PENGATURAN TRANSAKSI
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sesuaikan perilaku transaksi, tampilan item, dan preferensi pencarian.
            </p>
          </div>
        </div>

        {/* Mode Transaksi */}
        <Section
          title="Mode Transaksi"
          desc="Aktifkan mode full online agar transaksi hanya dapat dilakukan saat terhubung internet."
        >
          <Switch
            checked={onlineOnly}
            onChange={setOnlineOnly}
            label="Full Online"
            note="*Mengaktifkan mode online akan membuat transaksi hanya bisa dilakukan secara online."
          />
        </Section>

        {/* Tampilan Item Barang */}
        <Section title="Tampilan Item Barang">
          <div className="flex items-center gap-6">
            <Radio
              name="view"
              value="list"
              checked={itemView === "list"}
              onChange={(v) => setItemView(v)}
            >
              List
            </Radio>
            <Radio
              name="view"
              value="grid"
              checked={itemView === "grid"}
              onChange={(v) => setItemView(v)}
            >
              Grid
            </Radio>
          </div>
        </Section>

        {/* Atribut Item Barang */}
        <Section title="Atribut Item Barang">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Check checked={attr.stok} onChange={(v) => setAttrKey("stok", v)}>Sisa Stok</Check>
            <Check checked={attr.diskon} onChange={(v) => setAttrKey("diskon", v)}>Diskon</Check>
            <Check checked={attr.harga} onChange={(v) => setAttrKey("harga", v)}>Harga</Check>
            <Check checked={attr.rak} onChange={(v) => setAttrKey("rak", v)}>Letak Rak</Check>
          </div>
        </Section>

        {/* Mode Pencarian Barcode */}
        <Section
          title="Mode Pencarian Barcode Barang"
          desc="Aktifkan sumber barcode yang perlu dicocokkan saat scan. Mengaktifkan semua dapat memperlambat proses."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Check
              checked={searchMode.barangDefault}
              onChange={(v) => setSearchKey("barangDefault", v)}
            >
              Barang Default
            </Check>
            <Check checked={searchMode.imei} onChange={(v) => setSearchKey("imei", v)}>IMEI</Check>
            <Check checked={searchMode.varian} onChange={(v) => setSearchKey("varian", v)}>Varian</Check>
            <Check
              checked={searchMode.multisatuan}
              onChange={(v) => setSearchKey("multisatuan", v)}
            >
              Multisatuan
            </Check>
          </div>
          <p className="text-sm text-gray-500 italic mt-2">
            *Mengaktifkan semua dapat memperlambat proses pencarian Anda.
          </p>
        </Section>

        {/* Dialog Tipe Harga */}
        <Section title="Dialog Tipe Harga">
          <Check checked={showPriceTypeDialog} onChange={setShowPriceTypeDialog}>
            Selalu tampilkan dialog tipe harga
          </Check>
        </Section>

        {/* Potensi Untung */}
        <Section title="Potensi Untung">
          <Check checked={showProfit} onChange={setShowProfit}>
            Tampilkan potensi untung
          </Check>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Mode Stok Tracking</p>
            {/* <button
              className="w-full border border-gray-300 rounded-xl py-2.5 px-4 mt-2 text-left hover:bg-gray-50"
              onClick={() => alert("Modal pengaturan stok tracking (dummy)")}
            >
              Atur Mode Stok Tracking
            </button> */}
            <Link to={"/pengaturan/edittoko"} className="w-full block border border-gray-300 rounded-xl py-2.5 px-4 mt-2 text-left hover:bg-gray-50">
                Atur Mode Stok Tracking
            </Link>

          </div>
        </Section>

        {/* Footer actions (backup dari navbar) */}
        <div className="flex items-center justify-end">
          <button
            onClick={onSave}
            className="bg-violet-600 text-white py-3 px-6 rounded-xl text-base font-semibold hover:bg-violet-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrxSetting;
