import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '.,/model/pengaturanstruk.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('pengaturanstrukIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.pengaturanstrukIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting pengaturanstrukIpc list');
    }
});

ipcMain.handle('pengaturanstrukIpc:getById', async (event, id) => {
  try {
    const pengaturanstrukIpc = await GetDataById(id);
    return createSuccessResponse({
        items: pengaturanstrukIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting pengaturanstrukIpc by ID:', error);
      return createErrorResponse(error, 'getting pengaturanstrukIpc by ID');
  }
});

ipcMain.handle('pengaturanstrukIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const pengaturanstrukIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: pengaturanstrukIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating pengaturanstrukIpc:', error);
        return createErrorResponse(error, 'creating pengaturanstrukIpc');
    }
});

ipcMain.handle('pengaturanstrukIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const pengaturanstrukIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: pengaturanstrukIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating pengaturanstrukIpc:', error);
    return createErrorResponse(error, 'updating pengaturanstrukIpc');
  }
});

ipcMain.handle('pengaturanstrukIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting pengaturanstrukIpc:', error);
    return createErrorResponse(error, 'deleting pengaturanstrukIpc');
  }
});

