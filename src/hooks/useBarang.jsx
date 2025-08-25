import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";
import { getAccessToken } from "../utils/jwt";

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

const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  kategori_id: p.kategori_id ?? true,
  nama: p.nama ?? 0,
  stok: p.stok ?? 1,
  kode: p.kode ?? 1,
  harga_dasar: p.harga_dasar ?? null,
  harga_jual: p.harga_jual ?? true,
  image: p.image ?? true,
  show_transaksi: p.show_transaksi ?? true,
  use_stok: p.use_stok ?? true,
  created_by: p.created_by ?? true,
  updated_by: p.updated_by ?? true,
  sync_at: p.sync_at ?? true,
  status: p.status ?? true,
});

const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    kategori_id: r.kategori_id ?? true,
    nama: r.nama ?? 0,
    stok: r.stok ?? 1,
    kode: r.kode ?? 1,
    harga_dasar: r.harga_dasar ?? null,
    harga_jual: r.harga_jual ?? true,
    image: r.image ?? true,
    show_transaksi: r.show_transaksi ?? true,
    use_stok: r.use_stok ?? true,
    created_by: r.created_by ?? true,
    updated_by: r.updated_by ?? true,
    sync_at: r.sync_at ?? true,
    status: r.status ?? true,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};

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
    const [alert, setAlert] = useState(null);
  const paramsRef = useRef(initialParams);

  const refresh = useCallback(async (nextParams = {}) => {
    setLoading(true);
    setError(null);
    try {
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

      const res = await barangIpc.getList(paramsRef.current);
      if (!res?.success) throw new Error(res?.error || "Gagal memuat barang");
      const payload = res.data || {};
      const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.items)
        ? payload.items
        : [];
      const pager = payload.pagination || {};
      const page = pager.page ?? paramsRef.current.pagination.page ?? 1;
      const limit = pager.limit ?? paramsRef.current.pagination.limit ?? 10;
      const total =
        pager.total ?? (typeof pager.totalRows === "number" ? pager.totalRows : list.length);
      const pages = pager.pages ?? Math.max(1, Math.ceil((total || 0) / (limit || 10)));
      setItems(list.map(fromBackend));
      setPagination({ page, limit, total, pages });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setAlert({ type: "error", message: "Gagal memuat barang" });
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload) => {
      const res = await barangIpc.create(toBackend(payload));
      if (!res?.success) {
        setAlert({ type: "error", message: res?.error || "Gagal menambahkan barang" });
        throw new Error(res?.error || "Gagal menambahkan barang");
      }
      const created = (res.data && (res.data.items || res.data.data)) || null;
      setAlert({ type: "success", message: "Barang berhasil ditambahkan!" });
      await refresh();
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const res = await barangIpc.update(id, toBackend(payload));
      if (!res?.success) {
        setAlert({ type: "error", message: res?.error || "Gagal mengubah barang" });
        throw new Error(res?.error || "Gagal mengubah barang");
      }
      const updated = (res.data && (res.data.items || res.data.data)) || null;
      setAlert({ type: "success", message: "Barang berhasil diubah!" });
      await refresh();
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      const res = await barangIpc.remove(id);
      if (!res?.success) {
        setAlert({ type: "error", message: res?.error || "Gagal menghapus barang" });
        throw new Error(res?.error || "Gagal menghapus barang");
      }
      const removed = (res.data && (res.data.items || res.data.data)) || null;
      setAlert({ type: "success", message: "Barang berhasil dihapus!" });
      await refresh();
      return removed;
    },
    [refresh]
  );

  const getById = useCallback(async (id) => {
    const res = await barangIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil barang");
    const raw = (res.data && (res.data.items || res.data.data || res.data.item)) || null;
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
    alert,
    refresh,
    create,
    update,
    remove,
    getById,
    setAlert,
  };
}
