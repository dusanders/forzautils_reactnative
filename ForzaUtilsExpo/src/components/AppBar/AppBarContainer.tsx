import React from "react";
import { Container, ContainerProps } from "../Container";
import { AppBar, AppBarProps } from "./AppBar";
import { StyleSheet, View } from "react-native";
import { ReplayBar } from "./ReplayBar";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";
import { ReplayState, useRecorderService } from "@/services/Recorder/RecorderService";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {

}

export function AppBarContainer(props: AppBarContainerProps) {
  const tag = `AppBarContainer.tsx`;
  const theme = useThemeContext();
  const replay = useRecorderService();
  const styles = themeStyles(theme.theme, Boolean(replay.state.replayState));

  const shouldShowReplayBar = () => {
    return replay.state.replayState !== ReplayState.IDLE 
    && replay.state.replayState !== ReplayState.RECORDING;
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

function themeStyles(theme: IThemeElements, isReplay: boolean = false) {
  return StyleSheet.create({
    root: {
      borderRadius: 0,
      padding: 0,
      margin: 0,
    },
    contentView: {
      paddingTop: theme.sizes.navBar + theme.sizes.borderRadius,
      paddingBottom: isReplay ? theme.sizes.navBar : 0,
    }
  });
}