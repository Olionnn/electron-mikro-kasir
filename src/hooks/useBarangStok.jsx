import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const barangstokIpc = {
  getList: (params) => window.electronAPI.getBarangStokList(params),
  getById: (id) => window.electronAPI.getBarangStokById(id),
  create: (data) => window.electronAPI.createBarangStok(data),
  update: (id, data) => window.electronAPI.updateBarangStok( id, data ),
  remove: (id) => window.electronAPI.deleteBarangStok(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  barang_id: p.barang_id ?? "",
  harga_dasar: p.harga_dasar ?? 0,
  tanggal_masuk: p.tanggal_masuk ?? "",
  jumblah_stock: p.jumlah_stock ?? 0,
  keterangan: p.keterangan ?? "",
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
     toko_id: r.toko_id ?? "",
    barang_id: r.barang_id ?? "",
    harga_dasar: r.harga_dasar ?? 0,
    tanggal_masuk: r.tanggal_masuk ?? "",
    jumblah_stock: r.jumlah_stock ?? 0,
    keterangan: r.keterangan ?? "",
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

export function useBarangStok(initialParams = DEFAULT_PARAMS) {
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

      const res = await barangstokIpc.getList(paramsRef.current);
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
    const res = await barangstokIpc.create(toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal membuat kategori");
    await refresh();
    return res.data; 
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const res = await barangstokIpc.update(id, toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal mengubah kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await barangstokIpc.remove(id);
    if (!res?.success) throw new Error(res?.error || "Gagal menghapus kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const getById = useCallback(async (id) => {
    const res = await barangstokIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil kategori");
    const raw = res.data?.data ?? res.data?.item ?? null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => { refresh(initialParams); }, []); 

  return { items, pagination, loading, error, refresh, create, update, remove, getById };
}