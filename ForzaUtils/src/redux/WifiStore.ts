import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AppStoreState, useAppSelector } from "./AppStore";
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
  },
  selectors: {
    getWifiState: (state: IWifiState) => state,
    getIsConnected: (state: IWifiState) => state.isConnected,
    getIsUdpListening: (state: IWifiState) => state.isUdpListening,
    getWifiPort: (state: IWifiState) => state.port,
    getWifiIp: (state: IWifiState) => state.ip,
    getForzaPacket: (state: IWifiState) => state.packet,
  }
});
export const wifiReducer = wifiSlice.reducer;

export function useWifiViewModel() {
  const dispatch = useDispatch();
  const wifiState = useAppSelector(wifiSlice.selectors.getWifiState);
  const isConnected = useAppSelector(wifiSlice.selectors.getIsConnected);
  const isUdpListening = useAppSelector(wifiSlice.selectors.getIsUdpListening);
  const wifiPort = useAppSelector(wifiSlice.selectors.getWifiPort);
  const wifiIp = useAppSelector(wifiSlice.selectors.getWifiIp);
  const forzaPacket = useAppSelector(wifiSlice.selectors.getForzaPacket);
  return {
    wifiState,
    isConnected,
    isUdpListening,
    wifiPort,
    wifiIp,
    forzaPacket,
    setWifiState: (state: IWifiState) => dispatch(wifiSlice.actions.setWifiState(state)),
    setPort: (port: number) => dispatch(wifiSlice.actions.setPort(port)),
    setIp: (ip: string) => dispatch(wifiSlice.actions.setIp(ip)),
    setPacket: (packet: ITelemetryData) => dispatch(wifiSlice.actions.setPacket(packet)),
    setUdpListening: (isUdpListening: boolean) => dispatch(wifiSlice.actions.setUdpListening(isUdpListening)),
  }
}