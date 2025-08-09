import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/aruskeuangandetail.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';


ipcMain.handle('aruskeuangandetailIpc:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.aruskeuangandetailIpcList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting aruskeuangandetailIpc list');
    }
});

ipcMain.handle('aruskeuangandetailIpc:getById', async (event, id) => {
  try {
    const aruskeuangandetailIpc = await GetDataById(id);
    return createSuccessResponse({
        items: aruskeuangandetailIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting aruskeuangandetailIpc by ID:', error);
      return createErrorResponse(error, 'getting aruskeuangandetailIpc by ID');
  }
});

ipcMain.handle('aruskeuangandetailIpc:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const aruskeuangandetailIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: aruskeuangandetailIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating aruskeuangandetailIpc:', error);
        return createErrorResponse(error, 'creating aruskeuangandetailIpc');
    }
});

ipcMain.handle('aruskeuangandetailIpc:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const aruskeuangandetailIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: aruskeuangandetailIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating aruskeuangandetailIpc:', error);
    return createErrorResponse(error, 'updating aruskeuangandetailIpc');
  }
});

ipcMain.handle('aruskeuangandetailIpc:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting aruskeuangandetailIpc:', error);
    return createErrorResponse(error, 'deleting aruskeuangandetailIpc');
  }
});

