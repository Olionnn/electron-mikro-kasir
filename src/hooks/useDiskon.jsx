import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const diskonIpc = {
  getList: (params) => window.electronAPI.getDiskonList(params),
  getById: (id) => window.electronAPI.getDiskonById(id),
  create: (data) => window.electronAPI.createDiskon(data),
  update: (id, data) => window.electronAPI.updateDiskon( id, data ),
  remove: (id) => window.electronAPI.deleteDiskon(id),
};



const toBackend = (p = {}) => ({
  nama: p.nama ?? "",
  jumlah: p.jumlah ?? true,
  toko_id: p.toko_id ?? 0,
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  jenis_diskon: p.jenis_diskon ?? true,
  status: p.status ?? null,
  sync_at: p.sync_at ?? null
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    nama: r.nama ?? "",
    jumlah: r.jumlah ?? true,
    toko_id: r.toko_id ?? 0,
    created_by: r.created_by ?? 1,
    updated_by: r.updated_by ?? 1,
    jenis_diskon: r.jenis_diskon ?? true,
    status: r.status ?? null,
    sync_at: r.sync_at ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
      
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};