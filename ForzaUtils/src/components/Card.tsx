import React from "react";
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../hooks/useTheme";
import { LabelText, ThemeText, TitleText } from "./ThemeText";

export interface CardProps {
  id?: string;
  children?: any;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title?: string;
  body?: string;
  bodyStyle?: StyleProp<TextStyle>;
  allcapsTitle?: boolean;
  allcapsLabel?: boolean;
  centerContent?: boolean;
  onPress?: (id?: string) => void;
}

export function Card(props: CardProps) {
  const theme = useTheme().theme;
  const styles = themeStyles(theme);
  const centerContentStyle: StyleProp<ViewStyle> = {
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <TouchableOpacity
      disabled={!Boolean(props.onPress)}
      style={[
        styles.root,
        props.centerContent
          ? centerContentStyle
          : {},
        props.style]}
      onPress={() => {
        if (props.onPress) {
          props.onPress(props.id)
        }
      }}>
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
    </TouchableOpacity>
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
      display: 'flex',
      flexDirection: 'column',
    }
  })
}