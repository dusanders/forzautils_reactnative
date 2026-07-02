import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ContainerProps } from "./Container";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";


export interface PaperProps extends ContainerProps {
  centerContent?: boolean;
}

export function Paper(props: PaperProps) {
  const theme = useThemeContext();
  const styles = themeStyles(theme.theme);
  let variantStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.theme.colors.background.onPrimary
  }
  if (props.variant) {
    variantStyle.backgroundColor = theme.theme.colors.background[props.variant!]
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
  });
}