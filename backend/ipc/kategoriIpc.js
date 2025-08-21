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
  requireAuth(async (_, { data }) => {
    try {
      const res = await db.transaction(async (trx) => {
        const created = await CreateData(trx, data);
        if (!created) throw new Error("Gagal membuat kategori");

        return created;
      }, data);
      return createSuccessResponse("Kategori Berhasil Dibuat", {
        data: res,
        pagination: {},
      });
    } catch (error) {
      return createErrorResponse(error, "creating kategoriIpc");
    }
  })
);

ipcMain.handle(
  "kategoriIpc:update",
  requireAuth(async (_, { id, data }) => {
    try {
      const res = await db.transaction(async (trx) => {
        const updated = await UpdateData(trx, id, data);
        return updated;
      }, id, data);
      return createSuccessResponse("Kategori Berhasil DiUbah", {
        data: res,
        pagination: {},
      });
    } catch (error) {
      return createErrorResponse(error, "updating kategoriIpc");
    }
  })
);

ipcMain.handle(
  "kategoriIpc:delete",
  requireAuth(async (event, { id }) => {
    try {
      await DeleteData( id);

      return createSuccessResponse("Kategori Berhasil Dihapus", {
        data: null,
        pagination: {},
      });
    } catch (error) {
      return createErrorResponse(error, "deleting kategoriIpc");
    }
  })
);
