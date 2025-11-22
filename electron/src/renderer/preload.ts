import { contextBridge, ipcRenderer } from 'electron';
import { ElectronContextBridge, IpcActions_Cache, IpcActions_UDP, IpcActions_WiFi, IWiFiInfoState } from 'shared';
import { ITelemetryData } from 'shared';

const api: ElectronContextBridge = {
  WiFiRequests: {
    requestWiFiInfo: async (): Promise<any> => {
      const wifiInfo = await ipcRenderer.invoke(IpcActions_WiFi.RequestWiFiInfo);
      return wifiInfo;
    },
    onWifiInfoUpdated: (callback: (state: IWiFiInfoState) => void): void => {
      ipcRenderer.on(IpcActions_WiFi.WiFiInfoUpdated, (event, state) => {
        console.log("WiFiInfoUpdated event received:", state);
        callback(state);
      });
    }
  },
  UDPRequests: {
    openUDPSocket: async (port: number): Promise<number> => {
      const result = await ipcRenderer.invoke(IpcActions_UDP.OpenUDPSocket, port);
      return result;
    },
    getPort: async (): Promise<number> => {
      const result = await ipcRenderer.invoke(IpcActions_UDP.GetPort);
      return result;
    },
    closeUDPSocket: async (): Promise<void> => {
      await ipcRenderer.invoke(IpcActions_UDP.CloseUDPSocket);
    },
    onSocketData: (callback: (packet: ITelemetryData) => void): void => {
      ipcRenderer.on(IpcActions_UDP.SocketData, (event, packet) => {
        callback(packet);
      });
    },
    onSocketError: (callback: (error: Error) => void): void => {
      ipcRenderer.on(IpcActions_UDP.SocketError, (event, error) => {
        callback(error);
      });
    },
    onSocketClosed: (callback: () => void): void => {
      ipcRenderer.on(IpcActions_UDP.SocketClosed, () => {
        callback();
      });
    },
  },
  CacheRequests: {
    setItem: async <T>(key: string, value: T): Promise<void> => {
      await ipcRenderer.invoke(IpcActions_Cache.SetItem, key, value);
    },
    getItem: async <T>(key: string): Promise<T | null> => {
      const result = await ipcRenderer.invoke(IpcActions_Cache.GetItem, key);
      return result;
    },
    removeItem: async (key: string): Promise<void> => {
      await ipcRenderer.invoke(IpcActions_Cache.RemoveItem, key);
    },
  }
}
contextBridge.exposeInMainWorld('electronAPI', api);