import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/kategori.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('kategoriIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.kategoriIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting kategoriIpc list');
    }
});

ipcMain.handle('kategoriIpc:getById', async (event, id) => {
  try {
    const kategoriIpc = await GetDataById(id);
    return createSuccessResponse({
        items: kategoriIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting kategoriIpc by ID:', error);
      return createErrorResponse(error, 'getting kategoriIpc by ID');
  }
});

ipcMain.handle('kategoriIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const kategoriIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: kategoriIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating kategoriIpc:', error);
        return createErrorResponse(error, 'creating kategoriIpc');
    }
});

ipcMain.handle('kategoriIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const kategoriIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: kategoriIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating kategoriIpc:', error);
    return createErrorResponse(error, 'updating kategoriIpc');
  }
});

ipcMain.handle('kategoriIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting kategoriIpc:', error);
    return createErrorResponse(error, 'deleting kategoriIpc');
  }
});

