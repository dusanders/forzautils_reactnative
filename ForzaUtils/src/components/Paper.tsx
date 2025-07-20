import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ContainerProps } from "./Container";
import { invokeWithTheme } from "../hooks/ThemeState";


export interface PaperProps extends ContainerProps {
  centerContent?: boolean;
}

export function Paper(props: PaperProps) {
  const styles = themeStyles();
  let variantStyle: StyleProp<ViewStyle> = {
    backgroundColor: invokeWithTheme(theme => theme.colors.background.onPrimary)
  }
  if (props.variant) {
    variantStyle.backgroundColor = invokeWithTheme(theme => theme.colors.background[props.variant!])
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

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    root: {
      padding: theme.sizes.borderRadius,
      borderRadius: theme.sizes.borderRadius,
      backgroundColor: theme.colors.background.onPrimary,
      width: '100%',
      overflow: 'hidden'
    },
  }));
}