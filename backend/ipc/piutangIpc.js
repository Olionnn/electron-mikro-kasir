import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/piutang.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('piutangIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.piutangIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting piutangIpc list');
    }
});

ipcMain.handle('piutangIpc:getById', async (event, id) => {
  try {
    const piutangIpc = await GetDataById(id);
    return createSuccessResponse({
        items: piutangIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting piutangIpc by ID:', error);
      return createErrorResponse(error, 'getting piutangIpc by ID');
  }
});

ipcMain.handle('piutangIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const piutangIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: piutangIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating piutangIpc:', error);
        return createErrorResponse(error, 'creating piutangIpc');
    }
});

ipcMain.handle('piutangIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const piutangIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: piutangIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating piutangIpc:', error);
    return createErrorResponse(error, 'updating piutangIpc');
  }
});

ipcMain.handle('piutangIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting piutangIpc:', error);
    return createErrorResponse(error, 'deleting piutangIpc');
  }
});

