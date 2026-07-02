export interface ISupportRendererService {
  attachHandlers(ipcMain: Electron.IpcMain): void;
}