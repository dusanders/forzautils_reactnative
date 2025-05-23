import React from "react";
import { TextOnBackgroundVariant, TextVariantType } from "../constants/Themes";
import { StyleProp, Text, TextStyle } from "react-native";
import { Assets } from "../assets";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";

export type FontFamily = 'regular' | 'light' | 'bold';
export type ThemeFontSize = 'small' | 'regular' | 'large';

export interface ThemeTextProps {
  variant?: TextVariantType;
  onBackground?: TextOnBackgroundVariant
  children?: any;
  style?: StyleProp<TextStyle>;
  fontFamily?: FontFamily;
  fontSize?: ThemeFontSize;
  allcaps?: boolean;
  testID?: string; // for testing purposes
}
export function ThemeText(props: ThemeTextProps) {
  const theme = useSelector(getTheme);
  const doCaps = props.allcaps ?? false;
  let fontFamily = Assets.SupportedFonts.Regular;
  switch (props.fontFamily) {
    case 'bold':
      fontFamily = Assets.SupportedFonts.Bold;
      break;
    case 'light':
      fontFamily = Assets.SupportedFonts.Light;
  }

  let fontSize = theme.sizes.font.medium;
  switch (props.fontSize) {
    case 'large':
      fontSize = theme.sizes.font.large;
      break;
    case 'small':
      fontSize = theme.sizes.font.small;
      break;
  }

  const getFontForBg = (variant: TextVariantType) => {
    if (!props.onBackground) {
      return theme.colors.text[variant].onPrimary
    }
    return theme.colors.text[variant][props.onBackground]
  }
  let fontColor = theme.colors.text.primary.onPrimary;
  if (props.variant) {
    fontColor = getFontForBg(props.variant)
  } else if (props.onBackground) {
    fontColor = getFontForBg('primary')
  }

  return (
    <Text testID={props.testID}
      style={[{
        color: fontColor,
        fontSize: fontSize,
        fontFamily: fontFamily,
        textTransform: doCaps ? 'uppercase' : 'none',
        fontWeight: props.fontFamily === 'bold'
          ? 700
          : props.fontFamily === 'light'
            ? 200
            : 400,
        letterSpacing: props.fontFamily === 'bold' ? 0.6 : 0
      }, props.style]}>
      {props.children}
    </Text>
  )
}

export function TitleText(props: ThemeTextProps) {
  return (
    <ThemeText
      allcaps={props.allcaps}
      fontFamily={'bold'}
      style={[{
        fontSize: 18,
        letterSpacing: 1.3
      }, props.style]}>
      {props.children}
    </ThemeText>
  )
}
export function LabelText(props: ThemeTextProps) {
  return (
    <ThemeText
      fontFamily={'light'}
      allcaps={props.allcaps}
      style={[{
        marginTop: 4,
        letterSpacing: 0.4,
        opacity: 0.7,
        flexWrap: 'wrap'
      }, props.style]}>
      {props.children}
    </ThemeText>
  )
}