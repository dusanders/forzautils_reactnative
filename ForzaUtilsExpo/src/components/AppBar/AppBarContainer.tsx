import React, { useEffect } from "react";
import { Container, ContainerProps } from "../Container";
import { AppBar, AppBarProps } from "./AppBar";
import { StyleSheet, View } from "react-native";
import { ReplayBar } from "./ReplayBar";
import { invokeWithTheme } from "@/hooks/invokeWithTheme";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {

}

export function AppBarContainer(props: AppBarContainerProps) {
  const tag = `AppBarContainer.tsx`;
  // const replay = useReplay();
  // const styles = themeStyles(Boolean(replay.replayState));
  const styles = themeStyles(false);

  const shouldShowReplayBar = () => {
    // return replay.replayState !== ReplayState.IDLE 
    // && replay.replayState !== ReplayState.RECORDING;
  }

  return (
    <Container
      fill={'parent'}
      flex={'column'}
      style={styles.root}>
      <AppBar {...props} />
      <View style={styles.contentView}>
        {props.children}
      </View>
      {/* {shouldShowReplayBar() && (
          <ReplayBar />
        )
      } */}
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