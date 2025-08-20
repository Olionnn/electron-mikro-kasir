import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const pembeliandetailIpc = {
  getList: (params) => window.electronAPI.getPembelianDetailList(params),
  getById: (id) => window.electronAPI.getPembelianDetailById(id),
  create: (data) => window.electronAPI.createPembelianDetail(data),
  update: (id, data) => window.electronAPI.updatePembelianDetail( id, data ),
  remove: (id) => window.electronAPI.deletePembelianDetail(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  pembelian_id: p.pembelian_id ?? true,
  barang_id: p.barang_id ?? 0,
  jumlah: p.jumlah ?? 1,
  harga: p.harga ?? 1,
  diskon_item: p.sync_at ?? null,
  total_harga: p.total_harga ?? 0,
  keterangan: p.keterangan ?? "",
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
    pembelian_id: r.pembelian_id ?? true,
    barang_id: r.barang_id ?? 0,
    jumlah: r.jumlah ?? 1,
    harga: r.harga ?? 1,
    diskon_item: r.sync_at ?? null,
    total_harga: r.total_harga ?? 0,
    keterangan: r.keterangan ?? "",
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