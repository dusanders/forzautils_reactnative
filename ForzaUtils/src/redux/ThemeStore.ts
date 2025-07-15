import { ColorSchemeName } from "react-native";
import { DarkColors, IThemeElements, LightColors } from "../constants/Themes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./AppStore";

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
    setThemeType: (state, action: PayloadAction<ThemeType>) => {
      state.current = action.payload;
      state.theme = state.current === 'dark'
        ? DarkColors
        : LightColors;
    }
  },
  selectors:{
    getTheme: (state: IThemeState) => state.theme,
    getThemeType: (state: IThemeState) => state.current,
  }
});

export const themeReducer = themeSlice.reducer;

export function useThemeViewModel() {
  const dispatch = useDispatch();
  return {
    getTheme: () => useAppSelector(state => themeSlice.selectors.getTheme(state)),
    getThemeType: () => useAppSelector(state => themeSlice.selectors.getThemeType(state)),
    setTheme: (theme: ThemeType) => dispatch(themeSlice.actions.setTheme(theme)),
    setThemeType: (theme: ThemeType) => dispatch(themeSlice.actions.setThemeType(theme)),
  }
}