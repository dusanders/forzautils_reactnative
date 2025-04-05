import React from "react";
import { IThemeElements } from "../constants/Themes";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../context/Theme";

export interface CardContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  centerContent?: boolean; // Optional prop to center content
}

export function CardContainer(props: CardContainerProps) {
  const theme = useTheme().theme;
  const styles = themeStyles(theme);
  const centerContentStyle: StyleProp<ViewStyle> = {
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <View
      style={[
        styles.root,
        props.centerContent
          ? centerContentStyle
          : {},
        props.style]}>
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
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  });
}