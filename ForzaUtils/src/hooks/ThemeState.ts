import { ColorSchemeName } from "react-native";
import { IThemeElements, DarkColors, LightColors } from "../constants/Themes";
import { atom, useAtomValue } from "jotai";


export interface IThemeState {
  current: ColorSchemeName;
  theme: IThemeElements;
}
const initialState: IThemeState = {
  current: 'dark',
  theme: DarkColors,
};
export const useCurrentTheme = () => {
  return useAtomValue(themeAtom);
}
export const themeState = atom<IThemeState>(initialState);
export const themeAtom = atom((get) => get(themeState).theme);
export const themeTypeAtom = atom((get) => get(themeState).current);
export const setThemeAtom = atom(
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