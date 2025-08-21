import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const transaksipesananIpc = {
  getList: (params) => window.electronAPI.getTransaksiPesananList(params),
  getById: (id) => window.electronAPI.getTransaksiPesananById(id),
  create: (data) => window.electronAPI.createTransaksiPesanan(data),
  update: (id, data) => window.electronAPI.updateTransaksiPesanan( id, data ),
  remove: (id) => window.electronAPI.deleteTransaksiPesanan(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  pelanggan_id: p.pelanggan_id ?? true,
  tipe: p.tipe ?? 0,
  nama: p.nama ?? 1,
  nomor_meja: p.nomor_meja ?? 1,
  jumlah_orang: p.jumlah_orang ?? null,
  jatuh_tempo: p.jatuh_tempo ?? "",
  keterangan: p.keterangan ?? "",
  diskon: p.diskon ?? "",
  diskon_type: p.diskon_type ?? 1,
  pajak_persen: p.pajak_persen ?? 1,
  nama_biaya: p.nama_biaya ?? 1,
  nominal_biaya: p.nominal_biaya ?? null,
  is_arsip: p.is_arsip ?? 1,
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
    pelanggan_id: r.pelanggan_id ?? true,
    tipe: r.tipe ?? 0,
    nama: r.nama ?? 1,
    nomor_meja: r.nomor_meja ?? 1,
    jumlah_orang: r.jumlah_orang ?? null,
    jatuh_tempo: r.jatuh_tempo ?? "",
    keterangan: r.keterangan ?? "",
    diskon: r.diskon ?? "",
    diskon_type: r.diskon_type ?? 1,
    pajak_persen: r.pajak_persen ?? 1,
    nama_biaya: r.nama_biaya ?? 1,
    nominal_biaya: r.nominal_biaya ?? null,
    is_arsip: r.is_arsip ?? 1,
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

export function useTransaksiPesanan(initialParams = DEFAULT_PARAMS) {
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

      const res = await transaksipesananIpc.getList(paramsRef.current);
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
    const res = await transaksipesananIpc.create(toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal membuat kategori");
    await refresh();
    return res.data; 
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const res = await transaksipesananIpc.update(id, toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal mengubah kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await transaksipesananIpc.remove(id);
    if (!res?.success) throw new Error(res?.error || "Gagal menghapus kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const getById = useCallback(async (id) => {
    const res = await transaksipesananIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil kategori");
    const raw = res.data?.data ?? res.data?.item ?? null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => { refresh(initialParams); }, []); 

  return { items, pagination, loading, error, refresh, create, update, remove, getById };
}