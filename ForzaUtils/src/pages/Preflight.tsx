import React, { useEffect, useState } from "react";
import { Splash } from "./Splash";
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from "@react-native-community/netinfo";
import { WifiError } from "./WifiError";
import { useTheme } from "../hooks/useTheme";
import { AppState, Linking, Platform, useColorScheme } from "react-native";
import { AppRoutes } from "../constants/types";
import { ForzaContextProvider } from "../context/ForzaData";
import { useLogger } from "../context/Logger";
import { Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";
import { PermissionError } from "./PermissionError";

export interface PreflightProps {
  children?: any;
}

const androidPermissionList: Permission[] = [
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
]
const iosPermissionList: Permission[] = [
  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
]
export function Preflight(props: PreflightProps) {
  const tag = "Preflight.tsx";
  const logger = useLogger();
  const [loaded, setLoaded] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [netInfo, setNetInfo] = useState<NetInfoState>();
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDarkMode = colorScheme === 'dark';

  const isWifiConnected = (netInfo: NetInfoState | undefined) => {
    if (!netInfo) {
      logger.error(tag, `Failed to get NetInfo! ${JSON.stringify(netInfo)}`);
      return false
    };

    return netInfo.type === NetInfoStateType.wifi;
  }

  const ensurePermissions = async () => {
    let permList = androidPermissionList;
    switch (Platform.OS) {
      case 'ios':
        permList = iosPermissionList
    };
    const systemPermissions = await requestMultiple(permList);
    let allAllowed = false
    permList.forEach((perm) => {
      console.log(`Perm ${perm} -> ${systemPermissions[perm]}`)
      allAllowed = systemPermissions[perm] === 'granted';
    });
    console.log(`all allowed ${allAllowed}`);
    if (!allAllowed) {
      setLoaded(true);
      setHasPermissions(false);
    } else {
      setLoaded(true);
      setHasPermissions(true);
    }
  }

  // didMount initial logic
  useEffect(() => {
    let netInfoSub: NetInfoSubscription = addEventListener((state) => {
      setNetInfo(state);
    });
    let appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        ensurePermissions();
      }
    })
    ensurePermissions();
    return () => {
      if (netInfoSub) {
        netInfoSub();
      }
      if (appStateSub) {
        appStateSub.remove();
      }
    }
  }, []);

  if (!loaded) {
    return (<Splash/>)
  }
  if (!hasPermissions) {
    return (
      <PermissionError
        onIgnore={() => {
          setHasPermissions(true);
        }}
        onOpenSettings={() => {
          Linking.openSettings();
        }} />
    )
  }
  // Disable WiFi check for offline usage
  // if (!isWifiConnected(netInfo)) {
  //   return (
  //     <WifiError />
  //   )
  // }
  return (
    <ForzaContextProvider netInfo={netInfo!}>
      {props.children}
    </ForzaContextProvider>
  );
}