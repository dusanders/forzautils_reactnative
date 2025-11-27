import React, { useRef } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useColorScheme } from "./hooks/useColorScheme";
import { useFonts } from "expo-font";
import { useOnMount } from "./hooks/useOnMount";
import WifiServiceProvider from "./services/WiFiInfo/Provider/Provider";
import { WifiContextProvider } from "./services/WiFiInfo/WiFiInfoService";
import { NetworkProvider } from "./services/Forza/NetworkService";
import { INativeUDPService } from "./services/Forza/Network.types";
import SocketService from "./services/Forza/Provider/Provider";
import { ThemeType } from "./theme/Themes";
import { Semaphore } from "./helpers/Semaphore";
import { TuningViewModelProvider } from "./viewModels/Tuning/TuningViewModel";
import App from "./App";
import { CacheProvider } from "./services/Cache/Cache";
import { RecorderService, RecorderServiceProvider } from "./services/Recorder/RecorderService";
import { GripViewModel } from "./viewModels/Grip/GripViewModel";
const SpaceMono = require('./assets/fonts/SpaceMono-Regular.ttf');

export interface PreflightProps {
  // No props yet
}
const initializeSemaphore = new Semaphore(1);
const TAG = "Preflight.tsx";
export function Preflight(props: PreflightProps) {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: SpaceMono,
  });
  const networkServiceRef = useRef<INativeUDPService | null>(null);
  const recorderServiceRef = useRef<RecorderService | null>(null);
  const [servicesReady, setServicesReady] = React.useState(false);

  const initializeServices = async () => {
    await initializeSemaphore.acquire();
    try {
      await WifiServiceProvider.Initialize();
      networkServiceRef.current = await SocketService.Initialize();
      recorderServiceRef.current = await RecorderService.Initialize(networkServiceRef.current);
      setServicesReady(true);
    } catch (error) {
      console.error("Error initializing services:", error);
    } finally {
      initializeSemaphore.release();
    }
  };

  useOnMount(() => {
    initializeServices();
    return () => {
      networkServiceRef.current?.closeSocket();
      recorderServiceRef.current?.shutdown();
      setServicesReady(false);
    }
  });

  if (!loaded || !servicesReady) {
    return null;
  }

  return (
    <CacheProvider>
      <ThemeProvider initialTheme={ThemeType.DARK}>
        <WifiContextProvider>
          <NetworkProvider networkService={networkServiceRef.current!}>
            <RecorderServiceProvider>
              <TuningViewModelProvider>
                <GripViewModel />
                <App />
              </TuningViewModelProvider>
            </RecorderServiceProvider>
          </NetworkProvider>
        </WifiContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}