import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/hutanghistorybayar.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('hutanghistorybayarIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.hutanghistorybayarIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting hutanghistorybayarIpc list');
    }
});

ipcMain.handle('hutanghistorybayarIpc:getById', async (event, id) => {
  try {
    const hutanghistorybayarIpc = await GetDataById(id);
    return createSuccessResponse({
        items: hutanghistorybayarIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting hutanghistorybayarIpc by ID:', error);
      return createErrorResponse(error, 'getting hutanghistorybayarIpc by ID');
  }
});

ipcMain.handle('hutanghistorybayarIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const hutanghistorybayarIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: hutanghistorybayarIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating hutanghistorybayarIpc:', error);
        return createErrorResponse(error, 'creating hutanghistorybayarIpc');
    }
});

ipcMain.handle('hutanghistorybayarIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const hutanghistorybayarIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: hutanghistorybayarIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating hutanghistorybayarIpc:', error);
    return createErrorResponse(error, 'updating hutanghistorybayarIpc');
  }
});

ipcMain.handle('hutanghistorybayarIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting hutanghistorybayarIpc:', error);
    return createErrorResponse(error, 'deleting hutanghistorybayarIpc');
  }
});

