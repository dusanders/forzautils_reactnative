import { Assets } from "@/assets";
import { useThemeContext } from "@/theme/ThemeProvider";
import { TextOnBackgroundVariant, TextVariantType } from "@/theme/Themes";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

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

function getFontFamily(fontFamily?: FontFamily) {
  switch (fontFamily) {
    case 'bold':
      return Assets.SupportedFonts.Bold;
    case 'light':
      return Assets.SupportedFonts.Light;
    default:
      return Assets.SupportedFonts.Regular;
  }
}

function getFontSize(theme: any, fontSize?: ThemeFontSize) {
  switch (fontSize) {
    case 'large':
      return theme.sizes.font.large;
    case 'small':
      return theme.sizes.font.small;
    default:
      return theme.sizes.font.medium;
  }
}

export function ThemeText(props: ThemeTextProps) {
  const theme = useThemeContext().theme;
  const doCaps = props.allcaps ?? false;

  let fontFamily = getFontFamily(props.fontFamily);

  let fontSize = getFontSize(theme, props.fontSize);

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