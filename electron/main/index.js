

import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';
import started from 'electron-squirrel-startup';
import initDatabase from '../../backend/ipc/bootstrap.js';
import '../../backend/ipc/kategoriIpc.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const isDev = 'development' === 'development';

function createWindow() {
console.log('App directory:', __dirname);

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload', 'index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox : true,
    },
    icon: path.join(__dirname, '../../public/icon.png')
  });


  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.webContents.on('did-fail-load', () => {
    if (!isDev) {
      mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }
  });
 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await initDatabase(); // Initialize the database

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
