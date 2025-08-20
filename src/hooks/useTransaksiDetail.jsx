import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const transaksidetailIpc = {
  getList: (params) => window.electronAPI.getTransaksiDetailList(params),
  getById: (id) => window.electronAPI.getTransaksiDetailById(id),
  create: (data) => window.electronAPI.createTransaksiDetail(data),
  update: (id, data) => window.electronAPI.updateTransaksiDetail( id, data ),
  remove: (id) => window.electronAPI.deleteTransaksiDetail(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  transaksi_id: p.transaksi_id ?? true,
  barang_id: p.barang_id ?? 0,
  jumlah: p.jumlah ?? 1,
  harga: p.harga ?? 1,
  diskon_item: p.diskon_item ?? null,
  total_harga: p.total_harga ?? 1,
  keterangan: p.keterangan ?? 1,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    toko_id: r.toko_id ?? "",
    transaksi_id: r.transaksi_id ?? true,
    barang_id: r.barang_id ?? 0,
    jumlah: r.jumlah ?? 1,
    harga: r.harga ?? 1,
    diskon_item: r.diskon_item ?? null,
    total_harga: r.total_harga ?? 1,
    keterangan: r.keterangan ?? 1,
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