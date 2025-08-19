// { success: true, data: { items: [...] }, pagination?: {...} }

import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";

// --- IPC bridge ---
const kategoriIpc = {
  getList: (params) => window.electronAPI.getKategoriList(params),
  getById: (id) => window.electronAPI.getKategoriById(id),
  create: (data) => window.electronAPI.createKategori(data),
  update: (id, data) => window.electronAPI.updateKategori(id, data),
  remove: (id) => window.electronAPI.deleteKategori(id),
};



const toBackend = (p = {}) => ({
  nama: p.nama ?? "",
  status: p.status ?? true,
  toko_id: p.toko_id ?? "",
});
const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    nama: r.nama ?? "",
    status: r.status ?? true,
    toko_id: r.toko_id ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
  };
};

// --- defaults ---
const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};

export function useKategori(initialParams = DEFAULT_PARAMS) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsRef = useRef(initialParams);

  const refresh = useCallback(async (nextParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // merge tipis
      paramsRef.current = {
        ...paramsRef.current,
        ...nextParams,
        pagination: { ...paramsRef.current.pagination, ...(nextParams.pagination || {}) },
        filter: { ...paramsRef.current.filter, ...(nextParams.filter || {}) },
      };

      const res = await kategoriIpc.getList(paramsRef.current);
      if (!res?.success) throw new Error(res?.error || "Gagal memuat kategori");

      const list = res.data?.items ?? [];
      const pager = res.pagination ?? {};

      const page = pager.page ?? paramsRef.current.pagination.page ?? 1;
      const limit = pager.limit ?? paramsRef.current.pagination.limit ?? 10;
      const total = pager.total ?? list.length;
      const pages = pager.pages ?? Math.max(1, Math.ceil(total / limit));

      setItems(list.map(fromBackend));

      setPagination({ page, limit, total, pages });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const res = await kategoriIpc.create(toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal membuat kategori");
    await refresh();
    return res.data; // bisa { item } sesuai backend Anda
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const res = await kategoriIpc.update(id, toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal mengubah kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await kategoriIpc.remove(id);
    if (!res?.success) throw new Error(res?.error || "Gagal menghapus kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const getById = useCallback(async (id) => {
    const res = await kategoriIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil kategori");
    // backend Anda saat ini mengirim { data: { items: <obj> } } untuk getById
    const raw = res.data?.item ?? res.data?.items ?? null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => { refresh(initialParams); }, []); // load sekali

  return { items, pagination, loading, error, refresh, create, update, remove, getById };
}
