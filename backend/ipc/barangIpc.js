import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/barang.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../../config/database.js';

ipcMain.handle('barang:getList', async (event, { pagination = {}, filter = {} }) => {
    try {
      const result = await GetDataList(pagination, filter);
      const paginationData = calculatePagination(pagination, result.totalRows);
      
      return createSuccessResponse({
        items: result.barangList,
        pagination: paginationData
      });
    } catch (error) {
      return createErrorResponse(error, 'getting barang list');
    }
});

ipcMain.handle('barang:getById', async (event, id) => {
  try {
    const barang = await GetDataById(id);
    return createSuccessResponse({
        items: barang,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting barang by ID:', error);
      return createErrorResponse(error, 'getting barang by ID');
  }
});

ipcMain.handle('barang:create', async (event, data) => {
  const trx = await db.transaction();
    try {
        const barang = await CreateData(trx, data);
        return createSuccessResponse({
            items: barang,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating barang:', error);
        return createErrorResponse(error, 'creating barang');
    }
});

ipcMain.handle('barang:update', async (event, { id, data }) => {
  const trx = await db.transaction();
  try {
    const barang = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: barang,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating barang:', error);
    return createErrorResponse(error, 'updating barang');
  }
});

ipcMain.handle('barang:delete', async (event, id) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting barang:', error);
    return createErrorResponse(error, 'deleting barang');
  }
});

