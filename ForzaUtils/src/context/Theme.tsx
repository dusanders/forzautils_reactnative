import React, { useState, useEffect, createContext } from "react";
import { ColorSchemeName } from "react-native";
import { IThemeElements, DarkColors, LighColors } from "../constants/Themes";
import { useLogger } from "./Logger";


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
      case 'light': return LighColors;
    }
    return DarkColors;
  }
  const logger = useLogger();
  const [colors, setColors] = useState(withTheme(props.initialMode));
  const [scheme, setScheme] = useState<ColorSchemeName>('dark');

  useEffect(() => {
    setColors(withTheme(scheme));
  }, [scheme]);

  return (
    <ThemeContext.Provider value={{
      current: scheme,
      theme: colors,
      changeTheme: (scheme) => { setScheme(scheme) }
    }}>
      {props.children}
    </ThemeContext.Provider>
  )
}
