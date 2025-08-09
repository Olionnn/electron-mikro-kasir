import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/transaksi.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('transaksiIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.transaksiIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting transaksiIpc list');
    }
});

ipcMain.handle('transaksiIpc:getById', async (event, id) => {
  try {
    const transaksiIpc = await GetDataById(id);
    return createSuccessResponse({
        items: transaksiIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting transaksiIpc by ID:', error);
      return createErrorResponse(error, 'getting transaksiIpc by ID');
  }
});

ipcMain.handle('transaksiIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const transaksiIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: transaksiIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating transaksiIpc:', error);
        return createErrorResponse(error, 'creating transaksiIpc');
    }
});

ipcMain.handle('transaksiIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const transaksiIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: transaksiIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating transaksiIpc:', error);
    return createErrorResponse(error, 'updating transaksiIpc');
  }
});

ipcMain.handle('transaksiIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting transaksiIpc:', error);
    return createErrorResponse(error, 'deleting transaksiIpc');
  }
});

