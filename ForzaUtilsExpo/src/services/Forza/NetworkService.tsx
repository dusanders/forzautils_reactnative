import { createContext, useEffect, useRef, useState } from "react";
import { IForzaService, INativeUDPService } from "./Network.types";
import { ITelemetryData } from "shared";
import { EmitterSubscription } from "react-native";
import { useOnMount } from "@/hooks/useOnMount";
import { useWifiContext } from "../WiFiInfo/WiFiInfoService";

const NetworkContext_React = createContext({} as IForzaService);

export interface NetworkProviderProps {
  children?: any;
  networkService: INativeUDPService;
}

const TAG = "NetworkProvider.tsx";
export function NetworkProvider(props: NetworkProviderProps) {
  const wifiService = useWifiContext();
  const [port, setPort] = useState<number>(props.networkService.port);
  const [isDEBUG, setIsDEBUG] = useState<boolean>(false);
  const packetListener = useRef<EmitterSubscription | undefined>(undefined);
  const lastPacket = useRef<ITelemetryData | undefined>(undefined);
  const service = useRef<INativeUDPService>(props.networkService);

  useOnMount(() => {
    packetListener.current = service.current.onPacket((packet: ITelemetryData) => {
      lastPacket.current = packet;
      setPort(service.current.port);
    });
    return () => {
      packetListener.current?.remove();
    }
  });

  useEffect(() => {
    if(wifiService.wifiState.isConnected) {
      if(!service.current.isListening()) {
        service.current.openSocket(9999).then(() => {
          setPort(service.current.port);
        });
      }
    }
  }, [wifiService.wifiState]);

  return (
    <NetworkContext_React.Provider value={{
      port: port,
      isDEBUG: isDEBUG,
      lastPacket: lastPacket.current,
      shutdown: async () => {
        await service.current.closeSocket();
      },
      isUDPListening: () => service.current.port > 0,
      onPacket: (fn) => service.current.onPacket(fn),
      DEBUG: (interval_ms) => {
        service.current.DEBUG(interval_ms);
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
  if (!ctx) {
    throw new Error("useNetworkService must be used within a NetworkProvider");
  }
  return ctx;
}