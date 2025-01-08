import React from "react";
import { Container, ContainerProps } from "./Container";
import { AppBar, AppBarProps } from "./AppBar";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {

}

export function AppBarContainer(props: AppBarContainerProps) {
  const theme = useTheme();
  return (
    <Container
      fill={'parent'}
      flex={'column'}
      style={{
        borderRadius: 0,
        padding: 0,
        margin: 0,
      }}>
      <AppBar {...props} />
      <View style={{
        paddingTop: theme.theme.sizes.navBar + theme.theme.sizes.borderRadius
      }}>
        {props.children}
      </View>
    </Container>
  )
}