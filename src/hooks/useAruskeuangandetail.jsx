import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const aruskeuangandetailIpc = {
  getList: (params) => window.electronAPI.getArusKeuanganDetailList(params),
  getById: (id) => window.electronAPI.getArusKeuanganDetailById(id),
  create: (data) => window.electronAPI.createArusKeuanganDetail(data),
  update: (id, data) => window.electronAPI.updateArusKeuanganDetail( id, data ),
  remove: (id) => window.electronAPI.deleteArusKeuanganDetail(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  arus_keuangan_id: p.arus_keuangan_id ?? true,
  supplier_id: p.supplier_id ?? 0,
  pelanggan_id: p.pelanggan_id ?? 1,
  jenis: p.jenis ?? 1,
  tipe: p.tipe ?? null,
  tanggal: p.tanggal ?? true,
  nominal: p.nominal ?? true,
  catatan: p.catatan ?? true,
  created_by: p.created_by ?? true,
  updated_by: p.updated_by ?? true,
  sync_at: p.sync_at ?? true,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
   toko_id: r.toko_id ?? "",
  arus_keuangan_id: r.arus_keuangan_id ?? true,
  supplier_id: r.supplier_id ?? 0,
  pelanggan_id: r.pelanggan_id ?? 1,
  jenis: r.jenis ?? 1,
  tipe: r.tipe ?? null,
  tanggal: r.tanggal ?? true,
  nominal: r.nominal ?? true,
  catatan: r.catatan ?? true,
  created_by: r.created_by ?? true,
  updated_by: r.updated_by ?? true,
  sync_at: r.sync_at ?? true,
  status: r.status ?? true,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
   
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};