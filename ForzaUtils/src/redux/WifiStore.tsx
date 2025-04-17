import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AppStoreState } from "./AppStore";
import { ForzaTelemetryApi } from "ForzaTelemetryApi";

export interface IWifiState {
  isConnected: boolean;
  isUdpListening: boolean;
  port: number;
  ip: string;
  packet?: ForzaTelemetryApi;
}

const initialState: IWifiState = {
  isConnected: false,
  isUdpListening: false,
  port: 0,
  ip: "",
  packet: undefined,
};
const wifiSlice = createSlice({
  name: "wifi",
  initialState: initialState,
  reducers: {
    setWifiState: (state, action: PayloadAction<IWifiState>) => {
      state.isConnected = action.payload.isConnected;
      state.isUdpListening = action.payload.isUdpListening;
      state.port = action.payload.port;
      state.ip = action.payload.ip;
      state.packet = action.payload.packet
    },
    setPort: (state, action: PayloadAction<number>) => {
      state.port = action.payload;
    },
    setUdpListening: (state, action: PayloadAction<boolean>) => {
      state.isUdpListening = action.payload;
    },
  }
});
export const { setWifiState, setPort, setUdpListening } = wifiSlice.actions;
export const wifiReducer = wifiSlice.reducer;
export const useSetWifiState = () => {
  const dispatch = useDispatch();
  return (state: IWifiState) => dispatch(setWifiState(state));
}
export const useSetPort = () => {
  const dispatch = useDispatch();
  return (port: number) => dispatch(setPort(port));
}
export const useSetUdpListening = () => {
  const dispatch = useDispatch();
  return (isUdpListening: boolean) => dispatch(setUdpListening(isUdpListening));
}
export const getWifiState = (state: AppStoreState) => state.wifi;
export const getIsConnected = (state: AppStoreState) => state.wifi.isConnected;
export const getIsUdpListening = (state: AppStoreState) => state.wifi.isUdpListening;
export const getWifiPort = (state: AppStoreState) => state.wifi.port;
export const getWifiIp = (state: AppStoreState) => state.wifi.ip;