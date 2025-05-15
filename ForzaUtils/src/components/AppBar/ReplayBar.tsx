import React from "react";
import { StyleSheet, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";
import { useLogger } from "../../context/Logger";
import { useReplay } from "../../context/Recorder";
import { ThemeIcon } from "../ThemeIcon";
import { useNetworkContext } from "../../context/Network";
import { ThemeText } from "../ThemeText";

export interface ReplayBarProps {
}
export function ReplayBar(props: ReplayBarProps) {
  const tag = `ReplayBar.tsx`;
  const logger = useLogger();
  const network = useNetworkContext();
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);

  return (
    <View style={styles.root}>
      <View>
        <ThemeIcon
          name={network.replay ? 'play' : 'pause'}
          size={theme.sizes.icon} />
      </View>
      <View>
        <ThemeText>
          {network.replay ? network.replay.info.name : 'No Replay'}
        </ThemeText>
      </View>
      <View>
        <ThemeIcon
          name={'close'}
          size={theme.sizes.icon} />
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