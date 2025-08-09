import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/info.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('infoIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.infoIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting infoIpc list');
    }
});

ipcMain.handle('infoIpc:getById', async (event, id) => {
  try {
    const infoIpc = await GetDataById(id);
    return createSuccessResponse({
        items: infoIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting infoIpc by ID:', error);
      return createErrorResponse(error, 'getting infoIpc by ID');
  }
});

ipcMain.handle('infoIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const infoIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: infoIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating infoIpc:', error);
        return createErrorResponse(error, 'creating infoIpc');
    }
});

ipcMain.handle('infoIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const infoIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: infoIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating infoIpc:', error);
    return createErrorResponse(error, 'updating infoIpc');
  }
});

ipcMain.handle('infoIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting infoIpc:', error);
    return createErrorResponse(error, 'deleting infoIpc');
  }
});

