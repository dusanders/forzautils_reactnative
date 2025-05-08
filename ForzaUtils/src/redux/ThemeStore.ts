import { ColorSchemeName } from "react-native";
import { DarkColors, IThemeElements, LightColors } from "../constants/Themes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { AppStoreState } from "./AppStore";

export type ThemeType = ColorSchemeName;
export interface IThemeState {
  current: ThemeType;
  theme: IThemeElements;
}
const initialState: IThemeState = {
  current: 'dark',
  theme: DarkColors,
};
export interface IThemeActions {
  setTheme: (state: IThemeState, action: { payload: { current: ThemeType } }) => void;
  setThemeType: (state: IThemeState, action: { payload: { current: ThemeType } }) => void;
}

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.current = action.payload;
      state.theme = state.current === 'dark'
        ? DarkColors
        : LightColors;
    },
  }
});

export const { setTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
export const useSetTheme = () => {
  const dispatch = useDispatch();
  return (theme: ThemeType) => dispatch(setTheme(theme));
}
export const getTheme  = (state: AppStoreState) => state.theme.theme;
export const getThemeType = (state: AppStoreState) => state.theme.current;