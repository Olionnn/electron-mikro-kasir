import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/diskon.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('diskonIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.diskonIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting diskonIpc list');
    }
});

ipcMain.handle('diskonIpc:getById', async (event, id) => {
  try {
    const diskonIpc = await GetDataById(id);
    return createSuccessResponse({
        items: diskonIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting diskonIpc by ID:', error);
      return createErrorResponse(error, 'getting diskonIpc by ID');
  }
});

ipcMain.handle('diskonIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const diskonIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: diskonIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating diskonIpc:', error);
        return createErrorResponse(error, 'creating diskonIpc');
    }
});

ipcMain.handle('diskonIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const diskonIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: diskonIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating diskonIpc:', error);
    return createErrorResponse(error, 'updating diskonIpc');
  }
});

ipcMain.handle('diskonIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting diskonIpc:', error);
    return createErrorResponse(error, 'deleting diskonIpc');
  }
});

