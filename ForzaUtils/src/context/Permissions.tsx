import React, { useEffect, useState } from "react";
import { Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";
import { useSelector } from "react-redux";
import { PermissionError } from "../pages/PermissionError";
import { AppState, AppStateStatus, Platform } from "react-native";
import { setPermissionState } from "../redux/PermissionStore";
import { Splash } from "../pages/Splash";
import { AppStoreState } from "../redux/AppStore";

export interface PermissionsWatchProps {
  children?: any;
}

const androidPermissionList: Permission[] = [
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
]
const iosPermissionList: Permission[] = [
  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
]

export function PermissionsWatcher(props: PermissionsWatchProps) {
  const tag = "PermissionsWatch.tsx";
  const permissionState = useSelector((state: AppStoreState) => state.permissions);
  const [loaded, setLoaded] = useState(false);

  const ensurePermissions = async () => {
    console.log(`ensuring permissions...`);
    if(permissionState.isGranted == 'blocked') {
      setLoaded(true);
      return;
    }
    let permList = androidPermissionList;
    switch (Platform.OS) {
      case 'ios':
        permList = iosPermissionList
    };
    const systemPermissions = await requestMultiple(permList);
    console.log(`done checking ${JSON.stringify(systemPermissions)}`);
    let allAllowed = false;
    let allBlocked = false;
    let allDenied = false;
    permList.forEach((perm) => {
      allAllowed = systemPermissions[perm] === 'granted';
      allBlocked = systemPermissions[perm] === 'blocked';
      allDenied = systemPermissions[perm] === 'denied';
    });
    if (allAllowed) {
      setLoaded(true);
      setPermissionState({ isGranted: 'granted' });
    } else {
      setLoaded(true);
      setPermissionState({ isGranted: 'blocked' });
    }
  }

  // didMount initial logic
  useEffect(() => {
    const stateHandler = async (state: AppStateStatus) => {
      console.log(`APP CHANGE: ${state}`);
      if (state === 'active') {
        await ensurePermissions();
      }
    }
    let appStateSub = AppState.addEventListener('change', stateHandler);
    ensurePermissions();
    return () => {
      if (appStateSub) {
        appStateSub.remove();
      }
    }
  }, []);

  if (!loaded) return (<Splash />);
  if (permissionState.isGranted != undefined) return props.children;
  return (
    <PermissionError
      onIgnore={() => {
        setLoaded(true);
        setPermissionState({ isGranted: 'granted' });
      }}
      onOpenSettings={async () => {
        await ensurePermissions();
      }} />
  );
}