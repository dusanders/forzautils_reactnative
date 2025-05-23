import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AppStoreState } from "./AppStore";
import { ForzaTelemetryApi, ITelemetryData } from "ForzaTelemetryApi";

export interface IWifiState {
  isConnected: boolean;
  isUdpListening: boolean;
  port: number;
  ip: string;
  packet?: ITelemetryData;
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
    setIp: (state, action: PayloadAction<string>) => {
      state.ip = action.payload
    },
    setPort: (state, action: PayloadAction<number>) => {
      state.port = action.payload;
    },
    setPacket: (state, action: PayloadAction<ITelemetryData>) => {
      state.packet = action.payload;
    },
    setUdpListening: (state, action: PayloadAction<boolean>) => {
      state.isUdpListening = action.payload;
    },
  }
});
export const { setWifiState, setPort, setIp, setPacket, setUdpListening } = wifiSlice.actions;
export const wifiReducer = wifiSlice.reducer;
export const useSetWifiState = () => {
  const dispatch = useDispatch();
  return (state: IWifiState) => dispatch(setWifiState(state));
}
export const useSetPacket = () => {
  const dispatch = useDispatch();
  return (packet: ITelemetryData) => dispatch(setPacket(packet));
}
export const useSetPort = () => {
  const dispatch = useDispatch();
  return (port: number) => dispatch(setPort(port));
}
export const useSetUdpListening = () => {
  const dispatch = useDispatch();
  return (isUdpListening: boolean) => dispatch(setUdpListening(isUdpListening));
}
export const useSetIp = () => {
  const dispatch = useDispatch();
  return (ip: string) => dispatch(setIp(ip));
}
export const getWifiState = (state: AppStoreState) => state.wifi;
export const getIsConnected = (state: AppStoreState) => state.wifi.isConnected;
export const getIsUdpListening = (state: AppStoreState) => state.wifi.isUdpListening;
export const getWifiPort = (state: AppStoreState) => state.wifi.port;
export const getWifiIp = (state: AppStoreState) => state.wifi.ip;
export const getForzaPacket = (state: AppStoreState) => state.wifi.packet;