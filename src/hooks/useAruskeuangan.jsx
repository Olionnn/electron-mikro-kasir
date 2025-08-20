import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const aruskeuanganIpc = {
  getList: (params) => window.electronAPI.getArusKeuanganList(params),
  getById: (id) => window.electronAPI.getArusKeuanganById(id),
  create: (data) => window.electronAPI.createArusKeuangan(data),
  update: (id, data) => window.electronAPI.updateArusKeuangan( id, data ),
  remove: (id) => window.electronAPI.deleteArusKeuangan(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  tanggal: p.tanggal ?? "",
  total_pemasukan: p.total_pemasukan ?? 0,
  total_pengeluaran: p.total_pengeluaran ?? 0,
  total_pemasukan_lain: p.total_pemasukan_lain ?? 0,
  total_pengeluaran_lain: p.total_pengeluaran_lain ?? 0,
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
    tanggal: r.tanggal ?? null,
    total_pemasukan: r.total_pemasukan ?? 0,
    total_pengeluaran: r.total_pengeluaran ?? 0,
    total_pemasukan_lain: r.total_pemasukan_lain ?? 0,
    total_pengeluaran_lain: r.total_pengeluaran_lain ?? 0,
    status: r.status ?? true,
    created_by: r.created_by ?? 1,
    updated_by: r.updated_by ?? 1,
    sync_at: r.sync_at ?? null,
  
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
   
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};