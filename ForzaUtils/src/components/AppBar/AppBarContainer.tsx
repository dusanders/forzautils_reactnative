import React, { useEffect } from "react";
import { Container, ContainerProps } from "../Container";
import { AppBar, AppBarProps } from "./AppBar";
import { StyleSheet, View } from "react-native";
import { useLogger } from "../../context/Logger";
import { ReplayBar } from "./ReplayBar";
import { useNetworkContext } from "../../context/Network";
import { invokeWithTheme } from "../../hooks/ThemeState";
import { ReplayState, useReplay } from "../../context/Recorder";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {

}

export function AppBarContainer(props: AppBarContainerProps) {
  const tag = `AppBarContainer.tsx`;
  const logger = useLogger();
  const replay = useReplay();
  const styles = themeStyles(Boolean(replay.replayState));

  const shouldShowReplayBar = () => {
    return replay.replayState !== ReplayState.IDLE 
    && replay.replayState !== ReplayState.RECORDING;
  }

  useEffect(() => {
    if (replay.replayState) {
      logger.log(tag, `replay: ${replay.replayInfo?.name}, state: ${replay.replayState}, position: ${replay.replayPosition}, length: ${replay.replayLength}`);
    }
  }, [replay.replayState]);

  return (
    <Container
      fill={'parent'}
      flex={'column'}
      style={styles.root}>
      <AppBar {...props} />
      <View style={styles.contentView}>
        {props.children}
      </View>
      {shouldShowReplayBar() && (
          <ReplayBar />
        )
      }
    </Container>
  )
}

function themeStyles(isReplay: boolean = false) {
  return invokeWithTheme((theme) => StyleSheet.create({
    root: {
      borderRadius: 0,
      padding: 0,
      margin: 0,
    },
    contentView: {
      paddingTop: theme.sizes.navBar + theme.sizes.borderRadius,
      paddingBottom: isReplay ? theme.sizes.navBar : 0,
    }
  }));
}