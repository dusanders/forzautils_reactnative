
import { ITelemetryData } from "ForzaTelemetryApi";


export const IpcActions_WiFi = {
  RequestWiFiInfo: "WiFiInfoRequest.RequestWiFiInfo",
  WiFiInfoUpdated: "WiFiInfoRequest.WiFiInfoUpdated",
};

export const IpcActions_UDP = {
  DEBUG: "UDPRequest.DEBUG",
  STOP_DEBUG: "UDPRequest.STOP_DEBUG",
  OpenUDPSocket: "UDPRequest.OpenUDPSocket",
  GetPort: "UDPRequest.GetPort",
  CloseUDPSocket: "UDPRequest.CloseUDPSocket",
  SocketData: "UDPRequest.SocketData",
  SocketError: "UDPRequest.SocketError",
  SocketClosed: "UDPRequest.SocketClosed",
}

export interface ContextBridge_UDP {
  DEBUG: (interval_ms: number) => Promise<void>;
  STOP_DEBUG: () => Promise<void>;
  openUDPSocket: (port: number) => Promise<number>;
  getPort: () => Promise<number>;
  onSocketData: (callback: (packet: ITelemetryData) => void) => void;
  onSocketError: (callback: (error: Error) => void) => void;
  onSocketClosed: (callback: () => void) => void;
  closeUDPSocket: () => Promise<void>;
}

export interface ContextBridge_WiFi {
  requestWiFiInfo: () => Promise<IWiFiInfoState>;
  onWifiInfoUpdated: (callback: (state: IWiFiInfoState) => void) => void;
}

export interface IWiFiInfoState {
  ssid: string | null;
  ipAddress: string | null;
  isConnected: boolean;
}