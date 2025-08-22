// src/hooks/useBarang.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";
import { getAccessToken } from "../utils/jwt";

/** ---------------------- IPC Bridge (Electron) ------------------------ */
const barangIpc = {
  getList: (params) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getBarangList(params, token);
  },
  getById: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getBarangById(id, token);
  },
  create: (data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.createBarang(data, token);
  },
  update: (id, data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.updateBarang(id, data, token);
  },
  remove: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.deleteBarang(id, token);
  },
};

/** ---------------------- Mapper <-> Backend --------------------------- */
const toBoolean = (v, def = false) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return ["true", "1", "ya", "yes"].includes(v.toLowerCase());
  return def;
};

const toNumber = (v, def = 0) => {
  if (v === "" || v == null) return def;
  const n = Number(v);
  return Number.isNaN(n) ? def : n;
};

const toString = (v, def = "") => (v == null ? def : String(v));

const toBackend = (p = {}) => ({
  toko_id: toNumber(p.toko_id, 0),
  kategori_id: p.kategori_id == null || p.kategori_id === "" ? null : toNumber(p.kategori_id),
  nama: toString(p.nama, ""),
  stok: toNumber(p.stok, 0),
  kode: toString(p.kode, ""),
  harga_dasar: p.harga_dasar == null || p.harga_dasar === "" ? null : toNumber(p.harga_dasar),
  harga_jual: p.harga_jual == null || p.harga_jual === "" ? null : toNumber(p.harga_jual),
  image: toString(p.image, ""),
  show_transaksi: toBoolean(p.show_transaksi, true),
  use_stok: toBoolean(p.use_stok, true),
  created_by: p.created_by == null || p.created_by === "" ? null : toNumber(p.created_by),
  updated_by: p.updated_by == null || p.updated_by === "" ? null : toNumber(p.updated_by),
  sync_at: p.sync_at || null,
  status: toBoolean(p.status, true),
});

const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? null,
    kategori_id: r.kategori_id ?? null,
    nama: r.nama ?? "",
    stok: toNumber(r.stok, 0),
    kode: r.kode ?? "",
    harga_dasar: r.harga_dasar == null ? 0 : toNumber(r.harga_dasar, 0),
    harga_jual: r.harga_jual == null ? 0 : toNumber(r.harga_jual, 0),
    image: r.image ?? "",
    show_transaksi: toBoolean(r.show_transaksi, true),
    use_stok: toBoolean(r.use_stok, true),
    created_by: r.created_by ?? null,
    updated_by: r.updated_by ?? null,
    sync_at: r.sync_at ?? null,
    status: toBoolean(r.status, true),

    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
  };
};

/** ---------------------- Default Params ------------------------------- */
const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: {
    search: "",
    status: "",
    toko_id: "",
    kategori_id: "",
    show_transaksi: "",
    use_stok: "",
    stokMin: "",
    stokMax: "",
  },
};

/** ---------------------------- Hook ---------------------------------- */
export function useBarang(initialParams = DEFAULT_PARAMS) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsRef = useRef(initialParams);

  const refresh = useCallback(async (nextParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Merge params (pagination + filter)
      paramsRef.current = {
        ...paramsRef.current,
        ...nextParams,
        pagination: {
          ...paramsRef.current.pagination,
          ...(nextParams.pagination || {}),
        },
        filter: {
          ...paramsRef.current.filter,
          ...(nextParams.filter || {}),
        },
      };

      // Bersihkan filter numeric (string kosong -> hapus)
      const cleanedFilter = { ...paramsRef.current.filter };
      ["stokMin", "stokMax", "toko_id", "kategori_id"].forEach((k) => {
        if (cleanedFilter[k] === "") delete cleanedFilter[k];
      });

      const res = await barangIpc.getList({
        ...paramsRef.current,
        filter: cleanedFilter,
      });
      if (!res?.success) throw new Error(res?.error || "Gagal memuat barang");

      // Server returns flexible shape:
      // { data: { data:[...], pagination:{...} } } OR { data:[...], pagination:{...} } OR { items:[...] }
      const payload = res.data || {};
      const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(res.items)
        ? res.items
        : [];

      const pager = payload.pagination || res.pagination || {};
      const page = pager.page ?? paramsRef.current.pagination.page ?? 1;
      const limit = pager.limit ?? paramsRef.current.pagination.limit ?? 10;
      const total =
        pager.total ??
        (typeof pager.totalRows === "number" ? pager.totalRows : list.length);
      const pages = pager.pages ?? Math.max(1, Math.ceil((total || 0) / (limit || 10)));

      setItems(list.map(fromBackend));
      setPagination({ page, limit, total, pages });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload) => {
      const res = await barangIpc.create(toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal membuat barang");
      await refresh();
      const created = (res.data && (res.data.item || res.data.data)) || null;
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const res = await barangIpc.update(id, toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal mengubah barang");
      await refresh();
      const updated = (res.data && (res.data.item || res.data.data)) || null;
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      const res = await barangIpc.remove(id);
      if (!res?.success) throw new Error(res?.error || "Gagal menghapus barang");
      await refresh();
      const removed = (res.data && (res.data.item || res.data.data)) || null;
      return removed;
    },
    [refresh]
  );

  const getById = useCallback(async (id) => {
    const res = await barangIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil barang");
    const raw = (res.data && (res.data.item || res.data.data)) || res.item || null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => {
    refresh(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items,
    pagination,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    getById,
    setItems, // expose jika butuh manipulasi lokal (jarang)
    paramsRef,
  };
}