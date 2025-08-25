import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/piutanghistorybayar.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';

ipcMain.handle('piutanghistorybayarIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.piutanghistorybayarIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting piutanghistorybayarIpc list');
    }
});

ipcMain.handle('piutanghistorybayarIpc:getById', async (event, id) => {
  try {
    const piutanghistorybayarIpc = await GetDataById(id);
    return createSuccessResponse({
        items: piutanghistorybayarIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting piutanghistorybayarIpc by ID:', error);
      return createErrorResponse(error, 'getting piutanghistorybayarIpc by ID');
  }
});

ipcMain.handle('piutanghistorybayarIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const piutanghistorybayarIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: piutanghistorybayarIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating piutanghistorybayarIpc:', error);
        return createErrorResponse(error, 'creating piutanghistorybayarIpc');
    }
});

ipcMain.handle('piutanghistorybayarIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const piutanghistorybayarIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: piutanghistorybayarIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating piutanghistorybayarIpc:', error);
    return createErrorResponse(error, 'updating piutanghistorybayarIpc');
  }
});

ipcMain.handle('piutanghistorybayarIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting piutanghistorybayarIpc:', error);
    return createErrorResponse(error, 'deleting piutanghistorybayarIpc');
  }
});

