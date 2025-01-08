import React from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../hooks/useTheme";
import { LabelText, ThemeText, TitleText } from "./ThemeText";

export interface CardProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title?: string;
  body?: string;
  bodyStyle?: StyleProp<TextStyle>;
  allcapsTitle?: boolean;
  allcapsLabel?: boolean;
}

export function Card(props: CardProps) {
  const theme = useTheme().theme;
  const styles = themeStyles(theme);

  return (
    <View style={[styles.root, props.style]}>
      {props.title && (
        <TitleText
          style={props.titleStyle}
          allcaps={props.allcapsTitle}
          fontSize={'small'}>
          {props.title}
        </TitleText>
      )}
      {props.body && (
        <LabelText
          style={props.bodyStyle}
          allcaps={props.allcapsLabel}>
          {props.body}
        </LabelText>
      )}
      {props.children}
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      padding: theme.sizes.paper.padding,
      marginTop: theme.sizes.paper.spacingY / 2,
      marginBottom: theme.sizes.paper.spacingY / 2,
      marginLeft: theme.sizes.paper.spacingX / 2,
      marginRight: theme.sizes.paper.spacingX / 2,
      borderColor: theme.colors.background.onPrimary,
      borderWidth: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      width: '50%'
    }
  })
}