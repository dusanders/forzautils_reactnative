import { Action, combineReducers, configureStore, Middleware, UnknownAction } from "@reduxjs/toolkit";
import { ILocaleState } from "../hooks/LocaleState";
import { IPermissionState } from "../hooks/PermissionState";
import { IThemeState } from "../hooks/ThemeState";
import { permissionReducer } from "./PermissionStore";
import { themeReducer } from "./ThemeStore";
import { localeReducer, localeSlice } from "./LocaleStore";
import { useSelector } from "react-redux";

const testMw: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const actionTyped: UnknownAction = action as UnknownAction;
  if (actionTyped.type.startsWith(`${localeSlice.name}`)) {
    console.log("Middleware action:", actionTyped.type);
    switch (actionTyped.type) {
      case localeSlice.actions.setLocale.type:
        console.log("Locale changed to:", actionTyped.payload);
        break;
      default:
        console.log("Unhandled locale action:", actionTyped.type);
        break;
    }
  }
  return next(action);
};

export interface AppStoreState {
  permissions: IPermissionState;
  theme: IThemeState;
  locale: ILocaleState;
}
const rootReducer = combineReducers({
  permissions: permissionReducer,
  theme: themeReducer,
  locale: localeReducer,
})
export const AppStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(testMw)
});
type RootState = ReturnType<typeof rootReducer>;

export const useAppSelector = useSelector.withTypes<AppStoreState>();