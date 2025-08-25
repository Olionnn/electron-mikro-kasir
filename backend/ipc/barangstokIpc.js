import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/barangstok.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('barangstokIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.barangstokIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting barangstokIpc list');
    }
});

ipcMain.handle('barangstokIpc:getById', async (event, id) => {
  try {
    const barangstokIpc = await GetDataById(id);
    return createSuccessResponse({
        items: barangstokIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting barangstokIpc by ID:', error);
      return createErrorResponse(error, 'getting barangstokIpc by ID');
  }
});

ipcMain.handle('barangstokIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const barangstokIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: barangstokIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating barangstokIpc:', error);
        return createErrorResponse(error, 'creating barangstokIpc');
    }
});

ipcMain.handle('barangstokIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const barangstokIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: barangstokIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating barangstokIpc:', error);
    return createErrorResponse(error, 'updating barangstokIpc');
  }
});

ipcMain.handle('barangstokIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting barangstokIpc:', error);
    return createErrorResponse(error, 'deleting barangstokIpc');
  }
});

