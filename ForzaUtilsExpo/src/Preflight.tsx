import React, { useEffect, useRef } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useColorScheme } from "./hooks/useColorScheme";
import { useFonts } from "expo-font";
import { App } from "./App";
import { useOnMount } from "./hooks/useOnMount";
import WifiServiceProvider from "./services/WiFiInfo/Provider/Provider";
import { Logger } from "./hooks/Logger";
import { WifiContextProvider } from "./services/WiFiInfo/WiFiInfoService";
import { NetworkProvider } from "./services/Forza/NetworkService";
import { INetworkService } from "./services/Forza/Network.types";
import SocketService from "./services/Forza/Provider/Provider";
const SpaceMono = require('./assets/fonts/SpaceMono-Regular.ttf');

export interface PreflightProps {
  // No props yet
}

const TAG = "Preflight.tsx";
export function Preflight(props: PreflightProps) {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: SpaceMono,
  });
  const networkServiceRef = useRef<INetworkService | null>(null);
  const [servicesReady, setServicesReady] = React.useState(false);

  const initializeServices = async () => {
    try {
      await WifiServiceProvider.Initialize();
      networkServiceRef.current = await SocketService.Initialize();
      // Initialize other services here as needed
      setServicesReady(true);
    } catch (error) {
      console.error("Error initializing services:", error);
    }
  };

  useEffect(() => {
    Logger.log(TAG, `Fonts loaded: ${loaded}, Services ready: ${servicesReady}`);
  }, [loaded, servicesReady]);

  useOnMount(() => {
    initializeServices();
  });

  if (!loaded || !servicesReady) {
    Logger.log(TAG, "Waiting for fonts and services to load...");
    return null;
  }
  Logger.log(TAG, "Fonts and services loaded, rendering App.");
  return (
    <ThemeProvider>
      <WifiContextProvider>
        <NetworkProvider networkService={networkServiceRef.current!}>
          <App />
        </NetworkProvider>
      </WifiContextProvider>
    </ThemeProvider>
  );
}