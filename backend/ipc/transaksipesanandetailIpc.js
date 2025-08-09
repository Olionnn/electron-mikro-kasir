import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/transaksipesanandetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('transaksipesanandetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.transaksipesanandetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting transaksipesanandetailIpc list');
    }
});

ipcMain.handle('transaksipesanandetailIpc:getById', async (event, id) => {
  try {
    const transaksipesanandetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: transaksipesanandetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting transaksipesanandetailIpc by ID:', error);
      return createErrorResponse(error, 'getting transaksipesanandetailIpc by ID');
  }
});

ipcMain.handle('transaksipesanandetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const transaksipesanandetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: transaksipesanandetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating transaksipesanandetailIpc:', error);
        return createErrorResponse(error, 'creating transaksipesanandetailIpc');
    }
});

ipcMain.handle('transaksipesanandetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const transaksipesanandetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: transaksipesanandetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating transaksipesanandetailIpc:', error);
    return createErrorResponse(error, 'updating transaksipesanandetailIpc');
  }
});

ipcMain.handle('transaksipesanandetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting transaksipesanandetailIpc:', error);
    return createErrorResponse(error, 'deleting transaksipesanandetailIpc');
  }
});

