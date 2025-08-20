import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const hutangDetailIpc = {
  getList: (params) => window.electronAPI.getHutangDetailList(params),
  getById: (id) => window.electronAPI.getHutangDetailById(id),
  create: (data) => window.electronAPI.createHutangDetail(data),
  update: (id, data) => window.electronAPI.updateHutangDetail( id, data ),
  remove: (id) => window.electronAPI.deleteHutangDetail(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  hutang_id: p.hutang_id? true : 0,
  nominal_hutang: p.nominal_hutang ?? 0,
  nominal_bayar: p.nominal_bayar ?? 0,
  jatuh_tempo: p.jatuh_tempo ?? "",
  tanggal_bayar: p.tanggal_bayar ?? "",
  status_hutang: p.status_hutang ?? true,
  pembelian_id: p.pembelian_id ?? 0,
  metode_bayar: p.metode_bayar ?? "",
  keterangan: p.keterangan ?? "",
  no_struk: p.no_struk ?? "",
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    nama: r.nama ?? "",
    toko_id: r.toko_id ?? "",
    hutang_id: r.hutang_id? true : 0,
    nominal_hutang: r.nominal_hutang ?? 0,
    nominal_bayar: r.nominal_bayar ?? 0,
    jatuh_tempo: r.jatuh_tempo ?? "",
    tanggal_bayar: r.tanggal_bayar ?? "",
    status_hutang: r.status_hutang ?? true,
    pembelian_id: r.pembelian_id ?? 0,
    metode_bayar: r.metode_bayar ?? "",
    keterangan: r.keterangan ?? "",
    no_struk: r.no_struk ?? "",
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