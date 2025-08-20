import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const bennerIpc = {
  getList: (params) => window.electronAPI.getbennerList(params),
  getById: (id) => window.electronAPI.getbennerById(id),
  create: (data) => window.electronAPI.createbenner(data),
  update: (id, data) => window.electronAPI.updatebenner( id, data ),
  remove: (id) => window.electronAPI.deletebenner(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nama: p.nama ?? true,
  image: p.image ?? 0,
  keterangan: p.keterangan ?? 1,
  is_banner_utama: p.is_banner_utama ?? 1,
  created_by: p.created_by ?? null,
  updated_by: p.updated_by ?? null,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: p.toko_id ?? "",
    nama: r.nama ?? true,
    image: r.image ?? 0,
    keterangan: r.keterangan ?? 1,
    is_banner_utama: r.is_banner_utama ?? 1,
    created_by: r.created_by ?? null,
    updated_by: r.updated_by ?? null,
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