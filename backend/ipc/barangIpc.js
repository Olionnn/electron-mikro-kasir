import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/barang.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('barang:getList', requireAuth(async (event, async) => {
    try {
      const { pagination = {}, filter = {} } = args || {};
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);

      return createSuccessResponse("Berhasil Mendapatkan Daftar Barang", {
        data: result.barangList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting barang list');
    }
})
);

ipcMain.handle('barang:getById', requireAuth(async (event, id) => {
  try {
    const barang = await GetDataById(id);
    return createSuccessResponse("Berhasil Mendapatkan Barang", {
      data: barang,
      pagination: {}
    });
  } catch (error) {
    console.error('Error getting barang by ID:', error);
      return createErrorResponse(error, 'getting barang by ID');
  }
}));

ipcMain.handle('barang:create', requireAuth(async (event, data) => {
    try {
      const res = await db.transaction(async (trx) => {
        const barang = await CreateData(trx, data);
        return barang;
      });
      return createSuccessResponse("Berhasil Membuat Barang", {
          data: res,
          pagination: {}
      });
  } catch (error) {
        return createErrorResponse(error, 'creating barang');
    }
}));

ipcMain.handle('barang:update', requireAuth(async (event, { id, data }) => {
  try {
    const res = await db.transaction(async (trx) => {
      const barang = await UpdateData(trx, id, data);
      return barang;
    }); 
    return createSuccessResponse("Berhasil Mengupdate Barang", {
      data: res,
      pagination: {}
    });
  } catch (error) {
    return createErrorResponse(error, 'updating barang');
  }
}));

ipcMain.handle('barang:delete', async (event, id) => {
  try {
    const res = await db.transaction(async (trx) => {
      const barang = await DeleteData(trx, id);
      return barang;
    });
    return createSuccessResponse("Berhasil Menghapus Barang", {
      data: null,
      pagination: {}
    });
  } catch (error) {
    return createErrorResponse(error, 'deleting barang');
  }
});
