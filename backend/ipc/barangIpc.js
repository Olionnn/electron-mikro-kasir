import { ipcMain } from "electron";
import {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
} from "../models/barang.js";
import { calculatePagination } from "../helpers/paginate.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../helpers/response.js";
import db from "../../config/database.js";
import { saveImageAndGetRelPath, deletePublicFileIfExists } from '../utils/file.js';
import { requireAuth } from "../middleware/auth.js";

ipcMain.handle(
  "barang:getList",
  requireAuth(async (event, args) => {
    try {
      const { pagination = {}, filter = {} } = args || {};
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);

      return createSuccessResponse("Berhasil Mendapatkan Daftar Barang", {
        data: result.barangList,
        pagination: paginationData,
      });
    } catch (error) {
      return createErrorResponse(error, "getting barang list");
    }
  })
);

ipcMain.handle(
  "barang:getById",
  requireAuth(async (event, {id}) => {
    try {
      const barang = await GetDataById(id);
      if (!barang) {
        return createErrorResponse("Barang not found");
      }

      return createSuccessResponse("Berhasil Mendapatkan Barang", {
        data: barang,
        pagination: {},
      });

    } catch (error) {
      return createErrorResponse(error, "getting barang by ID");
    }
  })
);

ipcMain.handle(
  "barang:create",
  requireAuth(async (event, {data}) => {
    try {
      const payload = { ...(data || {}) };

      if (payload.image && payload.image.dataBase64) {
        const relPath = await saveImageAndGetRelPath(payload.image, 'users');
        payload.image = relPath;
      } else {
        payload.image = null;
      }

      const normalizedPayload = {
        toko_id: payload.toko_id ?? null,
        kategori_id: payload.kategori_id ?? null,
        nama: payload.nama ?? "",
        stok: payload.stok ?? 0,
        kode: payload.kode ?? "",
        harga_dasar: payload.harga_dasar ?? 0,
        harga_jual: payload.harga_jual ?? 0,
        image: payload.image ?? null,
        show_transaksi: payload.show_transaksi ?? false,
        use_stok: payload.use_stok ?? false,
      }


      const res = await db.transaction(async (trx) => {
        const barang = await CreateData(trx, normalizedPayload);
        return barang;
      });


      return createSuccessResponse("Berhasil Membuat Barang", {
        data: res,
        pagination: {},
      });
    } catch (error) {
      return createErrorResponse(error, "creating barang");
    }
  })
);

ipcMain.handle(
  "barang:update",
  requireAuth(async (event, { id, data }) => {
    try {
      const existing = await GetDataById(id);
      if (!existing) {
        return createErrorResponse("Data tidak ditemukan", "updating barang");
      }

      let newImagePath = existing.image || null;
      let shouldDeleteOld = false;


      if (data?.image?.dataBase64) {
        newImagePath = await saveImageAndGetRelPath(data.image, 'barang');
        if (existing.image) shouldDeleteOld = true;
      } else if (
        (Object.prototype.hasOwnProperty.call(data || {}, "removeImage") && data.removeImage === true) ||
        (Object.prototype.hasOwnProperty.call(data || {}, "image") && data.image === null)
      ) {
        if (existing.image) shouldDeleteOld = true;
        newImagePath = null;
      }

      const normalizedPayload = {
        toko_id: data?.toko_id ?? existing.toko_id ?? null,
        kategori_id: data?.kategori_id ?? existing.kategori_id ?? null,
        nama: data?.nama ?? existing.nama ?? "",
        stok: data?.stok ?? existing.stok ?? 0,
        kode: data?.kode ?? existing.kode ?? "",
        harga_dasar: data?.harga_dasar ?? existing.harga_dasar ?? 0,
        harga_jual: data?.harga_jual ?? existing.harga_jual ?? 0,
        image: newImagePath ?? existing.image ?? data?.image ?? "",
        show_transaksi: data?.show_transaksi ?? existing.show_transaksi ?? false,
        use_stok: data?.use_stok ?? existing.use_stok ?? false,
      }

    const updated = await db.transaction(async (trx) => {
      return await UpdateData(trx, id, normalizedPayload);
    });

    if (shouldDeleteOld) {
      await deletePublicFileIfExists(existing.image);
    }

    return createSuccessResponse("Berhasil Mengupdate Barang", {
      data: updated,
      pagination: {},
    });
  } catch (error) {
    return createErrorResponse(error, "updating barang");
  }
}));

ipcMain.handle("barang:delete", async (event, id) => {
  try {

    const existing = await GetDataById(id);
    if (!existing) {
      return createErrorResponse("Data tidak ditemukan", "deleting barang");
    }

    const deleted = await db.transaction(async (trx) => {
      return await DeleteData(trx, id);
    });

    if (existing.image) {
      await deletePublicFileIfExists(existing.image);
    }
    return createSuccessResponse("Berhasil Menghapus Barang", {
      data: null,
      pagination: {},
    });
  } catch (error) {
    return createErrorResponse(error, "deleting barang");
  }
});
