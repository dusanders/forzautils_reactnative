import React, { useState, useEffect, createContext } from "react";
import { ColorSchemeName } from "react-native";
import { IThemeElements, DarkColors, LightColors } from "../constants/Themes";


export type ThemeType = ColorSchemeName;

export interface ITheme {
  current: ColorSchemeName;
  theme: IThemeElements;
  changeTheme(scheme: ColorSchemeName): void;
}

export const ThemeContext = createContext<ITheme>({} as ITheme);

export interface ThemeProviderProps {
  children?: any;
  initialMode: ColorSchemeName;
}

export function ThemeProvider(props: ThemeProviderProps) {
  const tag = "ThemeProvider";
  const withTheme = (theme: ThemeType) => {
    switch (theme) {
      case 'dark': return DarkColors;
      case 'light': return LightColors;
    }
    return DarkColors;
  }
  const ensureValidTheme = (theme: ColorSchemeName): ColorSchemeName => {
    if (theme !== 'dark' && theme !== 'light') {
      return 'dark'; // default to dark if invalid
    }
    return theme;
  }

  const [colors, setColors] = useState(withTheme(props.initialMode));
  const [scheme, setScheme] = useState<ColorSchemeName>(ensureValidTheme(props.initialMode));

  useEffect(() => {
    setColors(withTheme(scheme));
  }, [scheme]);

  useEffect(() => {
    setScheme(ensureValidTheme(props.initialMode));
  }, [props.initialMode]);

  return (
    <ThemeContext.Provider value={{
      current: scheme,
      theme: colors,
      changeTheme: (scheme) => { setScheme(ensureValidTheme(scheme)) }
    }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ITheme {
  return React.useContext(ThemeContext);
}