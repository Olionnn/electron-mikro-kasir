import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/transaksidetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('transaksidetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.transaksidetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting transaksidetailIpc list');
    }
});

ipcMain.handle('transaksidetailIpc:getById', async (event, id) => {
  try {
    const transaksidetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: transaksidetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting transaksidetailIpc by ID:', error);
      return createErrorResponse(error, 'getting transaksidetailIpc by ID');
  }
});

ipcMain.handle('transaksidetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const transaksidetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: transaksidetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating transaksidetailIpc:', error);
        return createErrorResponse(error, 'creating transaksidetailIpc');
    }
});

ipcMain.handle('transaksidetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const transaksidetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: transaksidetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating transaksidetailIpc:', error);
    return createErrorResponse(error, 'updating transaksidetailIpc');
  }
});

ipcMain.handle('transaksidetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting transaksidetailIpc:', error);
    return createErrorResponse(error, 'deleting transaksidetailIpc');
  }
});

