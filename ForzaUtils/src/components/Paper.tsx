import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { BackgroundVariantType, IThemeElements } from "../constants/Themes";
import { Container, ContainerProps } from "./Container";
import { useTheme } from "../hooks/useTheme";


export interface PaperProps extends ContainerProps {

}

export function Paper(props: PaperProps) {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  let rootStyle = styles.root;
  if (props.variant) {
    rootStyle.backgroundColor = theme.theme.colors.background[props.variant]
  }
  return (
    <Container
      variant={props.variant}
      style={styles.root}
      {...props}>
      {props.children}
    </Container>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      flexGrow: 1,
      padding: theme.sizes.borderRadius,
      borderRadius: theme.sizes.borderRadius,
      backgroundColor: theme.colors.background.onPrimary,
      justifyContent: 'center',
      alignItems: 'center'
    },
  })
}