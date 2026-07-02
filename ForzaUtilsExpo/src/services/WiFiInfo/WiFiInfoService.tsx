import { Logger } from "@/hooks/Logger";
import React from "react";
import { IWifiContext, INativeWifiService } from "./WiFiInfo.types";
import WifiServiceProvider from "./Provider/Provider";
import { useOnMount } from "@/hooks/useOnMount";

const WifiContext_React = React.createContext<IWifiContext>({
  wifiState: {
    ssid: null,
    ipAddress: null,
    isConnected: false,
  }
});

export interface WifiContextProviderProps {
  children?: React.ReactNode;
}

export function WifiContextProvider(props: WifiContextProviderProps) {
  const wifiServiceRef = React.useRef<INativeWifiService>(WifiServiceProvider.GetInstance());
  const [wifiState, setWifiState] = React.useState(wifiServiceRef.current.state);

  useOnMount(() => {
    let isMounted = true;

    async function fetchAndUpdateWiFiInfo() {
      await wifiServiceRef.current.fetchWiFiInfo();
      if (isMounted) {
        setWifiState({ ...wifiServiceRef.current.state });
      }
    }

    fetchAndUpdateWiFiInfo();

    const subscription = wifiServiceRef.current.onWiFiInfoChanged((newState) => {
      if (isMounted) {
        setWifiState({ ...newState });
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  });

  return (
    <WifiContext_React.Provider value={{ wifiState }}>
      {props.children}
    </WifiContext_React.Provider>
  );
}

export function useWifiContext(): IWifiContext {
  const ctx = React.useContext(WifiContext_React);
  if (!ctx) {
    throw new Error("useWifiContext must be used within a WifiContextProvider");
  }
  return ctx;
}