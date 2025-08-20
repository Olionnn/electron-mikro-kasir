import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeRow } from "../utils/utils";


const transaksiIpc = {
  getList: (params) => window.electronAPI.getTransaksiList(params),
  getById: (id) => window.electronAPI.getTransaksiById(id),
  create: (data) => window.electronAPI.createTransaksi(data),
  update: (id, data) => window.electronAPI.updateTransaksi( id, data ),
  remove: (id) => window.electronAPI.deleteTransaksi(id),
};



const toBackend = (p = {}) => ({
  pelanggan_id: p.pelanggan_id ?? "",
  toko_id: p.toko_id ?? true,
  tanggal_waktu: p.tanggal_waktu ?? 0,
  total_harga: p.total_harga ?? 1,
  total_diskon: p.total_diskon ?? 1,
  total_pajak: p.total_pajak ?? null,
  total_biaya: p.total_biaya ?? 1,
  nominal_bayar: p.nominal_bayar ?? 1,
  nominal_dibayar: p.nominal_dibayar ?? "",
  nominal_dibayar: p.nominal_dibayar ?? "",
  keterangan: p.keterangan ?? "",
  no_struk: p.no_struk ?? "",
  nama_biaya: p.nama_biaya ?? 1,
  metode_bayar: p.metode_bayar ?? 1,
  is_use_stok: p.is_use_stok ?? null,
  is_use_piutang: p.is_use_piutang ?? 1,
  nomor_meja: p.nomor_meja ?? 1,
  jumlah_orang: p.jumlah_orang ?? null,
  created_by: p.created_by ?? true,
  updated_by: p.updated_by ?? 1,
  sync_at: p.sync_at ?? null,
  status: p.status ?? true,

  
});


const fromBackend = (row = {}) => {
  const r = normalizeRow(row);
  return {
    id: r.id,
    pelanggan_id: r.pelanggan_id ?? "",
    toko_id: r.toko_id ?? true,
    tanggal_waktu: r.tanggal_waktu ?? 0,
    total_harga: r.total_harga ?? 1,
    total_diskon: r.total_diskon ?? 1,
    total_pajak: r.total_pajak ?? null,
    total_biaya: r.total_biaya ?? 1,
    nominal_bayar: r.nominal_bayar ?? 1,
    nominal_dibayar: r.nominal_dibayar ?? "",
    nominal_dibayar: r.nominal_dibayar ?? "",
    keterangan: r.keterangan ?? "",
    no_struk: r.no_struk ?? "",
    nama_biaya: r.nama_biaya ?? 1,
    metode_bayar: r.metode_bayar ?? 1,
    is_use_stok: r.is_use_stok ?? null,
    is_use_piutang: r.is_use_piutang ?? 1,
    nomor_meja: r.nomor_meja ?? 1,
    jumlah_orang: r.jumlah_orang ?? null,
    created_by: r.created_by ?? true,
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