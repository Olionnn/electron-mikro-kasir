import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/sidebar.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('sidebarIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.sidebarIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting sidebarIpc list');
    }
});

ipcMain.handle('sidebarIpc:getById', async (event, id) => {
  try {
    const sidebarIpc = await GetDataById(id);
    return createSuccessResponse({
        items: sidebarIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting sidebarIpc by ID:', error);
      return createErrorResponse(error, 'getting sidebarIpc by ID');
  }
});

ipcMain.handle('sidebarIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const sidebarIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: sidebarIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating sidebarIpc:', error);
        return createErrorResponse(error, 'creating sidebarIpc');
    }
});

ipcMain.handle('sidebarIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const sidebarIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: sidebarIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating sidebarIpc:', error);
    return createErrorResponse(error, 'updating sidebarIpc');
  }
});

ipcMain.handle('sidebarIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting sidebarIpc:', error);
    return createErrorResponse(error, 'deleting sidebarIpc');
  }
});

