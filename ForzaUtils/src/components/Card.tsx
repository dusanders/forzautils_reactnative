import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../hooks/useTheme";

export interface CardProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
}

export function Card(props: CardProps) {
  const styles = themeStyles(useTheme().theme);

  return (
    <View style={[styles.root, props.style]}>
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
      flexGrow: 1
    }
  })
}