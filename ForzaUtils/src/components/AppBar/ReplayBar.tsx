import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { useLogger } from "../../context/Logger";
import { ThemeIcon } from "../ThemeIcon";
import { ReplayState, useNetworkContext } from "../../context/Network";
import { ThemeText } from "../ThemeText";
import { useCurrentTheme } from "../../hooks/ThemeState";

export interface ReplayBarProps {
}
export function ReplayBar(props: ReplayBarProps) {
  const tag = `ReplayBar.tsx`;
  const logger = useLogger();
  const network = useNetworkContext();
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.root}>
      <View>
        <TouchableOpacity
          onPress={() => {
            network.setReplayState(network.replayState === ReplayState.PLAYING
              ? ReplayState.PAUSED
              : ReplayState.PLAYING
            );
          }}>
          <ThemeIcon
            name={network.replayState === ReplayState.PLAYING ? 'pause' : 'play-arrow'}
            size={theme.sizes.icon} />
        </TouchableOpacity>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <ThemeText style={{ marginRight: theme.sizes.borderRadius }}>
          {network.replay?.currentReadOffset} / {network.replay?.info.length}
        </ThemeText>
        <ThemeText>
          {network.replay ? network.replay.info.name : 'No Replay'}
        </ThemeText>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            network.setReplayState(ReplayState.STOPPED);
            network.setReplaySession(undefined);
            logger.log(tag, `Stopped replay`);
          }}>
          <ThemeIcon
            name={'close'}
            size={theme.sizes.icon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      width: '100%',
      height: theme.sizes.navBar,
      backgroundColor: theme.colors.background.onPrimary,
      position: 'absolute',
      bottom: 0,
      zIndex: 100,
      elevation: 100,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.sizes.borderRadius,
    }
  })
}