import { useContext } from "react";
import { ITheme, ThemeContext } from "../context/Theme";

export function useTheme(): ITheme {
  return useContext(ThemeContext);
}