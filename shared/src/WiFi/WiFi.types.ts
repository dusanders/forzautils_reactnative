export interface IWiFiInfoState {
  ssid: string | null;
  ipAddress: string | null;
  isConnected: boolean;
}

export interface ISocketState {
  port: number;
  isOpen: boolean;
}