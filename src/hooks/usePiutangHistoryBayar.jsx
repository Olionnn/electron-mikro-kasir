import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const piutanghistorybayarIpc = {
  getList: (params) => window.electronAPI.getPiutangHistoryBayarList(params),
  getById: (id) => window.electronAPI.getPiutangHistoryBayarById(id),
  create: (data) => window.electronAPI.createPiutangHistoryBayar(data),
  update: (id, data) => window.electronAPI.updatePiutangHistoryBayar( id, data ),
  remove: (id) => window.electronAPI.deletePiutangHistoryBayar(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  piutang_detail_id: p.piutang_detail_id ?? true,
  nominal_cicilan: p.nominal_cicilan ?? 0,
  nominal_belum_bayar: p.nominal_belum_bayar ?? 1,
  tanggal_bayar: p.tanggal_bayar ?? 1,
  metode_bayar: p.metode_bayar ?? null,
  keterangan: p.keterangan ?? true,
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
    piutang_detail_id: r.piutang_detail_id ?? true,
    nominal_cicilan: r.nominal_cicilan ?? 0,
    nominal_belum_bayar: r.nominal_belum_bayar ?? 1,
    tanggal_bayar: r.tanggal_bayar ?? 1,
    metode_bayar: r.metode_bayar ?? null,
    keterangan: r.keterangan ?? true,
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