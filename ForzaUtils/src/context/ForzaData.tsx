import { NetInfoState, NetInfoWifiState } from "@react-native-community/netinfo";
import { ForzaTelemetryApi } from "ForzaTelemetryApi";
import React, { createContext, useState } from "react";

export interface ForzaData {
  port: number;
  ip: string;
  ssid: string;
  packet: ForzaTelemetryApi | undefined;
}

export const ForzaContext = createContext({} as ForzaData);

export interface ForzaDataProviderProps {
  netInfo: NetInfoState;
  children?: any;
}

export function ForzaDataProvider(props: ForzaDataProviderProps) {
  const port = 5200;
  const inetInfo = props.netInfo as NetInfoWifiState;
  const [packet, setPacket] = useState<ForzaTelemetryApi | undefined>(undefined);
  return (
    <ForzaContext.Provider value={{
      port: port,
      ip: inetInfo.details.ipAddress || '-',
      ssid: inetInfo.details.ssid || '-',
      packet: packet
    }}>
      {props.children}
    </ForzaContext.Provider>
  )
}