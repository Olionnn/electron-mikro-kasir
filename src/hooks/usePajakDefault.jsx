import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const pajakdefaultIpc = {
  getList: (params) => window.electronAPI.getpajakdefaultList(params),
  getById: (id) => window.electronAPI.getpajakdefaultById(id),
  create: (data) => window.electronAPI.createpajakdefault(data),
  update: (id, data) => window.electronAPI.updatepajakdefault( id, data ),
  remove: (id) => window.electronAPI.deletepajakdefault(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nominal_persen: p.nominal_persen ?? true,
  created_by: p.created_by ?? 0,
  updated_by: p.updated_by ?? 1,
  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    nominal_persen: r.nominal_persen ?? true,
    created_by: r.created_by ?? 0,
    updated_by: r.updated_by ?? 1,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
    c  
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};