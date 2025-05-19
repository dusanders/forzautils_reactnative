import { atom } from "jotai";

export interface IWifiState {
  isConnected: boolean;
  isUdpListening: boolean;
  port: number;
  ip: string;
}

export const initialState: IWifiState = {
  isConnected: false,
  isUdpListening: false,
  port: 0,
  ip: ""
};

export const wifiState = atom<IWifiState>(initialState);
