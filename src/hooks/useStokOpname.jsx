import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const stokopnameIpc = {
  getList: (params) => window.electronAPI.getStokOpnameList(params),
  getById: (id) => window.electronAPI.getStokOpnameById(id),
  create: (data) => window.electronAPI.createStokOpname(data),
  update: (id, data) => window.electronAPI.updateStokOpname( id, data ),
  remove: (id) => window.electronAPI.deleteStokOpname(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  keterangan: p.keterangan ?? true,
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
     toko_id: r.toko_id ?? "",
    keterangan: r.keterangan ?? true,
    created_by: r.created_by ?? 1,
    updated_by: r.updated_by ?? 1,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
     
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};