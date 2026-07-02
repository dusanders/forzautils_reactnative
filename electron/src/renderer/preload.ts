import { contextBridge, ipcRenderer } from 'electron';
import { ElectronContextBridge, IpcActions_Cache, IpcActions_LocalLLM, IpcActions_UDP, IpcActions_WiFi, IWiFiInfoState } from 'shared';
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
    DEBUG: async (interval_ms: number): Promise<void> => {
      await ipcRenderer.invoke(IpcActions_UDP.DEBUG, interval_ms);
    },
    STOP_DEBUG: async (): Promise<void> => {
      await ipcRenderer.invoke(IpcActions_UDP.STOP_DEBUG);
    },
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
  },
  DatabaseRequests: {
    getAllSessions: async () => {
      const result = await ipcRenderer.invoke('DatabaseRequest.GetAllSessions');
      return result;
    },
    generateSession: async () => {
      const result = await ipcRenderer.invoke('DatabaseRequest.GenerateSession');
      return result;
    },
    close: async (): Promise<void> => {
      await ipcRenderer.invoke('DatabaseRequest.Close');
    },
  },
  SessionRequests: {
    addPacket: async (packet: ITelemetryData): Promise<void> => {
      await ipcRenderer.invoke('SessionRequest.AddPacket', packet);
    },
    readPacket: async (offset?: number): Promise<ITelemetryData | null> => {
      const result = await ipcRenderer.invoke('SessionRequest.ReadPacket', offset);
      return result;
    },
    close: async (): Promise<void> => {
      await ipcRenderer.invoke('SessionRequest.Close');
    },
    delete: async (): Promise<void> => {
      await ipcRenderer.invoke('SessionRequest.Delete');
    },
    open: async (info): Promise<any> => {
      const result = await ipcRenderer.invoke('SessionRequest.Open', info);
      return result;
    },
  },
  LocalLLMRequests: {
    testConnection: async (endpointBaseUrl: string): Promise<any> => {
      const result = await ipcRenderer.invoke(IpcActions_LocalLLM.TestConnection, endpointBaseUrl);
      return result;
    },
    listModels: async (endpointBaseUrl: string): Promise<any> => {
      const result = await ipcRenderer.invoke(IpcActions_LocalLLM.GetModels, endpointBaseUrl);
      return result;
    },
    startChatStream: async (request: any): Promise<any> => {
      const result = await ipcRenderer.invoke(IpcActions_LocalLLM.StartChatStream, request);
      return result;
    },
    stopChatStream: async (streamId: string): Promise<void> => {
      await ipcRenderer.invoke(IpcActions_LocalLLM.StopChatStream, streamId);
    },
  }
}
contextBridge.exposeInMainWorld('electronAPI', api);