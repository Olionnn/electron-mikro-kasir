import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../model/pembeliandetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('pembeliandetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.pembeliandetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting pembeliandetailIpc list');
    }
});

ipcMain.handle('pembeliandetailIpc:getById', async (event, id) => {
  try {
    const pembeliandetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: pembeliandetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting pembeliandetailIpc by ID:', error);
      return createErrorResponse(error, 'getting pembeliandetailIpc by ID');
  }
});

ipcMain.handle('pembeliandetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const pembeliandetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: pembeliandetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating pembeliandetailIpc:', error);
        return createErrorResponse(error, 'creating pembeliandetailIpc');
    }
});

ipcMain.handle('pembeliandetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const pembeliandetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: pembeliandetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating pembeliandetailIpc:', error);
    return createErrorResponse(error, 'updating pembeliandetailIpc');
  }
});

ipcMain.handle('pembeliandetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting pembeliandetailIpc:', error);
    return createErrorResponse(error, 'deleting pembeliandetailIpc');
  }
});

