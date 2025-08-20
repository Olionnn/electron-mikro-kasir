import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const tokoIpc = {
  getList: (params) => window.electronAPI.getTokoList(params),
  getById: (id) => window.electronAPI.getTokoById(id),
  create: (data) => window.electronAPI.createToko(data),
  update: (id, data) => window.electronAPI.updateToko( id, data ),
  remove: (id) => window.electronAPI.deleteToko(id),
};



const toBackend = (p = {}) => ({
  nama_toko: p.nama_toko ?? "",
  nama_pemilik: p.nama_pemilik ?? true,
  tampilan_id: p.tampilan_id ?? 0,
  jenis_toko_id: p.jenis_toko_id ?? 1,
  alamat_toko: p.alamat_toko ?? 1,
  no_telp: p.no_telp ?? null,
  image: p.image ?? null,
  created_at: p.created_at ?? null,
  updated_at: p.updated_at ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    nama_toko: r.nama_toko ?? "",
    nama_pemilik: r.nama_pemilik ?? true,
    tampilan_id: r.tampilan_id ?? 0,
    jenis_toko_id: r.jenis_toko_id ?? 1,
    alamat_toko: r.alamat_toko ?? 1,
    no_telp: r.no_telp ?? null,
    image: r.image ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? 1,
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