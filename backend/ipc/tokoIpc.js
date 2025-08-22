import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/toko.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';
import { saveImageAndGetRelPath, deletePublicFileIfExists } from '../utils/file.js';

ipcMain.handle('tokoIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.tokoIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting tokoIpc list');
    }
});

ipcMain.handle('tokoIpc:getById', async (event, id) => {
  try {
    const tokoIpc = await GetDataById(id);
    return createSuccessResponse({
        items: tokoIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting tokoIpc by ID:', error);
      return createErrorResponse(error, 'getting tokoIpc by ID');
  }
});


ipcMain.handle("tokoIpc:create", async (event, data) => {
  try {
    const payload = { ...(data || {}) };

    if (payload.image && payload.image.dataBase64) {
      const relPath = await saveImageAndGetRelPath(payload.image, 'toko');
      payload.image = relPath;
    } else {
      payload.image = null;
    }

    const normalizedPayload = {
      nama_toko: payload.nama_toko ?? "",
      nama_pemilik: payload.nama_pemilik ?? "",
      tampilan_id: Number(payload.tampilan_id) || 0,
      jenis_toko_id: Number(payload.jenis_toko_id) || 0,
      alamat_toko: payload.alamat_toko ?? "",
      no_telp: payload.no_telp ?? null,
      status: payload.status !== false,
      image: payload.image,
    };

    const result = await db.transaction(async (trx) => {
      return await CreateData(trx, normalizedPayload);
    });

    return createSuccessResponse("Berhasil Membuat Toko", {
      data: result,
      pagination: {},
    });
    
  } catch (error) {
    console.error('Error creating toko:', error);
    return createErrorResponse(error?.message || "Gagal membuat toko");
  }
});


ipcMain.handle('tokoIpc:update', async (event, { id, data }) => {
  try {
    if (!id) {
      return createErrorResponse("ID tidak valid untuk update", "updating tokoIpc");
    }

    // Ambil data lama untuk tahu path gambar existing
    const existing = await GetDataById(id);
    if (!existing) {
      return createErrorResponse("Data tidak ditemukan", "updating tokoIpc");
    }

    // Tentukan perilaku image:
    // - Jika data.image?.dataBase64 -> simpan baru, jadwalkan hapus lama
    // - Jika data.removeImage === true atau data.image === null -> hapus logo
    // - Kalau tidak ada field image/removeImage -> pertahankan logo lama
    let newImagePath = existing.image || null;
    let shouldDeleteOld = false;

    if (data?.image?.dataBase64) {
      newImagePath = await saveImageAndGetRelPath(data.image, 'toko');
      if (existing.image) shouldDeleteOld = true;
    } else if (
      (Object.prototype.hasOwnProperty.call(data || {}, "removeImage") && data.removeImage === true) ||
      (Object.prototype.hasOwnProperty.call(data || {}, "image") && data.image === null)
    ) {
      if (existing.image) shouldDeleteOld = true;
      newImagePath = null;
    }


    // Normalisasi payload: gunakan nilai baru jika ada; fallback ke existing
    const normalizedPayload = {
      nama_toko: data?.nama_toko ?? existing.nama_toko ?? "",
      nama_pemilik: data?.nama_pemilik ?? existing.nama_pemilik ?? "",
      tampilan_id: Number(data?.tampilan_id ?? existing.tampilan_id ?? 0) || 0,
      jenis_toko_id: Number(data?.jenis_toko_id ?? existing.jenis_toko_id ?? 0) || 0,
      alamat_toko: data?.alamat_toko ?? existing.alamat_toko ?? "",
      no_telp: (data?.no_telp ?? existing.no_telp) ?? null,
      status: (typeof data?.status === "boolean" ? data.status : existing.status) ?? true,
      image: newImagePath,
    };

    const updated = await db.transaction(async (trx) => {
      return await UpdateData(trx, id, normalizedPayload);
    });

    // Setelah commit sukses, baru hapus file lama bila perlu
    if (shouldDeleteOld) {
      await deletePublicFileIfExists(existing.image);
    }

    return createSuccessResponse("Berhasil Mengubah Toko", {
      data: updated,
      pagination: {},
    });
  } catch (error) {
    console.error("Error updating tokoIpc:", error);
    return createErrorResponse(error?.message || "Gagal mengubah toko", "updating tokoIpc");
  }
});


ipcMain.handle('tokoIpc:delete', async (event, id) => {
  try {
    if (!id) {
      return createErrorResponse("ID tidak valid untuk delete", "deleting tokoIpc");
    }

    // Ambil untuk tahu path gambar yang harus dibersihkan
    const existing = await GetDataById(id);
    if (!existing) {
      return createErrorResponse("Data tidak ditemukan", "deleting tokoIpc");
    }

    const deleted = await db.transaction(async (trx) => {
      return await DeleteData(trx, id);
    });

    // Setelah commit sukses, bersihkan file logo jika ada
    if (existing.image) {
      await deletePublicFileIfExists(existing.image);
    }

    return createSuccessResponse("Berhasil Menghapus Toko", {
      data: deleted,
      pagination: {},
    });
  } catch (error) {
    console.error("Error deleting tokoIpc:", error);
    return createErrorResponse(error?.message || "Gagal menghapus toko", "deleting tokoIpc");
  }
});
