import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/supplier.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('supplierIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.supplierIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting supplierIpc list');
    }
});

ipcMain.handle('supplierIpc:getById', async (event, id) => {
  try {
    const supplierIpc = await GetDataById(id);
    return createSuccessResponse({
        items: supplierIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting supplierIpc by ID:', error);
      return createErrorResponse(error, 'getting supplierIpc by ID');
  }
});

ipcMain.handle('supplierIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const supplierIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: supplierIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating supplierIpc:', error);
        return createErrorResponse(error, 'creating supplierIpc');
    }
});

ipcMain.handle('supplierIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const supplierIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: supplierIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating supplierIpc:', error);
    return createErrorResponse(error, 'updating supplierIpc');
  }
});

ipcMain.handle('supplierIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting supplierIpc:', error);
    return createErrorResponse(error, 'deleting supplierIpc');
  }
});

