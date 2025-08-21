import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const tokoIpc = {
  getList: (params) => window.electronAPI.getTokoList(params),
  getById: (id) => window.electronAPI.getTokoById(id),
  create: (data) => window.electronAPI.createToko(data),
  update: (id, data) => window.electronAPI.updateToko( id, data ),
  remove: (id) => window.electronAPI.deleteToko(id),
};



const toBackend = (p = {}) => ({
  nama_toko: p.nama_toko ?? "",
  nama_pemilik: p.nama_pemilik ?? true,
  tampilan_id: p.tampilan_id ?? 0,
  jenis_toko_id: p.jenis_toko_id ?? 1,
  alamat_toko: p.alamat_toko ?? 1,
  no_telp: p.no_telp ?? null,
  image: p.image ?? null,
  created_at: p.created_at ?? null,
  updated_at: p.updated_at ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    nama_toko: r.nama_toko ?? "",
    nama_pemilik: r.nama_pemilik ?? true,
    tampilan_id: r.tampilan_id ?? 0,
    jenis_toko_id: r.jenis_toko_id ?? 1,
    alamat_toko: r.alamat_toko ?? 1,
    no_telp: r.no_telp ?? null,
    image: r.image ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? 1,
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

export function useToko(initialParams = DEFAULT_PARAMS) {
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

      const res = await tokoIpc.getList(paramsRef.current);
      if (!res?.success) throw new Error(res?.error || "Gagal memuat kategori");

      const list = res.data?.data ?? [];
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
    const res = await tokoIpc.create(toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal membuat kategori");
    await refresh();
    return res.data; 
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const res = await tokoIpc.update(id, toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal mengubah kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await tokoIpc.remove(id);
    if (!res?.success) throw new Error(res?.error || "Gagal menghapus kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const getById = useCallback(async (id) => {
    const res = await tokoIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil kategori");
    const raw = res.data?.data ?? res.data?.item ?? null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => { refresh(initialParams); }, []); 

  return { items, pagination, loading, error, refresh, create, update, remove, getById };
}