import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/piutangdetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('piutangdetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.piutangdetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting piutangdetailIpc list');
    }
});

ipcMain.handle('piutangdetailIpc:getById', async (event, id) => {
  try {
    const piutangdetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: piutangdetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting piutangdetailIpc by ID:', error);
      return createErrorResponse(error, 'getting piutangdetailIpc by ID');
  }
});

ipcMain.handle('piutangdetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const piutangdetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: piutangdetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating piutangdetailIpc:', error);
        return createErrorResponse(error, 'creating piutangdetailIpc');
    }
});

ipcMain.handle('piutangdetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const piutangdetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: piutangdetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating piutangdetailIpc:', error);
    return createErrorResponse(error, 'updating piutangdetailIpc');
  }
});

ipcMain.handle('piutangdetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting piutangdetailIpc:', error);
    return createErrorResponse(error, 'deleting piutangdetailIpc');
  }
});

