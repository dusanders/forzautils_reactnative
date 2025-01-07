import React, { useEffect, useState } from "react";
import { Splash } from "./Splash";
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from "@react-native-community/netinfo";
import { WifiError } from "../components/WifiError";
import { useTheme } from "../hooks/useTheme";
import { useColorScheme } from "react-native";
import { AppRoutes } from "../constants/types";
import { ForzaDataProvider } from "../context/ForzaData";

export interface PreflightProps {
  children?: any;
}

export function Preflight(props: PreflightProps) {
  const tag = "Preflight.tsx";
  const [loaded, setLoaded] = useState(false);
  const [netInfo, setNetInfo] = useState<NetInfoState>();
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDarkMode = colorScheme === 'dark';

  const isWifiConnected = (netInfo: NetInfoState | undefined) => {
    if (!netInfo) return false;
    console.log(`wifi ${netInfo.type === NetInfoStateType.wifi}`)
    return netInfo.type === NetInfoStateType.wifi;
  }

  useEffect(() => {
    let netInfoSub: NetInfoSubscription;
    if (loaded) {
      netInfoSub = addEventListener((state) => {
        setNetInfo(state);
      });
    }
    return () => {
      if (netInfoSub) {
        netInfoSub();
      }
    }
  }, [loaded]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, []);

  return loaded
    ? isWifiConnected(netInfo)
      ? (
        <ForzaDataProvider netInfo={netInfo!}>
          {props.children}
        </ForzaDataProvider>
      )
      : (<WifiError />)
    : (<Splash route={AppRoutes.SPLASH} />);
}