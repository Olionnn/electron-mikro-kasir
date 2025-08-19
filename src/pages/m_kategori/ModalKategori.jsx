import React from "react";

function ModalAddKategori({
  isModalOpen,
  setIsModalOpen,
  newCategoryName,
  setNewCategoryName,
  addKategori,
  saving,
}) {
  return (
    <Modal
      open={isModalOpen}
      title="Tambah Kategori"
      onClose={() => setIsModalOpen(false)}
    >
      <form onSubmit={addKategori} className="space-y-4">
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-slate-700"
          >
            Nama Kategori
          </label>
          <input
            id="categoryName"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="cth: Makanan, Elektronik, ATK..."
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            data-autofocus
            required
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-xl px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
          <button
            type="submit"
            disabled={!newCategoryName.trim() || saving}
            className="rounded-xl px-4 py-2.5 text-white disabled:opacity-60 disabled:cursor-not-allowed gradient-btn"
          >
            {saving ? "Menyimpan..." : "Tambah"}
          </button>
            {saving ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


function ModalEditKategori({
  isModalOpen,
  setIsModalOpen,
  selectedCategory,
  updateKategori,
  saving,
}) {
  return (
    <Modal
      open={isModalOpen}
      title={`Edit Kategori: ${selectedCategory.nama}`}
      onClose={() => setIsModalOpen(false)}
    >
      <form onSubmit={updateKategori} className="space-y-4">
        <div>
          <label
            htmlFor="editCategoryName"
            className="block text-sm font-medium text-slate-700"
          >
            Nama Kategori
          </label>
          <input
            id="editCategoryName"
            type="text"
            defaultValue={selectedCategory.nama}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-[color:var(--blue-700)] focus:ring-2 focus:ring-[color:var(--purple-200)]/60"
            data-autofocus
            required
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-xl px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl px-4 py-2.5 text-white disabled:opacity-60 disabled:cursor-not-allowed gradient-btn"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export { ModalAddKategori, ModalEditKategori };
