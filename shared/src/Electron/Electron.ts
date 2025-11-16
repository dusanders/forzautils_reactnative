import { IWiFiInfoState } from "../WiFi/WiFi.types";


export const IpcActions_WiFi = {
  RequestWiFiInfo: "WiFiInfoRequest.RequestWiFiInfo",
};

export interface ContextBridge_WiFi {
  requestWiFiInfo: () => Promise<IWiFiInfoState>;
  onWifiInfoUpdated: (callback: (state: IWiFiInfoState) => void) => void;
}

export interface ElectronContextBridge {
  WiFiRequests: ContextBridge_WiFi;
}