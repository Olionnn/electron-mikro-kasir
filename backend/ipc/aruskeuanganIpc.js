import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/aruskeuangan.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('aruskeuanganIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.aruskeuanganIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting aruskeuanganIpc list');
    }
});

ipcMain.handle('aruskeuanganIpc:getById', async (event, id) => {
  try {
    const aruskeuanganIpc = await GetDataById(id);
    return createSuccessResponse({
        items: aruskeuanganIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting aruskeuanganIpc by ID:', error);
      return createErrorResponse(error, 'getting aruskeuanganIpc by ID');
  }
});

ipcMain.handle('aruskeuanganIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const aruskeuanganIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: aruskeuanganIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating aruskeuanganIpc:', error);
        return createErrorResponse(error, 'creating aruskeuanganIpc');
    }
});

ipcMain.handle('aruskeuanganIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const aruskeuanganIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: aruskeuanganIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating aruskeuanganIpc:', error);
    return createErrorResponse(error, 'updating aruskeuanganIpc');
  }
});

ipcMain.handle('aruskeuanganIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting aruskeuanganIpc:', error);
    return createErrorResponse(error, 'deleting aruskeuanganIpc');
  }
});

