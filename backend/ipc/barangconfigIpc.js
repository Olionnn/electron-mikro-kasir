import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/barangconfig.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('barangconfigIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.barangconfigIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting barangconfigIpc list');
    }
});

ipcMain.handle('barangconfigIpc:getById', async (event, id) => {
  try {
    const barangconfigIpc = await GetDataById(id);
    return createSuccessResponse({
        items: barangconfigIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting barangconfigIpc by ID:', error);
      return createErrorResponse(error, 'getting barangconfigIpc by ID');
  }
});

ipcMain.handle('barangconfigIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const barangconfigIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: barangconfigIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating barangconfigIpc:', error);
        return createErrorResponse(error, 'creating barangconfigIpc');
    }
});

ipcMain.handle('barangconfigIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const barangconfigIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: barangconfigIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating barangconfigIpc:', error);
    return createErrorResponse(error, 'updating barangconfigIpc');
  }
});

ipcMain.handle('barangconfigIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting barangconfigIpc:', error);
    return createErrorResponse(error, 'deleting barangconfigIpc');
  }
});

