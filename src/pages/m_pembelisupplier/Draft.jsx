import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdSearch, MdShare, MdPrint, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

const LS_LIST = "pembelian.list";
const LS_CURRENT = "pembelian.current";

export default function DraftPembelianPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);

  // load semua pembelian yg tersimpan
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(LS_LIST) || "[]");
      setList(Array.isArray(arr) ? arr : []);
    } catch { setList([]); }
  }, []);

  const drafts = useMemo(
    () => (list || []).filter(r => r.status === "draft"),
    [list]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return drafts;
    return drafts.filter(d =>
      (d.no_struk || "").toLowerCase().includes(s) ||
      (d.supplier_name || "").toLowerCase().includes(s)
    );
  }, [drafts, q]);

  // Navbar
  const onBack = useCallback(() => navigate(-1), [navigate]);
  useNavbar(
    {
      variant: "page",
      title: "Draft Pembelian",
      backTo: onBack,
      actions: [],
      rightExtra: null,
    },
    [onBack]
  );

  // Aksi: Edit → buka kembali form pembelian & isi dari draft
  const onEditDraft = (row) => {
    localStorage.setItem(LS_CURRENT, JSON.stringify(row));
    navigate("/pembelian-supplier"); // form akan prefill dari LS_CURRENT
  };

  // Aksi: Bayar → kirim ke transaksi
  const onPayDraft = (row) => {
    // pastikan current terisi agar Trx.jsx bisa baca
    localStorage.setItem(LS_CURRENT, JSON.stringify({ ...row, status: "paid" }));
    localStorage.setItem("pembelian.current", JSON.stringify({ ...row, status: "paid" }));
    navigate("/trx");
  };

  // (Opsional) Delete draft
  const onDeleteDraft = (id) => {
    if (!window.confirm("Hapus draft ini?")) return;
    const next = (list || []).filter(r => r.id !== id);
    setList(next);
    localStorage.setItem(LS_LIST, JSON.stringify(next));
  };

  return (
    <div className="w-full h-full flex overflow-hidden bg-white">
      {/* Panel Kiri: Filter/Search */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="flex items-center px-4 py-2 gap-2 border-b border-gray-100">
          <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden">
            <MdSearch className="mx-2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari Draft / Supplier / No Struk"
              className="w-full py-2 text-sm outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {/* List Draft */}
        <div className="px-4 pb-4 overflow-y-auto">
          {filtered.map((row) => (
            <div key={row.id} className="bg-gray-50 rounded-lg p-4 shadow-sm border mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                  Draft
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(row.tanggal_waktu).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mt-1 text-sm text-gray-800 font-medium">
                {row.supplier_name || "Tanpa Supplier"}
              </div>
              <div className="text-xs text-gray-500">
                {row.items?.length || 0} Item · {Intl.NumberFormat("id-ID").format(row.total || 0)}
              </div>
              <div className="text-xs text-gray-500">No Struk: {row.no_struk}</div>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-full border hover:bg-gray-50 text-sm"
                  onClick={() => onEditDraft(row)}
                  title="Edit draft"
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 rounded-full border hover:bg-green-50 text-green-700 text-sm"
                  onClick={() => onPayDraft(row)}
                  title="Bayar sekarang"
                >
                  Bayar
                </button>
                <button
                  className="px-3 py-1.5 rounded-full border hover:bg-red-50 text-red-600 text-sm"
                  onClick={() => onDeleteDraft(row.id)}
                  title="Hapus draft"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              Belum ada draft.
            </div>
          )}
        </div>
      </div>

      {/* Panel Kanan: (opsional) ringkas pilihannya */}
      <div className="w-1/2 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-lg font-semibold">Pilih draft di kiri</div>
          <div className="text-sm">Edit untuk melanjutkan, atau bayar langsung.</div>
        </div>
      </div>
    </div>
  );
}