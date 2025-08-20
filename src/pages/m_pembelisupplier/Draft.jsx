import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

const LS_LIST = "pembelian.list";
const LS_CURRENT = "pembelian.current";

const rp = (n) =>
  `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

export default function DraftPembelianPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);

  // state: item terpilih untuk panel kanan
  const [selected, setSelected] = useState(null);

  // load semua pembelian yg tersimpan
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(LS_LIST) || "[]");
      setList(Array.isArray(arr) ? arr : []);
    } catch {
      setList([]);
    }
  }, []);

  const drafts = useMemo(
    () => (list || []).filter((r) => r.status === "draft"),
    [list]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return drafts;
    return drafts.filter(
      (d) =>
        (d.no_struk || "").toLowerCase().includes(s) ||
        (d.supplier_name || "").toLowerCase().includes(s)
    );
  }, [drafts, q]);

  // jika hasil filter berubah, pertahankan pilihan bila masih ada; kalau tidak, pilih yang pertama
  useEffect(() => {
    if (!filtered.length) {
      setSelected(null);
      return;
    }
    if (selected) {
      const stillExists = filtered.some((r) => r.id === selected.id);
      if (!stillExists) setSelected(filtered[0]);
    } else {
      setSelected(filtered[0]);
    }
  }, [filtered]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const payload = { ...row, status: "paid" };
    localStorage.setItem(LS_CURRENT, JSON.stringify(payload));
    localStorage.setItem("pembelian.current", JSON.stringify(payload));
    navigate("/trx");
  };

  // Delete draft
  const onDeleteDraft = (id) => {
    if (!window.confirm("Hapus draft ini?")) return;
    const next = (list || []).filter((r) => r.id !== id);
    setList(next);
    localStorage.setItem(LS_LIST, JSON.stringify(next));
    // bersihkan panel kanan kalau yang dihapus adalah yang sedang dipilih
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="w-full h-full flex overflow-hidden bg-white">
      {/* Panel Kiri: Filter/Search + List */}
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
          {filtered.map((row) => {
            const active = selected?.id === row.id;
            return (
              <div
                key={row.id}
                className={`rounded-lg p-4 shadow-sm border mb-3 cursor-pointer ${
                  active ? "bg-violet-50 border-violet-300" : "bg-gray-50"
                }`}
                onClick={() => setSelected(row)}
                title="Lihat detail"
              >
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
                  {row.items?.length || 0} Item · {rp(row.total || 0)}
                </div>
                <div className="text-xs text-gray-500">No Struk: {row.no_struk}</div>

                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-full border hover:bg-gray-50 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDraft(row);
                    }}
                    title="Edit draft"
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-full border hover:bg-green-50 text-green-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPayDraft(row);
                    }}
                    title="Bayar sekarang"
                  >
                    Bayar
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-full border hover:bg-red-50 text-red-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDraft(row.id);
                    }}
                    title="Hapus draft"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              Belum ada draft.
            </div>
          )}
        </div>
      </div>

      {/* Panel Kanan: Detail Draft Terpilih */}
      <div className="w-1/2 flex items-stretch justify-stretch">
        {!selected ? (
          <div className="m-auto text-center text-gray-400">
            <div className="text-lg font-semibold">Pilih draft di kiri</div>
            <div className="text-sm">Detail akan tampil di sini.</div>
          </div>
        ) : (
          <div className="w-full h-full p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500">Supplier</div>
                <div className="text-lg font-semibold">
                  {selected.supplier_name || "Tanpa Supplier"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(selected.tanggal_waktu).toLocaleString("id-ID")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">No Struk</div>
                <div className="font-mono text-sm">{selected.no_struk}</div>
                <div className="mt-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {selected.status || "draft"}
                  </span>
                </div>
              </div>
            </div>

            {/* Ringkasan Angka */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="border rounded-lg p-3 bg-white">
                <div className="text-xs text-gray-500">Subtotal (sebelum pajak & biaya)</div>
                <div className="text-base font-semibold">
                  {rp(
                    Math.max(
                      0,
                      (Number(selected.total || 0) || 0) -
                        (Number(selected.total_pajak || 0) || 0) -
                        (Number(selected.nominal_biaya || 0) || 0)
                    )
                  )}
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-white">
                <div className="text-xs text-gray-500">Diskon</div>
                <div className="text-base font-semibold text-amber-700">
                  - {rp(selected.total_diskon || 0)}
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-white">
                <div className="text-xs text-gray-500">Pajak</div>
                <div className="text-base font-semibold text-blue-700">
                  {rp(selected.total_pajak || 0)}
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-white">
                <div className="text-xs text-gray-500">Biaya</div>
                <div className="text-base font-semibold text-teal-700">
                  {rp(selected.nominal_biaya || 0)}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-3 border rounded-lg p-3 bg-violet-50 border-violet-200 flex items-center justify-between">
              <div className="font-semibold">TOTAL</div>
              <div className="text-xl font-bold text-violet-700">
                {rp(selected.total || 0)}
              </div>
            </div>

            {/* Daftar Item */}
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Item ({selected.items?.length || 0})</div>
              <div className="space-y-2">
                {(selected.items || []).map((it, idx) => (
                  <div
                    key={`${it.barang_id || it.id}-${idx}`}
                    className="border rounded-lg p-2 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {it.nama}
                        </div>
                        <div className="text-xs text-gray-500">
                          {it.kode} • {rp(it.harga_beli || it.harga || 0)} × {it.qty}
                          {Number(it.diskon_per_qty_pct || 0) > 0 && (
                            <span className="ml-2 text-violet-700">
                              • Disc/qty: {it.diskon_per_qty_pct}%
                            </span>
                          )}
                          {Number(it.diskon_per_qty_rp || 0) > 0 && (
                            <span className="ml-2 text-violet-700">
                              • Disc/qty: {rp(it.diskon_per_qty_rp)}
                            </span>
                          )}
                          {it.note && (
                            <span className="ml-2 text-gray-400">• {it.note}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {rp(it.subtotal || (Number(it.harga_beli || it.harga || 0) * Number(it.qty || 0)))}
                      </div>
                    </div>
                  </div>
                ))}
                {(selected.items || []).length === 0 && (
                  <div className="text-sm text-gray-500 py-6 text-center">
                    Tidak ada item.
                  </div>
                )}
              </div>
            </div>

            {/* Aksi */}
            <div className="mt-5 flex gap-2">
              <button
                className="px-4 py-2 rounded-full border hover:bg-gray-50"
                onClick={() => onEditDraft(selected)}
                title="Edit draft"
              >
                Edit
              </button>
              <button
                className="px-4 py-2 rounded-full border text-green-700 hover:bg-green-50"
                onClick={() => onPayDraft(selected)}
                title="Bayar sekarang"
              >
                Bayar
              </button>
              <button
                className="px-4 py-2 rounded-full border text-red-600 hover:bg-red-50"
                onClick={() => onDeleteDraft(selected.id)}
                title="Hapus draft"
              >
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}