import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/benner.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('bennerIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.bennerIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting bennerIpc list');
    }
});

ipcMain.handle('bennerIpc:getById', async (event, id) => {
  try {
    const bennerIpc = await GetDataById(id);
    return createSuccessResponse({
        items: bennerIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting bennerIpc by ID:', error);
      return createErrorResponse(error, 'getting bennerIpc by ID');
  }
});

ipcMain.handle('bennerIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const bennerIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: bennerIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating bennerIpc:', error);
        return createErrorResponse(error, 'creating bennerIpc');
    }
});

ipcMain.handle('bennerIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const bennerIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: bennerIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating bennerIpc:', error);
    return createErrorResponse(error, 'updating bennerIpc');
  }
});

ipcMain.handle('bennerIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting bennerIpc:', error);
    return createErrorResponse(error, 'deleting bennerIpc');
  }
});

