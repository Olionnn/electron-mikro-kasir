import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Modal from "../../component/Modal";

export default function BiayaPage() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      const result = await window.electronAPI.getBiayaList({
        pagination: { limit: 50, page: 1 },
        filter: { search: searchTerm },
      });
      setExpenses(result?.data?.items || []);
    } catch (error) {
      console.error("Error fetching biaya:", error);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "F5") {
        e.preventDefault();
        fetchExpenses();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nama = newExpenseName.trim();
    const nominal = parseInt(newExpenseAmount, 10);

    if (!nama || isNaN(nominal)) return;

    try {
      setSaving(true);
      await window.electronAPI.createBiaya({ nama, nominal });
      setNewExpenseName("");
      setNewExpenseAmount("");
      setIsModalOpen(false);
      await fetchExpenses();
    } catch (err) {
      console.error("createBiaya error:", err);
      alert(err?.message || "Gagal menyimpan biaya");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/management" className="text-2xl text-gray-700 hover:text-green-600">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Biaya</h1>
        </div>
        <button
          className="text-green-600 hover:text-green-700 flex items-center gap-2"
          onClick={fetchExpenses}
          title="Refresh (F5)"
        >
          🔄 Refresh (F5)
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full flex flex-col bg-white border-x border-gray-200 rounded-t-2xl">
          
          {/* Search */}
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xl">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17.74 12.51a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari biaya…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-100 text-gray-500"
                    title="Bersihkan"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  {expenses.length} biaya
                </span>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-auto p-4">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4 h-24 w-24 rounded-2xl bg-green-100 flex items-center justify-center text-4xl">
                  💸
                </div>
                <div className="text-xl font-semibold text-gray-700 mb-1">Belum ada data</div>
                <div className="text-gray-500 mb-4">Silakan tambah biaya terlebih dahulu</div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-green-600 hover:bg-green-700"
                >
                  ＋ Tambah Biaya
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {expenses.map((exp) => (
                  <div key={exp.id} className="group flex justify-between items-center border rounded-xl p-4 hover:shadow-sm transition">
                    <div>
                      <div className="font-semibold text-gray-800">{exp.nama}</div>
                      <div className="text-sm text-gray-500">
                        Rp {exp.nominal.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tambah */}
          <div className="border-t p-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl font-semibold transition-colors"
            >
              TAMBAH BIAYA
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={isModalOpen} title="Tambah Biaya" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700">Nama Biaya</label>
            <input
              id="expenseName"
              type="text"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="cth: Biaya Listrik"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="expenseAmount" className="block text-sm font-medium text-gray-700">Nominal</label>
            <input
              id="expenseAmount"
              type="number"
              min="0"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder="cth: 50000"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
              Batal
            </button>
            <button
              type="submit"
              disabled={!newExpenseName.trim() || !newExpenseAmount.trim() || saving}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
