import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const piutangdetailIpc = {
  getList: (params) => window.electronAPI.getKategoriList(params),
  getById: (id) => window.electronAPI.getKategoriById(id),
  create: (data) => window.electronAPI.createKategori(data),
  update: (id, data) => window.electronAPI.updateKategori( id, data ),
  remove: (id) => window.electronAPI.deleteKategori(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  piutang_id: p.piutang_id ?? true,
  nominal_piutang: p.nominal_piutang ?? 0,
  nominal_bayar: p.nominal_bayar ?? 1,
  jatuh_tempo: p.jatuh_tempo ?? 1,
  tanggal_bayar: p.tanggal_bayar ?? null,
  status_piutang: p.status_piutang ?? true,
  transaksi_id: p.transaksi_id ?? 0,
  metode_bayar: p.metode_bayar ?? null,
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
    toko_id: r.toko_id ?? "",
    piutang_id: r.piutang_id ?? true,
    nominal_piutang: r.nominal_piutang ?? 0,
    nominal_bayar: r.nominal_bayar ?? 1,
    jatuh_tempo: r.jatuh_tempo ?? 1,
    tanggal_bayar: r.tanggal_bayar ?? null,
    status_piutang: r.status_piutang ?? true,
    transaksi_id: r.transaksi_id ?? 0,
    metode_bayar: r.metode_bayar ?? null,
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