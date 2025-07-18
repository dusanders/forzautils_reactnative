import { ColorSchemeName } from "react-native";
import { IThemeElements, DarkColors, LightColors, ForestTheme, ClaudesTheme } from "../constants/Themes";
import { atom, useAtomValue, useSetAtom } from "jotai";


export interface IThemeState {
  current: ColorSchemeName;
  theme: IThemeElements;
}
const initialState: IThemeState = {
  current: 'dark',
  theme: DarkColors,
};
const themeState = atom<IThemeState>(initialState);
const themeAtom = atom((get) => get(themeState).theme);
const themeTypeAtom = atom((get) => get(themeState).current);
const setThemeAtom = atom(
  initialState,
  (get, set, newTheme: ColorSchemeName) => {
    const currentTheme = get(themeState);
    set(themeState, {
      ...currentTheme,
      current: newTheme,
      theme: newTheme === 'dark' ? DarkColors : LightColors,
    });
  }
);

export function themeService() {
  const theme = useAtomValue(themeAtom);
  const themeType = useAtomValue(themeTypeAtom);
  const setTheme = useSetAtom(setThemeAtom);
  const updateTheme = (newTheme: ColorSchemeName) => {
    setTheme(newTheme);
  };
  return {
    theme,
    themeType,
    updateTheme,
  };
}