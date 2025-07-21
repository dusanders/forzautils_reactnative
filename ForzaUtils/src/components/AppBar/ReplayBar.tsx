import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLogger } from "../../context/Logger";
import { ThemeIcon } from "../ThemeIcon";
import { ThemeText } from "../ThemeText";
import { invokeWithTheme } from "../../hooks/ThemeState";
import { ReplayState, useReplay } from "../../context/Recorder";

export interface ReplayBarProps {
}
export function ReplayBar(props: ReplayBarProps) {
  const tag = `ReplayBar.tsx`;
  const logger = useLogger();
  const replay = useReplay();
  const styles = themeStyles();

  return (
    <View style={styles.root}>
      <View>
        <TouchableOpacity
          onPress={() => {
            if(replay.replayState === ReplayState.PLAYING){
              replay.pause();
            } else {
              replay.resume();
            }
          }}>
          <ThemeIcon
            name={replay.replayState === ReplayState.PLAYING ? 'pause' : 'play-arrow'} />
        </TouchableOpacity>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <ThemeText style={styles.replayProgressText}>
          {replay.replayPosition} / {replay.replayLength}
        </ThemeText>
        <ThemeText>
          {replay.replayPacket ? replay.replayInfo?.name : 'No Replay'}
        </ThemeText>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            replay.closeReplay();
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