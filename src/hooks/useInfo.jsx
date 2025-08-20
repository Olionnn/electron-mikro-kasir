import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const infoLIpc = {
  getList: (params) => window.electronAPI.getinfoLList(params),
  getById: (id) => window.electronAPI.getinfoLById(id),
  create: (data) => window.electronAPI.createinfoL(data),
  update: (id, data) => window.electronAPI.updateinfoL( id, data ),
  remove: (id) => window.electronAPI.deleteinfoL(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nama: p.nama ?? true,
  image: p.image ?? 0,
  isi: p.isi ?? 1,
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? null,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    nama: r.nama ?? true,
    image: r.image ?? 0,
    isi: r.isi ?? 1,
    created_by: r.created_by ?? 1,
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