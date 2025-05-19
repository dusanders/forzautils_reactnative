import React, { useEffect } from "react";
import { Container, ContainerProps } from "../Container";
import { AppBar, AppBarProps } from "./AppBar";
import { View } from "react-native";
import { useLogger } from "../../context/Logger";
import { ReplayBar } from "./ReplayBar";
import { useNetworkContext } from "../../context/Network";
import { useCurrentTheme } from "../../hooks/ThemeState";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {

}

export function AppBarContainer(props: AppBarContainerProps) {
  const tag = `AppBarContainer.tsx`;
  const theme = useCurrentTheme();
  const logger = useLogger();
  const network = useNetworkContext();

  useEffect(() => {
    if (network.replay) {
      logger.log(tag, `replay: ${network.replay.info.name}`);
    }
  }, [network.replay]);

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
        paddingTop: theme.sizes.navBar + theme.sizes.borderRadius,
        paddingBottom: Boolean(network.replay) ? theme.sizes.navBar : 0,
      }}>
        {props.children}
      </View>
      {Boolean(network.replay) && (
        <ReplayBar />
      )}
    </Container>
  )
}