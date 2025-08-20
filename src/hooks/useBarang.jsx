import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const barangIpc = {
  getList: (params) => window.electronAPI.getBarangList(params),
  getById: (id) => window.electronAPI.getBarangById(id),
  create: (data) => window.electronAPI.createBarang(data),
  update: (id, data) => window.electronAPI.updateBarang( id, data ),
  remove: (id) => window.electronAPI.deleteBarang(id),
};

const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  kategori_id: p.kategori_id ?? true,
  nama: p.nama ?? 0,
  stok: p.stok ?? 1,
  kode: p.kode ?? 1,
  harga_dasar: p.harga_dasar ?? null,
  harga_jual: p.harga_jual ?? true,
  image: p.image ?? true,
  show_transaksi: p.show_transaksi ?? true,
  use_stok: p.use_stok ?? true,
  created_by: p.created_by ?? true,
  updated_by: p.updated_by ?? true,
  sync_at: p.sync_at ?? true,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
   toko_id: r.toko_id ?? "",
  kategori_id: r.kategori_id ?? true,
  nama: r.nama ?? 0,
  stok: r.stok ?? 1,
  kode: r.kode ?? 1,
  harga_dasar: r.harga_dasar ?? null,
  harga_jual: r.harga_jual ?? true,
  image: r.image ?? true,
  show_transaksi: r.show_transaksi ?? true,
  use_stok: r.use_stok ?? true,
  created_by: r.created_by ?? true,
  updated_by: r.updated_by ?? true,
  sync_at: r.sync_at ?? true,
  status: r.status ?? true,
 
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,

   
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};