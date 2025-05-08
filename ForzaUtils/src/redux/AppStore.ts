import { configureStore } from "@reduxjs/toolkit";
import { IWifiState, wifiReducer } from "./WifiStore";
import { IPermissionState, permissionReducer } from "./PermissionStore";
import { IThemeState, themeReducer } from "./ThemeStore";
import { ILocaleState, localeReducer } from "./LocaleStore";

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

export const useLocaleStore = () => AppStore.getState().locale;