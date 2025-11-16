import { createContext, useContext, useEffect, useState } from "react";
import { ThemeType, IThemeElements, LightColors, DarkColors, ForestTheme, ClaudesTheme } from "./Themes";

export interface IThemeContext {
  currentTheme: ThemeType;
  theme: IThemeElements;
  setTheme(themeType: ThemeType): void;
}

const ThemeContext_React = createContext<IThemeContext>({
  currentTheme: ThemeType.DARK,
  theme: {} as IThemeElements,
  setTheme: (themeType: ThemeType) => {},
});

export interface IThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}

export function ThemeProvider(props: IThemeProviderProps) {
  const initialTheme = props.initialTheme || ThemeType.DARK;
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
  const [theme, setThemeElements] = useState<IThemeElements>({} as IThemeElements);

  const setTheme = (themeType: ThemeType) => {
    setCurrentTheme(themeType);
  };

  useEffect(() => {
    switch (currentTheme) {
      case ThemeType.LIGHT:
        setThemeElements(LightColors);
        break;
      case ThemeType.DARK:
        setThemeElements(DarkColors);
        break;
      case ThemeType.FOREST:
        setThemeElements(ForestTheme);
        break;
      case ThemeType.CLAUDES:
        setThemeElements(ClaudesTheme);
        break;
      default:
        setThemeElements(DarkColors);
        break;
    }
  }, [currentTheme]);

  return (
    <ThemeContext_React.Provider value={{ currentTheme, theme, setTheme }}>
      {props.children}
    </ThemeContext_React.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext_React);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}