import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const transaksipesananIpc = {
  getList: (params) => window.electronAPI.getTransaksiPesananList(params),
  getById: (id) => window.electronAPI.getTransaksiPesananById(id),
  create: (data) => window.electronAPI.createTransaksiPesanan(data),
  update: (id, data) => window.electronAPI.updateTransaksiPesanan( id, data ),
  remove: (id) => window.electronAPI.deleteTransaksiPesanan(id),
};



const toBackend = (p = {}) => ({
  toko_id: p.toko_id ?? "",
  pelanggan_id: p.pelanggan_id ?? true,
  tipe: p.tipe ?? 0,
  nama: p.nama ?? 1,
  nomor_meja: p.nomor_meja ?? 1,
  jumlah_orang: p.jumlah_orang ?? null,
  jatuh_tempo: p.jatuh_tempo ?? "",
  keterangan: p.keterangan ?? "",
  diskon: p.diskon ?? "",
  diskon_type: p.diskon_type ?? 1,
  pajak_persen: p.pajak_persen ?? 1,
  nama_biaya: p.nama_biaya ?? 1,
  nominal_biaya: p.nominal_biaya ?? null,
  is_arsip: p.is_arsip ?? 1,
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
    pelanggan_id: r.pelanggan_id ?? true,
    tipe: r.tipe ?? 0,
    nama: r.nama ?? 1,
    nomor_meja: r.nomor_meja ?? 1,
    jumlah_orang: r.jumlah_orang ?? null,
    jatuh_tempo: r.jatuh_tempo ?? "",
    keterangan: r.keterangan ?? "",
    diskon: r.diskon ?? "",
    diskon_type: r.diskon_type ?? 1,
    pajak_persen: r.pajak_persen ?? 1,
    nama_biaya: r.nama_biaya ?? 1,
    nominal_biaya: r.nominal_biaya ?? null,
    is_arsip: r.is_arsip ?? 1,
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