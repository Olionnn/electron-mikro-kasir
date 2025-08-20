import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const piutangIpc = {
  getList: (params) => window.electronAPI.getPiutangList(params),
  getById: (id) => window.electronAPI.getPiutangById(id),
  create: (data) => window.electronAPI.createPiutang(data),
  update: (id, data) => window.electronAPI.updatePiutang( id, data ),
  remove: (id) => window.electronAPI.deletePiutang(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  pelanggan_id: p.pelanggan_id ?? true,
  total_piutang: p.total_piutang ?? 0,
  total_dibayar: p.total_dibayar ?? 1,
  jenis_piutang: p.jenis_piutang ?? 1,
  status_piutang: p.status_piutang ?? null,
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
    pelanggan_id: r.pelanggan_id ?? true,
    total_piutang: r.total_piutang ?? 0,
    total_dibayar: r.total_dibayar ?? 1,
    jenis_piutang: r.jenis_piutang ?? 1,
    status_piutang: r.status_piutang ?? null,
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