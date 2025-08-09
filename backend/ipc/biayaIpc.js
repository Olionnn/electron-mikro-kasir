import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/biaya.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('biayaIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.biayaIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting biayaIpc list');
    }
});

ipcMain.handle('biayaIpc:getById', async (event, id) => {
  try {
    const biayaIpc = await GetDataById(id);
    return createSuccessResponse({
        items: biayaIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting biayaIpc by ID:', error);
      return createErrorResponse(error, 'getting biayaIpc by ID');
  }
});

ipcMain.handle('biayaIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const biayaIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: biayaIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating biayaIpc:', error);
        return createErrorResponse(error, 'creating biayaIpc');
    }
});

ipcMain.handle('biayaIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const biayaIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: biayaIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating biayaIpc:', error);
    return createErrorResponse(error, 'updating biayaIpc');
  }
});

ipcMain.handle('biayaIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting biayaIpc:', error);
    return createErrorResponse(error, 'deleting biayaIpc');
  }
});

