import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/transaksipesanan.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('transaksipesananIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.transaksipesananIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting transaksipesananIpc list');
    }
});

ipcMain.handle('transaksipesananIpc:getById', async (event, id) => {
  try {
    const transaksipesananIpc = await GetDataById(id);
    return createSuccessResponse({
        items: transaksipesananIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting transaksipesananIpc by ID:', error);
      return createErrorResponse(error, 'getting transaksipesananIpc by ID');
  }
});

ipcMain.handle('transaksipesananIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const transaksipesananIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: transaksipesananIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating transaksipesananIpc:', error);
        return createErrorResponse(error, 'creating transaksipesananIpc');
    }
});

ipcMain.handle('transaksipesananIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const transaksipesananIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: transaksipesananIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating transaksipesananIpc:', error);
    return createErrorResponse(error, 'updating transaksipesananIpc');
  }
});

ipcMain.handle('transaksipesananIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting transaksipesananIpc:', error);
    return createErrorResponse(error, 'deleting transaksipesananIpc');
  }
});

