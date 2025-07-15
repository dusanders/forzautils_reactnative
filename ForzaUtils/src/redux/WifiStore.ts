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
export const { setWifiState, setPort, setIp, setPacket, setUdpListening } = wifiSlice.actions;
export const wifiReducer = wifiSlice.reducer;

export function useWifiViewModel() {
  const dispatch = useDispatch();
  return {
    getWifiState: () => useAppSelector(state => wifiSlice.selectors.getWifiState(state)),
    getIsConnected: () => useAppSelector(state => wifiSlice.selectors.getIsConnected(state)),
    getIsUdpListening: () => useAppSelector(state => wifiSlice.selectors.getIsUdpListening(state)),
    getWifiPort: () => useAppSelector(state => wifiSlice.selectors.getWifiPort(state)),
    getWifiIp: () => useAppSelector(state => wifiSlice.selectors.getWifiIp(state)),
    getForzaPacket: () => useAppSelector(state => wifiSlice.selectors.getForzaPacket(state)),
    setWifiState: (state: IWifiState) => dispatch(setWifiState(state)),
    setPort: (port: number) => dispatch(setPort(port)),
    setIp: (ip: string) => dispatch(setIp(ip)),
    setPacket: (packet: ITelemetryData) => dispatch(setPacket(packet)),
    setUdpListening: (isUdpListening: boolean) => dispatch(setUdpListening(isUdpListening)),
  }
}