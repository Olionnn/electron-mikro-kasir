import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/baranglog.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('baranglogIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.baranglogIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting baranglogIpc list');
    }
});

ipcMain.handle('baranglogIpc:getById', async (event, id) => {
  try {
    const baranglogIpc = await GetDataById(id);
    return createSuccessResponse({
        items: baranglogIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting baranglogIpc by ID:', error);
      return createErrorResponse(error, 'getting baranglogIpc by ID');
  }
});

ipcMain.handle('baranglogIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const baranglogIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: baranglogIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating baranglogIpc:', error);
        return createErrorResponse(error, 'creating baranglogIpc');
    }
});

ipcMain.handle('baranglogIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const baranglogIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: baranglogIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating baranglogIpc:', error);
    return createErrorResponse(error, 'updating baranglogIpc');
  }
});

ipcMain.handle('baranglogIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting baranglogIpc:', error);
    return createErrorResponse(error, 'deleting baranglogIpc');
  }
});

