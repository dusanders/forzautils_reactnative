import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";
import { Logger, useLogger } from "./Logger";

export interface IWifiContext {
  isWifi: boolean;
  ipString: string;
}

const WifiContext = createContext({} as IWifiContext);

export interface WifiProviderProps {
  children?: React.ReactNode;
}

export function WifiProvider(props: WifiProviderProps) {
  const tag = 'WifiProvider.tsx';
  const logger = useLogger();
  const [isWifi, setIsWifi] = useState(false);
  const [ipString, setIpString] = useState('');

  useEffect(() => {
    let netInfoSub: NetInfoSubscription = addEventListener((state: NetInfoState) => {
      if (!state || state.type !== NetInfoStateType.wifi) {
        setIsWifi(false);
        setIpString('');
      } else if (state.type === NetInfoStateType.wifi && state.isConnected) {
        setIsWifi(true);
        setIpString(state.details.ipAddress || '');
      }
    });
    return () => {
      if (netInfoSub)
        netInfoSub();
      setIpString('');
      setIsWifi(false);
    }
  }, []);

  logger.log(tag, `Rendering WifiProvider.tsx - isWifi: ${isWifi}, ipString: ${ipString}`);
  
  return (
    <WifiContext.Provider value={{
      isWifi,
      ipString
    }}>
      {props.children}
    </WifiContext.Provider>
  );
}

export function useWifi() {
  const context = useContext(WifiContext);
  if (!context) {
    throw new Error('useWifi must be used within a WifiProvider');
  }
  return context;
}