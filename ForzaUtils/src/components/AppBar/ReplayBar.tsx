import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLogger } from "../../context/Logger";
import { ThemeIcon } from "../ThemeIcon";
import { ReplayState, useNetworkContext } from "../../context/Network";
import { ThemeText } from "../ThemeText";
import { invokeWithTheme } from "../../hooks/ThemeState";

export interface ReplayBarProps {
}
export function ReplayBar(props: ReplayBarProps) {
  const tag = `ReplayBar.tsx`;
  const logger = useLogger();
  const network = useNetworkContext();
  const styles = themeStyles();

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
            name={network.replayState === ReplayState.PLAYING ? 'pause' : 'play-arrow'} />
        </TouchableOpacity>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <ThemeText style={styles.replayProgressText}>
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
            name={'close'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
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
    },
    replayProgressText: {
      marginRight: theme.sizes.borderRadius,
    }
  }));
}