import React from "react";
import { IThemeElements, TextOnBackground } from "../constants/Themes";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Assets } from "../assets";

export type FontFamily = 'regular' | 'light' | 'bold';
export type ThemeFontSize = 'small' | 'regular' | 'large';
export type ThemeTextVariant = keyof IThemeElements['colors']['text'];
export type ThemeTextVariantOnBackground = TextOnBackground;
export interface ThemeTextProps {
  variant?: ThemeTextVariant;
  onBackground?: ThemeTextVariantOnBackground
  children?: any;
  style?: StyleProp<TextStyle>;
  fontFamily?: FontFamily;
  fontSize?: ThemeFontSize;
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

  let fontSize = theme.theme.sizes.font.medium;
  switch(props.fontSize) {
    case 'large':
      fontSize = theme.theme.sizes.font.large;
      break;
    case 'small':
      fontSize = theme.theme.sizes.font.small;
      break;
  }

  const getFontForBg = (variant: ThemeTextVariant) => {
    if(!props.onBackground) {
      return theme.theme.colors.text[variant].onPrimary
    }
    return theme.theme.colors.text[variant][props.onBackground]
  }
  let fontColor = theme.theme.colors.text.primary.onPrimary;
  if(props.variant) {
    fontColor = getFontForBg(props.variant)
  }
  
  return (
    <Text style={[{
      color: fontColor,
      fontSize: fontSize,
      letterSpacing: 0.0,
      fontFamily: fontFamily,
      flexShrink: 1
    }, props.style]}>
      {props.children}
    </Text>
  )
}