import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const pajakIpc = {
  getList: (params) => window.electronAPI.getpajakList(params),
  getById: (id) => window.electronAPI.getpajakById(id),
  create: (data) => window.electronAPI.createpajak(data),
  update: (id, data) => window.electronAPI.updatepajak( id, data ),
  remove: (id) => window.electronAPI.deletepajak(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  nama: p.nama ?? true,
  pajak_persen: p.pajak_persen ?? 0,
  created_by: p.created_by ?? 1,
  updated_by: p.updated_by ?? 1,
  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    nama: r.nama ?? true,
    pajak_persen: r.pajak_persen ?? 0,
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