import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { ContainerProps } from "./Container";
import { useCurrentTheme } from "../hooks/ThemeState";


export interface PaperProps extends ContainerProps {
  centerContent?: boolean;
}

export function Paper(props: PaperProps) {
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  let variantStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.colors.background.onPrimary
  }
  if (props.variant) {
    variantStyle.backgroundColor = theme.colors.background[props.variant]
  }

  let centerContentStyle: StyleProp<ViewStyle> = {};
  if(props.centerContent) {
    centerContentStyle = {
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  return (
    <View
      {...props}
      style={[
        styles.root,
        variantStyle,
        centerContentStyle,
        props.style]}>
      {props.children}
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      padding: theme.sizes.borderRadius,
      borderRadius: theme.sizes.borderRadius,
      backgroundColor: theme.colors.background.onPrimary,
      width: '100%',
      overflow: 'hidden'
    },
  })
}