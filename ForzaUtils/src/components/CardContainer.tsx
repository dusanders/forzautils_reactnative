import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { invokeWithTheme } from "../hooks/ThemeState";

export interface CardContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  centerContent?: boolean; // Optional prop to center content
}

export function CardContainer(props: CardContainerProps) {
  const styles = themeStyles();
  const doCenter = props.centerContent ? styles.center : {};

  const styleCombined = {
    ...styles.root,
    ...props.style,
    ...doCenter,
  }
  return (
    <View
      style={styleCombined}>
      {props.children}
    </View>
  )
}
function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
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
      overflow: 'hidden'
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  }));
}