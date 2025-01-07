import React from "react";
import { IThemeElements } from "../constants/Themes";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Assets } from "../assets";

export type FontFamily = 'regular' | 'light' | 'bold';
export type ThemeFontSize = 'small' | 'regular' | 'large';
export interface ThemeTextProps {
  variant?: keyof IThemeElements['colors']['text'];
  children?: any;
  style?: StyleProp<TextStyle>;
  fontFamily?: FontFamily;
}
export function ThemeText(props: ThemeTextProps) {
  const theme = useTheme();
  let fontFamily = Assets.SupportedFonts.Regular;
  switch(props.fontFamily) {
    case 'bold': 
      fontFamily = Assets.SupportedFonts.Bold;
      break;
    case 'light':
      fontFamily = Assets.SupportedFonts.Light;
  }
  console.log(`use font ${fontFamily}`)
  return (
    <Text style={[{
      color: props.variant ? theme.theme.colors.text[props.variant] : theme.theme.colors.text.primary,
      fontSize: theme.theme.sizes.font.medium,
      letterSpacing: 0.0,
      fontFamily: fontFamily
    }, props.style]}>
      {props.children}
    </Text>
  )
}