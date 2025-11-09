import { atom, useAtomValue, useSetAtom } from "jotai";
import { ThemeType, IThemeElements, LightColors, DarkColors, ForestTheme, ClaudesTheme } from "../types/Themes";

function getThemeByType(themeType: ThemeType): IThemeElements {
  switch (themeType) {
    case ThemeType.LIGHT:
      return LightColors;
    case ThemeType.DARK:
      return DarkColors;
    case ThemeType.FOREST:
      return ForestTheme;
    case ThemeType.CLAUDES:
      return ClaudesTheme;
    default:
      return DarkColors; // Fallback to dark theme
  }
}
export interface IThemeState {
  current: ThemeType;
  theme: IThemeElements;
}
const initialTheme = ThemeType.DARK;
const initialState: IThemeState = {
  current: initialTheme,
  theme: getThemeByType(initialTheme),
};
const themeState = atom<IThemeState>(initialState);
const themeAtom = atom((get) => get(themeState).theme);
const themeTypeAtom = atom<ThemeType>((get) => get(themeState).current);
const setThemeAtom = atom(
  initialState,
  (get, set, newTheme: ThemeType) => {
    const currentTheme = get(themeState);
    set(themeState, {
      ...currentTheme,
      current: newTheme,
      theme: getThemeByType(newTheme),
    });
  }
);

export function themeService() {
  const theme = useAtomValue(themeAtom);
  const themeType = useAtomValue(themeTypeAtom);
  const setTheme = useSetAtom(setThemeAtom);
  const updateTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };
  return {
    theme,
    themeType,
    updateTheme,
  };
}
export function invokeWithTheme<T>(fn: (theme: IThemeElements) => T): T {
  const colors = themeService().theme;
  return fn(colors);
}
export function useThemeColors() {
  return themeService().theme;
}