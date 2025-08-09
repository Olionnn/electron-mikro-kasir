import Users from '../models/users.js';
import db from '../../../config/database.js';
import { ipcMain } from 'electron';

// Sync DB saat app start
await Users.sync();






