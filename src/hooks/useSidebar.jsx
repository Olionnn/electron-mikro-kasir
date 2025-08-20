import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const sidebarIpc = {
  getList: (params) => window.electronAPI.getSidebarList(params),
  getById: (id) => window.electronAPI.getSidebarById(id),
  create: (data) => window.electronAPI.createSidebar(data),
  update: (id, data) => window.electronAPI.updateSidebar( id, data ),
  remove: (id) => window.electronAPI.deleteSidebar(id),
};



const toBackend = (p = {}) => ({
  parent_id: p.parent_id ?? "",
  nama: p.nama ?? true,
  route: p.route ?? 0,
  kode: p.kode ?? 1,
  icon: p.icon ?? 1,
  indexing: p.indexing ?? null,
  keterangan: p.keterangan ?? null,
  sync_at: p.sync_at ?? null,
  status: p.status ?? null,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    parent_id: r.parent_id ?? "",
    nama: r.nama ?? true,
    route: r.route ?? 0,
    kode: r.kode ?? 1,
    icon: r.icon ?? 1,
    indexing: r.indexing ?? null,
    keterangan: r.keterangan ?? null,
    sync_at: r.sync_at ?? null,
    status: r.status ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
     
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};