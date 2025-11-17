import { createContext, useEffect, useRef, useState } from "react";
import { IForzaService, INetworkService } from "./Network.types";
import { ITelemetryData } from "shared";
import { EmitterSubscription } from "react-native";
import { useOnMount } from "@/hooks/useOnMount";
import { useWifiContext } from "../WiFiInfo/WiFiInfoService";

const NetworkContext_React = createContext({} as IForzaService);

export interface NetworkProviderProps {
  children?: any;
  networkService: INetworkService;
}

const TAG = "NetworkProvider.tsx";
export function NetworkProvider(props: NetworkProviderProps) {
  const wifiService = useWifiContext();
  const [port, setPort] = useState<number>(props.networkService.port);
  const [isDEBUG, setIsDEBUG] = useState<boolean>(false);
  const packetListener = useRef<EmitterSubscription | undefined>(undefined);
  const lastPacket = useRef<ITelemetryData | undefined>(undefined);
  const service = useRef<INetworkService>(props.networkService);
  
  useOnMount(() => {
    packetListener.current = service.current.onPacket((packet: ITelemetryData) => {
      lastPacket.current = packet;
      setPort(service.current.port);
    });
    return () => {
      packetListener.current?.remove();
    }
  });

  return (
    <NetworkContext_React.Provider value={{
      port: port,
      isDEBUG: isDEBUG,
      lastPacket: lastPacket.current,
      isUDPListening: () => service.current.port > 0,
      onPacket: (fn) => service.current.onPacket(fn),
      DEBUG: () => {
        service.current.DEBUG();
        setIsDEBUG(true);
      },
      STOP_DEBUG: () => {
        service.current.STOP_DEBUG();
        setIsDEBUG(false);
      }
    }}>
      {props.children}
    </NetworkContext_React.Provider>
  );
}

export function useNetworkService() {
  const ctx = createContext(NetworkContext_React);
  if(!ctx) {
    throw new Error("useNetworkService must be used within a NetworkProvider");
  }
  return ctx;
}