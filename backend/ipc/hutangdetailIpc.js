import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/hutangdetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('hutangdetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.hutangdetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting hutangdetailIpc list');
    }
});

ipcMain.handle('hutangdetailIpc:getById', async (event, id) => {
  try {
    const hutangdetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: hutangdetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting hutangdetailIpc by ID:', error);
      return createErrorResponse(error, 'getting hutangdetailIpc by ID');
  }
});

ipcMain.handle('hutangdetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const hutangdetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: hutangdetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating hutangdetailIpc:', error);
        return createErrorResponse(error, 'creating hutangdetailIpc');
    }
});

ipcMain.handle('hutangdetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const hutangdetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: hutangdetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating hutangdetailIpc:', error);
    return createErrorResponse(error, 'updating hutangdetailIpc');
  }
});

ipcMain.handle('hutangdetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting hutangdetailIpc:', error);
    return createErrorResponse(error, 'deleting hutangdetailIpc');
  }
});

