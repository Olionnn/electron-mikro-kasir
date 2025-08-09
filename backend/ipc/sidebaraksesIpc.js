import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/sidebarakses.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('sidebaraksesIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.sidebaraksesIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting sidebaraksesIpc list');
    }
});

ipcMain.handle('sidebaraksesIpc:getById', async (event, id) => {
  try {
    const sidebaraksesIpc = await GetDataById(id);
    return createSuccessResponse({
        items: sidebaraksesIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting sidebaraksesIpc by ID:', error);
      return createErrorResponse(error, 'getting sidebaraksesIpc by ID');
  }
});

ipcMain.handle('sidebaraksesIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const sidebaraksesIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: sidebaraksesIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating sidebaraksesIpc:', error);
        return createErrorResponse(error, 'creating sidebaraksesIpc');
    }
});

ipcMain.handle('sidebaraksesIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const sidebaraksesIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: sidebaraksesIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating sidebaraksesIpc:', error);
    return createErrorResponse(error, 'updating sidebaraksesIpc');
  }
});

ipcMain.handle('sidebaraksesIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting sidebaraksesIpc:', error);
    return createErrorResponse(error, 'deleting sidebaraksesIpc');
  }
});

