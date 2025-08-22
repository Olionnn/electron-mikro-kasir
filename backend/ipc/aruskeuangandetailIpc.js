import { ipcMain } from "electron";
import {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
} from "../models/aruskeuangandetail.js";
import { calculatePagination } from "../helpers/paginate.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../helpers/response.js";
import db from "../../config/database.js";
import { requireAuth } from "../middleware/auth.js";

ipcMain.handle(
  "aruskeuangandetailIpc:getList",
  requireAuth(async (event, args) => {
    try {
      const { pagination = {}, filter = {} } = args || {};
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);

      return createSuccessResponse(
        "Berhasil Mendapatkan Daftar Arus Keuangan Detail",
        {
          data: result.arusKeuanganDetailList,
          pagination: paginationData,
        }
      );
    } catch (error) {
      return createErrorResponse(error, "getting arusKeuanganDetail list");
    }
  })
);

ipcMain.handle(
  "aruskeuangandetailIpc:getById",
  requireAuth(async (event, { id }) => {
    try {
      const arusKeuanganDetail = await GetDataById(id);
      return createSuccessResponse(
        "Berhasil Mendapatkan Arus Keuangan Detail",
        {
          data: arusKeuanganDetail,
          pagination: {},
        }
      );
    } catch (error) {
      return createErrorResponse(error, "getting arusKeuanganDetail by ID");
    }
  })
);

ipcMain.handle(
  "aruskeuangandetailIpc:create",
  requireAuth(async (event, { data }) => {
    try {

      
      const aruskeuangandetail = await CreateData(trx, data);
      return createSuccessResponse("Berhasil Membuat Arus Keuangan Detail", {
        data: aruskeuangandetail,
        pagination: {},
      });
    } catch (error) {
      return createErrorResponse(error, "creating aruskeuangandetailIpc");
    }
  })
);

ipcMain.handle(
  "aruskeuangandetailIpc:update",
  requireAuth(async (event, { id, data }) => {
    const trx = await db.transaction();
    try {
      const aruskeuangandetail = await UpdateData(trx, id, data);
      return createSuccessResponse({
        data: aruskeuangandetail,
        pagination: {},
      });
    } catch (error) {
      console.error("Error updating aruskeuangandetailIpc:", error);
      return createErrorResponse(error, "updating aruskeuangandetailIpc");
    }
  })
);

ipcMain.handle("aruskeuangandetailIpc:delete", async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
      items: result,
      pagination: {},
    });
  } catch (error) {
    console.error("Error deleting aruskeuangandetailIpc:", error);
    return createErrorResponse(error, "deleting aruskeuangandetailIpc");
  }
});
