import { configureStore } from "@reduxjs/toolkit";
import { ILocaleState } from "../hooks/LocaleState";
import { IPermissionState } from "../hooks/PermissionState";
import { IThemeState } from "../hooks/ThemeState";
import { IWifiState, wifiReducer } from "./WifiStore";
import { permissionReducer } from "./PermissionStore";
import { themeReducer } from "./ThemeStore";
import { localeReducer } from "./LocaleStore";
import { useSelector } from "react-redux";


export interface AppStoreState {
  permissions: IPermissionState;
  wifi: IWifiState;
  theme: IThemeState;
  locale: ILocaleState;
}

export const AppStore = configureStore({
  reducer: {
    wifi: wifiReducer,
    permissions: permissionReducer,
    theme: themeReducer,
    locale: localeReducer
  },
});

export const useAppSelector = useSelector.withTypes<AppStoreState>();