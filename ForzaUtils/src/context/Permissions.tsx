import React, { useEffect, useState } from "react";
import { Permission, PERMISSIONS, requestMultiple } from "react-native-permissions";
import { useSelector } from "react-redux";
import { PermissionError } from "../pages/PermissionError";
import { AppState, Platform } from "react-native";
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
    let permList = androidPermissionList;
    switch (Platform.OS) {
      case 'ios':
        permList = iosPermissionList
    };
    const systemPermissions = await requestMultiple(permList);
    let allAllowed = false
    permList.forEach((perm) => {
      allAllowed = systemPermissions[perm] === 'granted';
    });
    if (!allAllowed) {
      setLoaded(true);
      setPermissionState({ isGranted: false });
    } else {
      setLoaded(true);
      setPermissionState({ isGranted: true });
    }
  }

  // didMount initial logic
  useEffect(() => {
    let appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        ensurePermissions();
      }
    })
    ensurePermissions();
    return () => {
      if (appStateSub) {
        appStateSub.remove();
      }
    }
  }, []);

  if(!loaded) return (<Splash />);
  if(!permissionState.isGranted) return props.children;
  return (
    <PermissionError
      onIgnore={() => {
        setLoaded(true);
        setPermissionState({ isGranted: true });
      }}
      onOpenSettings={async () => {
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
          setPermissionState({ isGranted: false })
        } else {
          setLoaded(true);
          setPermissionState({ isGranted: true });
        }
      }} />
  );
}