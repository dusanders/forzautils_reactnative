import React from "react";
import { Container, ContainerProps } from "../Container";
import { AppBar, AppBarProps } from "./AppBar";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {
  
}

export function AppBarContainer(props: AppBarContainerProps) {
  const theme = useSelector(getTheme);
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
        paddingTop: theme.sizes.navBar + theme.sizes.borderRadius
      }}>
        {props.children}
      </View>
    </Container>
  )
}