import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const piutangdetailIpc = {
  getList: (params) => window.electronAPI.getPiutangDetailList(params),
  getById: (id) => window.electronAPI.getPiutangDetailById(id),
  create: (data) => window.electronAPI.createPiutangDetail(data),
  update: (id, data) => window.electronAPI.updatePiutangDetail( id, data ),
  remove: (id) => window.electronAPI.deletePiutangDetail(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  piutang_id: p.piutang_id ?? true,
  nominal_piutang: p.nominal_piutang ?? 0,
  nominal_bayar: p.nominal_bayar ?? 1,
  jatuh_tempo: p.jatuh_tempo ?? 1,
  tanggal_bayar: p.tanggal_bayar ?? null,
  status_piutang: p.status_piutang ?? true,
  transaksi_id: p.transaksi_id ?? 0,
  metode_bayar: p.metode_bayar ?? null,
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
    toko_id: r.toko_id ?? "",
    piutang_id: r.piutang_id ?? true,
    nominal_piutang: r.nominal_piutang ?? 0,
    nominal_bayar: r.nominal_bayar ?? 1,
    jatuh_tempo: r.jatuh_tempo ?? 1,
    tanggal_bayar: r.tanggal_bayar ?? null,
    status_piutang: r.status_piutang ?? true,
    transaksi_id: r.transaksi_id ?? 0,
    metode_bayar: r.metode_bayar ?? null,
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

export function usePiutangDetail(initialParams = DEFAULT_PARAMS) {
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

      const res = await piutangdetailIpc.getList(paramsRef.current);
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
    const res = await piutangdetailIpc.create(toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal membuat kategori");
    await refresh();
    return res.data; 
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const res = await piutangdetailIpc.update(id, toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal mengubah kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await piutangdetailIpc.remove(id);
    if (!res?.success) throw new Error(res?.error || "Gagal menghapus kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const getById = useCallback(async (id) => {
    const res = await piutangdetailIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil kategori");
    const raw = res.data?.data ?? res.data?.item ?? null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => { refresh(initialParams); }, []); 

  return { items, pagination, loading, error, refresh, create, update, remove, getById };
}