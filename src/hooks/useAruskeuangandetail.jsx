import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";
import { getAccessToken } from "../utils/jwt";


const aruskeuangandetailIpc = {
  getList: (params) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getArusKeuanganDetailList(params, token);
  },
  getById: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getArusKeuanganDetailById(id, token);
  },
  create: (data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.createArusKeuanganDetail(data, token);
  },
  update: (id, data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.updateArusKeuanganDetail( id, data, token);
  },
  remove: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.deleteArusKeuanganDetail(id, token);
  },
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  arus_keuangan_id: p.arus_keuangan_id ?? true,
  supplier_id: p.supplier_id ?? 0,
  pelanggan_id: p.pelanggan_id ?? 1,
  jenis: p.jenis ?? 1,
  tipe: p.tipe ?? null,
  tanggal: p.tanggal ?? true,
  nominal: p.nominal ?? true,
  catatan: p.catatan ?? true,
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
  arus_keuangan_id: r.arus_keuangan_id ?? true,
  supplier_id: r.supplier_id ?? 0,
  pelanggan_id: r.pelanggan_id ?? 1,
  jenis: r.jenis ?? 1,
  tipe: r.tipe ?? null,
  tanggal: r.tanggal ?? true,
  nominal: r.nominal ?? true,
  catatan: r.catatan ?? true,
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

export function useArusKeuanganDetail(initialParams = DEFAULT_PARAMS) {
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

      const res = await aruskeuangandetailIpc.getList(paramsRef.current);
      if (!res?.success) throw new Error(res?.error || "Gagal memuat pajak");
      // Server returns: res.data = { data: [...], pagination: {...} }
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
      const res = await aruskeuangandetailIpc.create(toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal membuat pajak");
      const created = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const res = await aruskeuangandetailIpc.update(id, toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal mengubah pajak");
      const updated = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      const res = await aruskeuangandetailIpc.remove(id);
      if (!res?.success) throw new Error(res?.error || "Gagal menghapus pajak");
      const removed = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return removed;
    },
    [refresh]
  );

  const getById = useCallback(async (id) => {
    const res = await aruskeuangandetailIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil pajak");
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
    refresh,
    create,
    update,
    remove,
    getById,
  };
}