import { ColorSchemeName } from "react-native";
import { DarkColors, IThemeElements, LightColors, ThemeType } from "../constants/Themes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./AppStore";

export interface IThemeState {
  current: ThemeType;
  theme: IThemeElements;
}
const initialState: IThemeState = {
  current: ThemeType.DARK,
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

export function useReduxTheme() {
  const dispatch = useDispatch();
  const theme = useAppSelector(themeSlice.selectors.getTheme);
  const themeType = useAppSelector(themeSlice.selectors.getThemeType);
  return {
    theme,
    themeType,
    setTheme: (theme: ThemeType) => dispatch(themeSlice.actions.setTheme(theme)),
    setThemeType: (theme: ThemeType) => dispatch(themeSlice.actions.setThemeType(theme)),
  }
}