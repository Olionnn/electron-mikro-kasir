import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const supplierIpc = {
  getList: (params) => window.electronAPI.getSupplierList(params),
  getById: (id) => window.electronAPI.getSupplierById(id),
  create: (data) => window.electronAPI.createSupplier(data),
  update: (id, data) => window.electronAPI.updateSupplier( id, data ),
  remove: (id) => window.electronAPI.deleteSupplier(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nama: p.nama ?? true,
  email: p.email ?? 0,
  no_telp: p.no_telp ?? 1,
  alamat: p.alamat ?? 1,
  image: p.image ?? null,
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
    email: r.email ?? 0,
    no_telp: r.no_telp ?? 1,
    alamat: r.alamat ?? 1,
    image: r.image ?? null,
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