import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MdAdd, MdRefresh, MdFilterList, MdEdit } from "react-icons/md";
import Modal from "../../component/Modal";
import { useNavbar } from "../../hooks/useNavbar";

const cx = (...a) => a.filter(Boolean).join(" ");
const fmtRp = (n) => new Intl.NumberFormat("id-ID").format(Number(n || 0));
const showValue = (type, val) => type === "pct" ? `${val}%` : `Rp ${fmtRp(val)}`;

const emptyPromotion = {
  id: "",
  name: "",
  type: "pct", // pct = persen, rp = nominal
  value: "",
  img: "",
  description: "",
};

export default function PromosiPage() {
  const [promotions, setPromotions] = useState([
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
  ]);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [formAdd, setFormAdd] = useState(emptyPromotion);
  const [formEdit, setFormEdit] = useState(emptyPromotion);

  const addFocusRef = useRef(null);
  const editFocusRef = useRef(null);

  const openTambah = useCallback(() => {
    setFormAdd({ ...emptyPromotion });
    setOpenAdd(true);
  }, []);

  const doRefresh = useCallback(() => {
    setSelected(null);
  }, []);

  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Tambah Promosi",
        onClick: openTambah,
        className:
          "inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700",
        icon: <MdAdd size={20} />,
      },
      {
        type: "button",
        title: "Refresh",
        onClick: doRefresh,
        className:
          "inline-flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100",
        icon: <MdRefresh size={20} />,
      },
    ],
    [openTambah, doRefresh]
  );

  useNavbar({ variant: "page", title: "Promosi", backTo: "/management", actions }, [actions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return promotions;
    return promotions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.value).includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [promotions, search]);

  const handleSaveAdd = () => {
    if (!formAdd.id || !formAdd.name) return alert("ID dan Nama wajib diisi");
    setPromotions((prev) => [formAdd, ...prev]);
    setOpenAdd(false);
  };

  const handleSaveEdit = () => {
    setPromotions((prev) => prev.map((p) => (p.id === formEdit.id ? formEdit : p)));
    setOpenEdit(false);
  };

  const handleOpenEdit = () => {
    if (!selected) return;
    setFormEdit({ ...selected });
    setOpenEdit(true);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* KIRI */}
      <div className="w-1/2 border-r flex flex-col bg-white">
        <div className="p-4 border-b">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari promosi…"
            className="w-full h-11 pl-4 pr-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="mt-2 text-xs text-gray-500">
            Menampilkan <b>{filtered.length}</b> dari {promotions.length} promosi
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Tidak ada promosi yang cocok.
            </div>
          ) : (
            filtered.map((p) => {
              const active = selected?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className={cx(
                    "w-full text-left rounded-xl border transition",
                    active
                      ? "border-green-500 ring-1 ring-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center p-3 gap-3">
                    <img src={p.img} alt="" className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{p.name}</div>
                      <div className="text-xs text-gray-500">
                        {showValue(p.type, p.value)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* KANAN */}
      <div className="w-1/2 p-6">
        {selected ? (
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selected.name}</h2>
                <div className="text-gray-600">{showValue(selected.type, selected.value)}</div>
              </div>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 bg-white border border-green-500 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50"
              >
                <MdEdit size={18} /> Edit
              </button>
            </div>

            <img src={selected.img} alt="" className="w-32 h-32 rounded object-cover" />

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Deskripsi</h3>
              <p className="text-gray-800">{selected.description || "-"}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Pilih salah satu promosi untuk melihat detail.
          </div>
        )}
      </div>

      {/* Modal Add */}
      <Modal open={openAdd} title="Tambah Promosi" onClose={() => setOpenAdd(false)} initialFocusRef={addFocusRef}>
        <PromotionForm form={formAdd} setForm={setFormAdd} onSubmit={handleSaveAdd} submitText="Simpan" initialFocusRef={addFocusRef} />
      </Modal>

      {/* Modal Edit */}
      <Modal open={openEdit} title="Edit Promosi" onClose={() => setOpenEdit(false)} initialFocusRef={editFocusRef}>
        <PromotionForm form={formEdit} setForm={setFormEdit} onSubmit={handleSaveEdit} submitText="Update" initialFocusRef={editFocusRef} />
      </Modal>
    </div>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function PromotionForm({ form, setForm, onSubmit, submitText, initialFocusRef }) {
  const txt = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-1 gap-3"
    >
      <Labeled label="ID *">
        <input
          ref={initialFocusRef}
          value={form.id}
          onChange={txt("id")}
          placeholder="cth: PROMO4"
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </Labeled>
      <Labeled label="Nama *">
        <input
          value={form.name}
          onChange={txt("name")}
          placeholder="cth: Promo Spesial"
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </Labeled>
      <Labeled label="Jenis">
        <select
          value={form.type}
          onChange={txt("type")}
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        >
          <option value="pct">Persentase (%)</option>
          <option value="rp">Nominal (Rp)</option>
        </select>
      </Labeled>
      <Labeled label="Nilai *">
        <input
          value={form.value}
          onChange={txt("value")}
          type="number"
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </Labeled>
      <Labeled label="Gambar URL">
        <input
          value={form.img}
          onChange={txt("img")}
          placeholder="https://..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </Labeled>
      <Labeled label="Deskripsi">
        <textarea
          value={form.description}
          onChange={txt("description")}
          className="w-full px-3 py-2 border rounded-lg focus:outline-green-500"
        />
      </Labeled>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => history.back()}>
          Batal
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
          {submitText}
        </button>
      </div>
    </form>
  );
}
