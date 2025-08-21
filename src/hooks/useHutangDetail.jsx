import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";
import { getAccessToken } from "../utils/jwt";


const hutangDetailIpc = {
  getList: (params) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getHutangDetailList(params, token);
  },
  getById: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getHutangDetailById(id, token);
  },
  create: (data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.createHutangDetail(data, token);
  },
  update: (id, data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.updateHutangDetail( id, data, token);
  },
  remove: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.deleteHutangDetail(id)},
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  hutang_id: p.hutang_id? true : 0,
  nominal_hutang: p.nominal_hutang ?? 0,
  nominal_bayar: p.nominal_bayar ?? 0,
  jatuh_tempo: p.jatuh_tempo ?? "",
  tanggal_bayar: p.tanggal_bayar ?? "",
  status_hutang: p.status_hutang ?? true,
  pembelian_id: p.pembelian_id ?? 0,
  metode_bayar: p.metode_bayar ?? "",
  keterangan: p.keterangan ?? "",
  no_struk: p.no_struk ?? "",
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    nama: r.nama ?? "",
    toko_id: r.toko_id ?? "",
    hutang_id: r.hutang_id? true : 0,
    nominal_hutang: r.nominal_hutang ?? 0,
    nominal_bayar: r.nominal_bayar ?? 0,
    jatuh_tempo: r.jatuh_tempo ?? "",
    tanggal_bayar: r.tanggal_bayar ?? "",
    status_hutang: r.status_hutang ?? true,
    pembelian_id: r.pembelian_id ?? 0,
    metode_bayar: r.metode_bayar ?? "",
    keterangan: r.keterangan ?? "",
    no_struk: r.no_struk ?? "",
    created_by: r.created_by ?? 1,
    updated_by: r.updated_by ?? 1,
    sync_at: r.sync_at ?? null,
    status: r.status ?? true,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
      
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};

export function useHutangDetail(initialParams = DEFAULT_PARAMS) {
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

      const res = await hutangDetailIpc.getList(paramsRef.current);
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
      const res = await hutangDetailIpc.create(toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal membuat pajak");
      const created = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const res = await hutangDetailIpc.update(id, toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal mengubah pajak");
      const updated = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      const res = await hutangDetailIpc.remove(id);
      if (!res?.success) throw new Error(res?.error || "Gagal menghapus pajak");
      const removed = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return removed;
    },
    [refresh]
  );

  const getById = useCallback(async (id) => {
    const res = await hutangDetailIpc.getById(id);
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