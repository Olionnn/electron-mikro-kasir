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