import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const idebaraksesIpc = {
  getList: (params) => window.electronAPI.getSidebarAksesList(params),
  getById: (id) => window.electronAPI.getSidebarAksesById(id),
  create: (data) => window.electronAPI.createSidebarAkses(data),
  update: (id, data) => window.electronAPI.updateSidebarAkses( id, data ),
  remove: (id) => window.electronAPI.deleteSidebarAkses(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  sidebar_id: p.sidebar_id ?? true,
  role: p.role ?? 0,
  can_read: p.can_read ?? 1,
  can_create: p.can_create ?? 1,
  can_update: p.can_update ?? 1,
  can_delete: p.can_delete ?? null,
  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    sidebar_id: r.sidebar_id ?? true,
    role: r.role ?? 0,
    can_read: r.can_read ?? 1,
    can_create: r.can_create ?? 1,
    can_update: r.can_update ?? 1,
    can_delete: r.can_delete ?? null,
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
      
  };
};

const DEFAULT_PARAMS = {
  pagination: { page: 1, limit: 10 },
  filter: { search: "", status: "", toko_id: "" },
};