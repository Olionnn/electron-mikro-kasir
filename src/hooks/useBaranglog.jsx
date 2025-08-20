import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const barangLogIpc = {
  getList: (params) => window.electronAPI.getBarangLogList(params),
  getById: (id) => window.electronAPI.getBarangLogById(id),
  create: (data) => window.electronAPI.createBarangLog(data),
  update: (id, data) => window.electronAPI.updateBarangLog( id, data ),
  remove: (id) => window.electronAPI.deleteBarangLog(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  barang_id: p.barang_id ?? "",
  stok_masuk: p.stok_masuk ?? 0,
  stok_keluar: p.stok_keluar ?? 0,
  stok_master: p.stok_master ?? 0,
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
    stok_masuk: r.stok_masuk ?? 0,
    stok_keluar: r.stok_keluar ?? 0,
    stok_master: r.stok_master ?? 0,
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