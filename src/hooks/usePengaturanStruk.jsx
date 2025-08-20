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