import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/pajakdefaultIpc.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('pajakdefaultIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.pajakdefaultIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting pajakdefaultIpc list');
    }
});

ipcMain.handle('pajakdefaultIpc:getById', async (event, id) => {
  try {
    const pajakdefaultIpc = await GetDataById(id);
    return createSuccessResponse({
        items: pajakdefaultIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting pajakdefaultIpc by ID:', error);
      return createErrorResponse(error, 'getting pajakdefaultIpc by ID');
  }
});

ipcMain.handle('pajakdefaultIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const pajakdefaultIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: pajakdefaultIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating pajakdefaultIpc:', error);
        return createErrorResponse(error, 'creating pajakdefaultIpc');
    }
});

ipcMain.handle('pajakdefaultIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const pajakdefaultIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: pajakdefaultIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating pajakdefaultIpc:', error);
    return createErrorResponse(error, 'updating pajakdefaultIpc');
  }
});

ipcMain.handle('pajakdefaultIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting pajakdefaultIpc:', error);
    return createErrorResponse(error, 'deleting pajakdefaultIpc');
  }
});

