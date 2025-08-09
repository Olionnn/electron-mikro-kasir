import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/pelanggan.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('pelangganIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.pelangganIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting pelangganIpc list');
    }
});

ipcMain.handle('pelangganIpc:getById', async (event, id) => {
  try {
    const pelangganIpc = await GetDataById(id);
    return createSuccessResponse({
        items: pelangganIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting pelangganIpc by ID:', error);
      return createErrorResponse(error, 'getting pelangganIpc by ID');
  }
});

ipcMain.handle('pelangganIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const pelangganIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: pelangganIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating pelangganIpc:', error);
        return createErrorResponse(error, 'creating pelangganIpc');
    }
});

ipcMain.handle('pelangganIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const pelangganIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: pelangganIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating pelangganIpc:', error);
    return createErrorResponse(error, 'updating pelangganIpc');
  }
});

ipcMain.handle('pelangganIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting pelangganIpc:', error);
    return createErrorResponse(error, 'deleting pelangganIpc');
  }
});

