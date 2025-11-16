import { app, BrowserWindow } from 'electron/main';
import { ipcMain } from 'electron/main';
import * as Path from 'path';
import { WifiServiceProvider } from './services/WiFi/WiFiService.js';
const __dirname = import.meta.dirname;

const RendererChannel = ipcMain;
const TAG = "Main";
const preloadPath = Path.join(__dirname, 'renderer', 'preload.js');
const htmlPath = Path.join(__dirname, '../public/index.html');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
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
  const wifiServiceProvider = new WifiServiceProvider(win);
  wifiServiceProvider.attachHandlers(ipcMain);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})