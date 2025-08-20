import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const barangconfikIpc = {
  getList: (params) => window.electronAPI.getBarangConfigList(params),
  getById: (id) => window.electronAPI.getBarangConfigById(id),
  create: (data) => window.electronAPI.createBarangConfig(data),
  update: (id, data) => window.electronAPI.updateBarangConfig( id, data ),
  remove: (id) => window.electronAPI.deleteBarangConfig(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  notif_jumlah: p.notif_jumlah ?? 0,
  is_harrga_tampil: p.is_harrga_tampil ?? true,
  is_stok_tampil: p.is_stok_tampil ?? true,
  is_kode_tampil: p.is_kode_tampil ?? true,
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,

});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? null,
    notif_jumlah: r.notif_jumlah ?? 0,
    is_harrga_tampil: r.is_harrga_tampil ?? true,
    is_stok_tampil: r.is_stok_tampil ?? true,
    is_kode_tampil: r.is_kode_tampil ?? true,
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