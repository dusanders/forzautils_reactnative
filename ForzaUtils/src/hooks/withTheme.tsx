import { ColorSchemeName } from "react-native";
import { DarkColors } from "../constants/Colors";

export type ThemeType = ColorSchemeName;
export function withTheme(theme: ThemeType) {
  switch(theme) {
    case 'dark': return DarkColors;
  }
  return DarkColors;
}