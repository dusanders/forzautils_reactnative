import React from "react";
import { Container, ContainerProps } from "../Container";
import { AppBar, AppBarProps } from "./AppBar";
import { StyleSheet, View } from "react-native";
import { ReplayBar } from "./ReplayBar";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";

export interface AppBarContainerProps extends ContainerProps, AppBarProps {

}

export function AppBarContainer(props: AppBarContainerProps) {
  const tag = `AppBarContainer.tsx`;
  const theme = useThemeContext();
  // const replay = useReplay();
  // const styles = themeStyles(Boolean(replay.replayState));
  const styles = themeStyles(theme.theme, false);

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