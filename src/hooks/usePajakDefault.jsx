import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";
import { getAccessToken } from "../utils/jwt";

const pajakdefaultIpc = {
  getList: (params) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getPajakDefaultList(params, token);
  },
  getById: (id) => {
        const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getPajakDefaultById(id, token);
  },
  create: (data) => {
        const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.createPajakDefault(data, token);
  },
  update: (id, data) => {
        const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.updatePajakDefault( id, data, token );
  },
  remove: (id) => {
      const token = getAccessToken();
      if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
      return window.electronAPI.deletePajakDefault(id, token);
  },
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nominal_persen: p.nominal_persen ?? true,
  created_by: p.created_by ?? 0,
  updated_by: p.updated_by ?? 1,
  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    nominal_persen: r.nominal_persen ?? true,
    created_by: r.created_by ?? 0,
    updated_by: r.updated_by ?? 1,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
    c  
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};

export function usePajakDefault(initialParams = DEFAULT_PARAMS) {
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

      const res = await pajakdefaultIpc.getList(paramsRef.current);
      if (!res?.success) throw new Error(res?.error || "Gagal memuat pajakdefault");
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
      const res = await pajakdefaultIpc.create(toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal membuat pajakdefault");
      const created = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const res = await pajakdefaultIpc.update(id, toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal mengubah pajakdefault");
      const updated = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      const res = await pajakdefaultIpc.remove(id);
      if (!res?.success) throw new Error(res?.error || "Gagal menghapus pajakdefault");
      const removed = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return removed;
    },
    [refresh]
  );

  const getById = useCallback(async (id) => {
    const res = await pajakdefaultIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil pajakdefault");
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
