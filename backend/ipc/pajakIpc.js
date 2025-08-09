import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/pajak.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('pajakIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.pajakIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting pajakIpc list');
    }
});

ipcMain.handle('pajakIpc:getById', async (event, id) => {
  try {
    const pajakIpc = await GetDataById(id);
    return createSuccessResponse({
        items: pajakIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting pajakIpc by ID:', error);
      return createErrorResponse(error, 'getting pajakIpc by ID');
  }
});

ipcMain.handle('pajakIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const pajakIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: pajakIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating pajakIpc:', error);
        return createErrorResponse(error, 'creating pajakIpc');
    }
});

ipcMain.handle('pajakIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const pajakIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: pajakIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating pajakIpc:', error);
    return createErrorResponse(error, 'updating pajakIpc');
  }
});

ipcMain.handle('pajakIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting pajakIpc:', error);
    return createErrorResponse(error, 'deleting pajakIpc');
  }
});

