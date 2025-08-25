import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/stokopnamedetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('stokopnamedetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.stokopnamedetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting stokopnamedetailIpc list');
    }
});

ipcMain.handle('stokopnamedetailIpc:getById', async (event, id) => {
  try {
    const stokopnamedetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: stokopnamedetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting stokopnamedetailIpc by ID:', error);
      return createErrorResponse(error, 'getting stokopnamedetailIpc by ID');
  }
});

ipcMain.handle('stokopnamedetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const stokopnamedetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: stokopnamedetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating stokopnamedetailIpc:', error);
        return createErrorResponse(error, 'creating stokopnamedetailIpc');
    }
});

ipcMain.handle('stokopnamedetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const stokopnamedetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: stokopnamedetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating stokopnamedetailIpc:', error);
    return createErrorResponse(error, 'updating stokopnamedetailIpc');
  }
});

ipcMain.handle('stokopnamedetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting stokopnamedetailIpc:', error);
    return createErrorResponse(error, 'deleting stokopnamedetailIpc');
  }
});

