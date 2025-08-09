import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/hutang.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('hutangIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.hutangIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting hutangIpc list');
    }
});

ipcMain.handle('hutangIpc:getById', async (event, id) => {
  try {
    const hutangIpc = await GetDataById(id);
    return createSuccessResponse({
        items: hutangIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting hutangIpc by ID:', error);
      return createErrorResponse(error, 'getting hutangIpc by ID');
  }
});

ipcMain.handle('hutangIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const hutangIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: hutangIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating hutangIpc:', error);
        return createErrorResponse(error, 'creating hutangIpc');
    }
});

ipcMain.handle('hutangIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const hutangIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: hutangIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating hutangIpc:', error);
    return createErrorResponse(error, 'updating hutangIpc');
  }
});

ipcMain.handle('hutangIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting hutangIpc:', error);
    return createErrorResponse(error, 'deleting hutangIpc');
  }
});

