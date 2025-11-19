import React, { useEffect } from "react";
import Slider from "@react-native-community/slider";
import { EmitterSubscription, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemeIcon, ThemeIconNames } from "../ThemeIcon";
import { ThemeText } from "../ThemeText";
// import { ReplayState, useReplay } from "../../context/Recorder";
import { ITelemetryData } from "ForzaTelemetryApi";
import { Logger } from "@/hooks/Logger";
import { ReplayState } from "@/services/Recorder/RecorderService";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";

export interface ReplayBarProps {
}
export function ReplayBar(props: ReplayBarProps) {
  const tag = `ReplayBar.tsx`;
  const theme = useThemeContext();
  // const replay = useReplay();
  const replay = {} as any;
  const styles = themeStyles(theme.theme);
  const [position, setPosition] = React.useState<number>(replay.replayPosition);
  const isSeekingRef = React.useRef(false);

  useEffect(() => {
    let replayListener: EmitterSubscription | undefined = undefined;
    if (replay) {
      replayListener = replay.onPacket((packet: ITelemetryData, currentPosition: number) => {
        if (!isSeekingRef.current) {
          setPosition(currentPosition);
        }
      });
    }
    return () => {
      replayListener?.remove();
    };
  }, [replay.replayState]);

  return (
    <View style={styles.root}>
      <View>
        <TouchableOpacity
          onPress={() => {
            if (replay.replayState === ReplayState.PLAYING) {
              replay.pause();
            } else {
              replay.resume();
            }
          }}>
          <ThemeIcon
            name={replay.replayState === ReplayState.PLAYING ? ThemeIconNames.PAUSE : ThemeIconNames.PLAY} />
        </TouchableOpacity>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={replay.replayLength || 0}
          step={1}
          value={position}
          onSlidingStart={() => {
            isSeekingRef.current = true;
          }}
          onValueChange={(value) => {
            setPosition(value);
          }}
          onSlidingComplete={(value) => {
            const target = Math.round(value);
            isSeekingRef.current = false;
            Logger.log(tag, `Seeking to position ${target}`);
            replay.seek(target);
            // if (typeof replay.seek === "function") {
            //   replay.seek(target);
            // } else if (typeof replay.seekTo === "function") {
            //   replay.seekTo(target);
            // } else if (typeof replay.setReplayPosition === "function") {
            //   replay.setReplayPosition(target);
            // } else {
            //   logger.log(tag, "No seek handler available on replay instance");
            // }
            setPosition(target);
          }}
        />
        <View style={styles.replayInfoRow}>
          <ThemeText style={styles.replayProgressText}>
            {position} / {replay.replayLength}
          </ThemeText>
          <ThemeText>
            {replay.replayInfo ? replay.replayInfo?.name : 'No Replay'}
          </ThemeText>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            replay.closeReplay();
            Logger.log(tag, `Stopped replay`);
          }}>
          <ThemeIcon
            name={ThemeIconNames.CLOSE} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      width: '100%',
      height: 80,
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
    sliderContainer: {
      flex: 1,
      paddingHorizontal: theme.sizes.borderRadius,
    },
    slider: {
      width: '100%',
      height: 20,
    },
    replayInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.sizes.borderRadius / 2,
    },
    replayProgressText: {
      marginRight: theme.sizes.borderRadius,
    }
  });
}