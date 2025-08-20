import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const pelangganIpc = {
  getList: (params) => window.electronAPI.getPelangganList(params),
  getById: (id) => window.electronAPI.getPelangganById(id),
  create: (data) => window.electronAPI.createPelanggan(data),
  update: (id, data) => window.electronAPI.updatePelanggan( id, data ),
  remove: (id) => window.electronAPI.deletePelanggan(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nama: p.nama ?? true,
  poin: p.poin ?? 0,
  kode: p.kode ?? 1,
  email: p.email ?? 1,
  no_telp: p.no_telp ?? null,
  alamat: p.alamat ?? null,
  Image: p.Image ?? null,
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
    nama: r.nama ?? true,
    poin: r.poin ?? 0,
    kode: r.kode ?? 1,
    email: r.email ?? 1,
    no_telp: r.no_telp ?? null,
    alamat: r.alamat ?? null,
    Image: r.Image ?? null,
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