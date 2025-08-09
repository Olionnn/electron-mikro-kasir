import path from 'path';
import { fileURLToPath } from 'url';
import { app } from 'electron';
import os from 'os';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== 'production';

const safeMkdir = (dir) => {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.error('❌ Failed to create dir:', dir, e);
  }
};

export const getAppDataPath = () => {
  if (isDevelopment) return path.resolve(__dirname, '../');
  try {
    return app.getPath('userData');
  } catch {
    const appName = 'Mikro Kasir';
    switch (os.platform()) {
      case 'win32':
        return path.join(os.homedir(), 'AppData', 'Roaming', appName);
      case 'darwin':
        return path.join(os.homedir(), 'Library', 'Application Support', appName);
      case 'linux':
        return path.join(os.homedir(), '.config', appName);
      default:
        return path.resolve(__dirname, '../');
    }
  }
};

export const getDataDirectory = () => {
  const base = isDevelopment ? path.resolve(__dirname, '../') : getAppDataPath();
  const dir = path.join(base, 'data');
  safeMkdir(dir);
  return dir;
};

export const getLogsDirectory = () => {
  const base = isDevelopment ? path.resolve(__dirname, '../') : getAppDataPath();
  const dir = path.join(base, 'logs');
  safeMkdir(dir);
  return dir;
};

export const getDatabasePath = () => {
  return path.join(getDataDirectory(), 'mikro-kasir.db');
};

export const getBackupPaths = () => {
  return [
    path.resolve(__dirname, '../data/mikro-kasir.db'),
    path.resolve(__dirname, '../backup/mikro-kasir.db'),
    path.resolve(process.cwd(), 'data/mikro-kasir.db'),
    path.resolve(process.cwd(), 'backup/mikro-kasir.db'),
  ];
};

export const getAssetsPath = () => {
  if (isDevelopment) return path.resolve(__dirname, '../public');
  try {
    return path.join(process.resourcesPath, 'assets');
  } catch {
    return path.resolve(__dirname, '../public');
  }
};

// Debug prints
console.log('🔧 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('📂 App Data Path:', getAppDataPath());
console.log('📁 Data Directory:', getDataDirectory());
console.log('🧾 Logs Directory:', getLogsDirectory());
console.log('📦 Database Path:', getDatabasePath());