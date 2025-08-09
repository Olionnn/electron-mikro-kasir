import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/toko.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

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

ipcMain.handle('tokoIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const tokoIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: tokoIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating tokoIpc:', error);
        return createErrorResponse(error, 'creating tokoIpc');
    }
});

ipcMain.handle('tokoIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const tokoIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: tokoIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating tokoIpc:', error);
    return createErrorResponse(error, 'updating tokoIpc');
  }
});

ipcMain.handle('tokoIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting tokoIpc:', error);
    return createErrorResponse(error, 'deleting tokoIpc');
  }
});

