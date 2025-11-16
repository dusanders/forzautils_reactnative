import { contextBridge, ipcRenderer } from 'electron';
import { ElectronContextBridge, IpcActions_WiFi } from 'shared';
// const {contextBridge, ipcRenderer} = require('electron');

const api: ElectronContextBridge = {
  WiFiRequests: {
    requestWiFiInfo: async (): Promise<any> => {
      const wifiInfo = await ipcRenderer.invoke(IpcActions_WiFi.RequestWiFiInfo);
      return wifiInfo;
    },
    onWifiInfoUpdated: (callback: (state: any) => void): void => {
      ipcRenderer.on('WiFiInfoUpdated', (event, state) => {
        console.log("WiFiInfoUpdated event received:", state);
        callback(state);
      });
    },
  }
}
contextBridge.exposeInMainWorld('electronAPI', api);