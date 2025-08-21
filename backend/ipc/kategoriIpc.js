import { ipcMain } from 'electron';
import { 
  GetDataList, 
  GetDataById, 
  CreateData, 
  UpdateData, 
  DeleteData 
} from '../models/kategori.js';
import { calculatePagination } from '../helpers/paginate.js';
import { createSuccessResponse, createErrorResponse } from '../helpers/response.js';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';

ipcMain.handle('kategoriIpc:getList', requireAuth(async (event, args) => {
    try {
      console.log("KategoriIpc:getList", { args });
      const result = await GetDataList(args.pagination, args.filter);
      const paginationData = calculatePagination(args.pagination, result.totalRows);

      console.log("KategoriIpc:getList", { result, paginationData });
      return createSuccessResponse({
        data: result.kategoriList,
        pagination: paginationData
      });

    } catch (error) {
      return createErrorResponse(error, 'getting kategoriIpc list');
    }
}));

ipcMain.handle('kategoriIpc:getById', requireAuth(async (event, { id, auth }) => {
  try {
    const kategoriIpc = await GetDataById(id);
    return createSuccessResponse({
        items: kategoriIpc,
        pagination: {}
    });
  } catch (error) {
    console.error('Error getting kategoriIpc by ID:', error);
      return createErrorResponse(error, 'getting kategoriIpc by ID');
  }
}));

ipcMain.handle('kategoriIpc:create', requireAuth(async (event, { data, auth }) => {
  const trx = await db.transaction();
    try {
        const kategoriIpc = await CreateData(trx, data);
        return createSuccessResponse({
            items: kategoriIpc,
            pagination: {}
        });
    } catch (error) {
        console.error('Error creating kategoriIpc:', error);
        return createErrorResponse(error, 'creating kategoriIpc');
    }
}));

ipcMain.handle('kategoriIpc:update', requireAuth(async (event, { id, data, auth }) => {
  const trx = await db.transaction();
  try {
    console.log('Updating kategoriIpc with ID:', id, data);
    const kategoriIpc = await UpdateData(trx, id, data);
    return createSuccessResponse({
        items: kategoriIpc,
        pagination: {}
        });

  } catch (error) {
    console.error('Error updating kategoriIpc:', error);
    return createErrorResponse(error, 'updating kategoriIpc');
  }
}));

ipcMain.handle('kategoriIpc:delete', requireAuth(async (event, { id, auth }) => {
  const trx = await db.transaction();
  try {
    const result = await DeleteData(trx, id);
    return createSuccessResponse({
        items: result,
        pagination: {}
        });
  } catch (error) {
    console.error('Error deleting kategoriIpc:', error);
    return createErrorResponse(error, 'deleting kategoriIpc');
  }
}));

