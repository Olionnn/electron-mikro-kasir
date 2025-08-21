// backend/ipc/kategoriIpc.js
import { ipcMain } from "electron";
import {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
} from "../models/kategori.js";
import { calculatePagination } from "../helpers/paginate.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../helpers/response.js";
import db from "../../config/database.js";
import { requireAuth } from "../middleware/auth.js";

ipcMain.handle(
  "kategoriIpc:getList",
  requireAuth(async (event, args) => {
    try {
      const { pagination = {}, filter = {} } = args || {};
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);

      // Return shape: res.data = { data: [...], pagination: {...} }
      return createSuccessResponse("Kategori list fetched successfully", {
        data: result.kategoriList,
        pagination: paginationData,
      });
    } catch (error) {
      return createErrorResponse(error, "getting kategoriIpc list");
    }
  })
);

ipcMain.handle(
  "kategoriIpc:getById",
  requireAuth(async (event, { id }) => {
    try {
      const row = await GetDataById(id);
      return createSuccessResponse("KategoriIpc fetched successfully", {
        data: row,
        pagination: {},
      });
    } catch (error) {
      return createErrorResponse(error, "getting kategoriIpc by ID");
    }
  })
);

ipcMain.handle(
  "kategoriIpc:create",
  requireAuth(async (event, { data }) => {
    const trx = await db.transaction();
    try {
      const created = await CreateData(trx, data);
      await trx.commit?.();
      return createSuccessResponse("Kategori Berhasil Dibuat", {
        data: created,
        pagination: {},
      });
    } catch (error) {
      await trx.rollback?.();
      return createErrorResponse(error, "creating kategoriIpc");
    }
  })
);

ipcMain.handle(
  "kategoriIpc:update",
  requireAuth(async (event, { id, data }) => {
    const trx = await db.transaction();
    try {
      const updated = await UpdateData(trx, id, data);
      await trx.commit?.();
      return createSuccessResponse("Kategori Berhasil DiUbah", {
        data: updated,
        pagination: {},
      });
    } catch (error) {
      await trx.rollback?.();
      return createErrorResponse(error, "updating kategoriIpc");
    }
  })
);

ipcMain.handle(
  "kategoriIpc:delete",
  requireAuth(async (event, { id }) => {
    const trx = await db.transaction();
    try {
      const deleted = await DeleteData(trx, id);
      await trx.commit?.();
      return createSuccessResponse("Kategori Berhasil Dihapus", {
        data: deleted,
        pagination: {},
      });
    } catch (error) {
      await trx.rollback?.();
      return createErrorResponse(error, "deleting kategoriIpc");
    }
  })
);
