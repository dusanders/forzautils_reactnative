import { app, BrowserWindow } from 'electron/main';
import { ipcMain } from 'electron/main';
import * as Path from 'path';
import { WifiServiceProvider } from './services/WiFi/WiFiService.js';
import { ISupportRendererService } from './renderer/renderer.types.js';
import { CacheService } from './services/Cache/Cache.js';
import { Session } from './services/Database/Session.js';
import { DatabaseService } from './services/Database/Database.js';
import { Logger } from './services/Logger/Logger.js';
import AppConfig from './config.json' with { type: 'json' };
const __dirname = import.meta.dirname;

const RendererChannel = ipcMain;
const TAG = "Main";
const preloadPath = Path.join(__dirname, 'renderer', 'preload.js');
const htmlPath = Path.join(__dirname, '../public/index.html');

const attachServices = async (win: Electron.BrowserWindow) => {
  const databaseService = new DatabaseService(win);
  await databaseService.initialize();

  const supportServices: ISupportRendererService[] = [
    new WifiServiceProvider(win),
    new CacheService(win),
    new Session(win, databaseService.mainDb),
    databaseService,
  ];

  supportServices.forEach(service => service.attachHandlers(ipcMain));
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: AppConfig.winWidth || 1280,
    height: AppConfig.winHeight || 720,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      preload: preloadPath,
      devTools: true,
    }
  });

  win.loadFile(htmlPath);
  win.webContents.openDevTools();
  return win;
}

app.whenReady().then(() => {
  const win = createWindow();
  attachServices(win).then(() => {
    Logger.log(TAG, `[${win.id}] Services attached successfully.`);
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  }).catch(error => {
    Logger.error(`${TAG}: Failed to attach services:`, error);
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})