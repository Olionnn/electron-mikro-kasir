import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const hutangIpc = {
  getList: (params) => window.electronAPI.gethutangList(params),
  getById: (id) => window.electronAPI.gethutangById(id),
  create: (data) => window.electronAPI.createhutang(data),
  update: (id, data) => window.electronAPI.updatehutang( id, data ),
  remove: (id) => window.electronAPI.deletehutang(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  supplier_id: p.supplier_id ?? true,
  total_hutang: p.total_hutang ?? 0,
  total_dibayar: p.total_dibayar ?? 1,
  jenis_hutang: p.jenis_hutang ?? 1,
  status_hutang: p.status_hutang ?? null,
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
    supplier_id: r.supplier_id ?? true,
    total_hutang: r.total_hutang ?? 0,
    total_dibayar: r.total_dibayar ?? 1,
    jenis_hutang: r.jenis_hutang ?? 1,
    status_hutang: r.status_hutang ?? null,
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