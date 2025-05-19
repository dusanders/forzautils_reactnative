import { configureStore } from "@reduxjs/toolkit";
import { IPermissionState, permissionReducer } from "./PermissionStore";
import { IThemeState, themeReducer } from "./ThemeStore";
import { ILocaleState, localeReducer } from "./LocaleStore";

export interface AppStoreState {
  permissions: IPermissionState;
  theme: IThemeState;
  locale: ILocaleState;
}

export const AppStore = configureStore({
  reducer: {
    permissions: permissionReducer,
    theme: themeReducer,
    locale: localeReducer
  },
});

export const useLocaleStore = () => AppStore.getState().locale;