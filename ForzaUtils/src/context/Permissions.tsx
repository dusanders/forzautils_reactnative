import React, { useEffect, useState } from "react";
import { Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";
import { PermissionError } from "../pages/PermissionError";
import { AppState, AppStateStatus, Platform } from "react-native";
import { Splash } from "../pages/Splash";
import { permissionService } from "../hooks/PermissionState";
import { usePermissionViewModel } from "../redux/PermissionStore";

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
  const permissionVM = permissionService();
  const permissionViewModel = usePermissionViewModel();
  const [loaded, setLoaded] = useState(false);

  const ensurePermissions = async () => {
    if (permissionVM.permission == 'blocked') {
      setLoaded(true);
      return;
    }
    let permList = androidPermissionList;
    switch (Platform.OS) {
      case 'ios':
        permList = iosPermissionList
    };
    const systemPermissions = await requestMultiple(permList);
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
      permissionViewModel.setPermissionState({ isGranted: 'granted' });
      permissionVM.setPermission({ isGranted: 'granted' });
    } else {
      setLoaded(true);
      permissionViewModel.setPermissionState({ isGranted: 'blocked' });
      permissionVM.setPermission({ isGranted: 'blocked' });
    }
  }

  // didMount initial logic
  useEffect(() => {
    const stateHandler = async (state: AppStateStatus) => {
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
  if (permissionVM.permission != undefined) return props.children;
  return (
    <PermissionError
      onIgnore={() => {
        setLoaded(true);
        permissionViewModel.setPermissionState({ isGranted: 'granted' });
        permissionVM.setPermission({ isGranted: 'granted' });
      }}
      onOpenSettings={async () => {
        await ensurePermissions();
      }} />
  );
}