import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/stokopname.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('stokopnameIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.stokopnameIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting stokopnameIpc list');
    }
});

ipcMain.handle('stokopnameIpc:getById', async (event, id) => {
  try {
    const stokopnameIpc = await GetDataById(id);
    return createSuccessResponse({
        items: stokopnameIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting stokopnameIpc by ID:', error);
      return createErrorResponse(error, 'getting stokopnameIpc by ID');
  }
});

ipcMain.handle('stokopnameIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const stokopnameIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: stokopnameIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating stokopnameIpc:', error);
        return createErrorResponse(error, 'creating stokopnameIpc');
    }
});

ipcMain.handle('stokopnameIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const stokopnameIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: stokopnameIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating stokopnameIpc:', error);
    return createErrorResponse(error, 'updating stokopnameIpc');
  }
});

ipcMain.handle('stokopnameIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting stokopnameIpc:', error);
    return createErrorResponse(error, 'deleting stokopnameIpc');
  }
});

