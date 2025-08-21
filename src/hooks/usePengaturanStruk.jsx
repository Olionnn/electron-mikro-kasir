import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const pengaturanstrukIpc = {
  getList: (params) => window.electronAPI.getPengaturanStrukList(params),
  getById: (id) => window.electronAPI.getPengaturanStrukById(id),
  create: (data) => window.electronAPI.createPengaturanStruk(data),
  update: (id, data) => window.electronAPI.updatePengaturanStruk( id, data ),
  remove: (id) => window.electronAPI.deletePengaturanStruk(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  is_tampilkan_logo: p.is_tampilkan_logo ?? true,
  mode_cetak_gambar: p.mode_cetak_gambar ?? 0,
  is_tampilkan_kode_struk: p.is_tampilkan_kode_struk ?? 1,
  is_tampilkan_no_urut: p.is_tampilkan_no_urut ?? 1,
  is_tampilkan_satuan_sebelah_qty: p.is_tampilkan_satuan_sebelah_qty ?? null,
  is_tampilkan_alamat_pelanggan: p.is_tampilkan_alamat_pelanggan ?? true,
  is_tampilkan_no_struk: p.is_tampilkan_no_struk ?? true,
  is_tampilkan_total_kuantitas: p.is_tampilkan_total_kuantitas ?? true,
  is_tampilkan_kolom_ttd_hutang_piutang: p.is_tampilkan_kolom_ttd_hutang_piutang ?? true,
  is_tampilkan_tipe_harga: p.is_tampilkan_tipe_harga ?? true, 
  keterangan_header: p.keterangan_header ?? null,
  keterangan_footer: p.keterangan_footer ?? null,
  perpanjang_logo: p.perpanjang_logo ?? 0,
  Image: p.Image ?? null,
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
    is_tampilkan_logo: r.is_tampilkan_logo ?? true,
    mode_cetak_gambar: r.mode_cetak_gambar ?? 0,
    is_tampilkan_kode_struk: r.is_tampilkan_kode_struk ?? 1,
    is_tampilkan_no_urut: r.is_tampilkan_no_urut ?? 1,
    is_tampilkan_satuan_sebelah_qty: r.is_tampilkan_satuan_sebelah_qty ?? null,
    is_tampilkan_alamat_pelanggan: r.is_tampilkan_alamat_pelanggan ?? true,
    is_tampilkan_no_struk: r.is_tampilkan_no_struk ?? true,
    is_tampilkan_total_kuantitas: r.is_tampilkan_total_kuantitas ?? true,
    is_tampilkan_kolom_ttd_hutang_piutang: r.is_tampilkan_kolom_ttd_hutang_piutang ?? true,
    is_tampilkan_tipe_harga: r.is_tampilkan_tipe_harga ?? true, 
    keterangan_header: r.keterangan_header ?? null,
    keterangan_footer: r.keterangan_footer ?? null,
    perpanjang_logo: r.perpanjang_logo ?? 0,
    Image: r.Image ?? null,
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

export function usePengaturanStruk(initialParams = DEFAULT_PARAMS) {
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

      const res = await pengaturanstrukIpc.getList(paramsRef.current);
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
    const res = await pengaturanstrukIpc.create(toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal membuat kategori");
    await refresh();
    return res.data; 
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const res = await pengaturanstrukIpc.update(id, toBackend(payload));
    if (!res?.success) throw new Error(res?.error || "Gagal mengubah kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await pengaturanstrukIpc.remove(id);
    if (!res?.success) throw new Error(res?.error || "Gagal menghapus kategori");
    await refresh();
    return res.data;
  }, [refresh]);

  const getById = useCallback(async (id) => {
    const res = await pengaturanstrukIpc.getById(id);
    if (!res?.success) throw new Error(res?.error || "Gagal mengambil kategori");
    const raw = res.data?.data ?? res.data?.item ?? null;
    return raw ? fromBackend(raw) : null;
  }, []);

  useEffect(() => { refresh(initialParams); }, []); 

  return { items, pagination, loading, error, refresh, create, update, remove, getById };
}