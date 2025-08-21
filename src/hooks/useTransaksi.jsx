import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";
import { getAccessToken } from "../utils/jwt";


const transaksiIpc = {
  getList: (params) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getTransaksiList(params, token);
  },
  getById: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.getTransaksiById(id, token);
  },
  create: (data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.createTransaksi(data, token);
  },
  update: (id, data) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.updateTransaksi( id, data, token)
  },
  remove: (id) => {
    const token = getAccessToken();
    if (!token) return Promise.resolve({ success: false, error: "Unauthorized" });
    return window.electronAPI.deleteTransaksi(id, token);
  },
};



const toBackend = (p = {}) => ({
  pelanggan_id: p.pelanggan_id ?? "",
  toko_id: p.toko_id ?? true,
  tanggal_waktu: p.tanggal_waktu ?? 0,
  total_harga: p.total_harga ?? 1,
  total_diskon: p.total_diskon ?? 1,
  total_pajak: p.total_pajak ?? null,
  total_biaya: p.total_biaya ?? 1,
  nominal_bayar: p.nominal_bayar ?? 1,
  nominal_dibayar: p.nominal_dibayar ?? "",
  nominal_dibayar: p.nominal_dibayar ?? "",
  keterangan: p.keterangan ?? "",
  no_struk: p.no_struk ?? "",
  nama_biaya: p.nama_biaya ?? 1,
  metode_bayar: p.metode_bayar ?? 1,
  is_use_stok: p.is_use_stok ?? null,
  is_use_piutang: p.is_use_piutang ?? 1,
  nomor_meja: p.nomor_meja ?? 1,
  jumlah_orang: p.jumlah_orang ?? null,
  created_by: p.created_by ?? true,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,

  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    pelanggan_id: r.pelanggan_id ?? "",
    toko_id: r.toko_id ?? true,
    tanggal_waktu: r.tanggal_waktu ?? 0,
    total_harga: r.total_harga ?? 1,
    total_diskon: r.total_diskon ?? 1,
    total_pajak: r.total_pajak ?? null,
    total_biaya: r.total_biaya ?? 1,
    nominal_bayar: r.nominal_bayar ?? 1,
    nominal_dibayar: r.nominal_dibayar ?? "",
    nominal_dibayar: r.nominal_dibayar ?? "",
    keterangan: r.keterangan ?? "",
    no_struk: r.no_struk ?? "",
    nama_biaya: r.nama_biaya ?? 1,
    metode_bayar: r.metode_bayar ?? 1,
    is_use_stok: r.is_use_stok ?? null,
    is_use_piutang: r.is_use_piutang ?? 1,
    nomor_meja: r.nomor_meja ?? 1,
    jumlah_orang: r.jumlah_orang ?? null,
    created_by: r.created_by ?? true,
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

export function useTransaksi(initialParams = DEFAULT_PARAMS) {
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

      const res = await transaksiIpc.getList(paramsRef.current);
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
      const res = await transaksiIpc.create(toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal membuat pajak");
      const created = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return created;
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      const res = await transaksiIpc.update(id, toBackend(payload));
      if (!res?.success) throw new Error(res?.error || "Gagal mengubah pajak");
      const updated = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return updated;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      const res = await transaksiIpc.remove(id);
      if (!res?.success) throw new Error(res?.error || "Gagal menghapus pajak");
      const removed = (res.data && (res.data.items || res.data.data)) || null;
      await refresh();
      return removed;
    },
    [refresh]
  );

  const getById = useCallback(async (id) => {
    const res = await transaksiIpc.getById(id);
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