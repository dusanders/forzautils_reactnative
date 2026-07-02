import React from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from "react-native";
import { useThemeContext } from "@/theme/ThemeProvider";

export enum ThemeIconNames {
  SETTINGS = "settings",
  CHEVRON_LEFT = "chevron-left",
  CHEVRON_RIGHT = "chevron-right",
  HOME = "home",
  CLOSE = "close",
  ADD = "add",
  REMOVE = "remove",
  SEARCH = "search",
  FAVORITE = "favorite",
  FAVORITE_BORDER = "favorite-border",
  CHECK = "check",
  INFO = "info",
  INFO_OUTLINE = "info-outline",
  ARROW_DROP_DOWN = "arrow-drop-down",
  ARROW_DROP_UP = "arrow-drop-up",
  PLAY = "play-arrow",
  PAUSE = "pause",
  STOP = "stop",
}

export interface ThemeIconProps  {
  name: ThemeIconNames;
  size?: number;
  colorOverride?: string;
  style?: StyleProp<ViewStyle>;
}

export function ThemeIcon(props: ThemeIconProps) {
  const theme = useThemeContext();
  const { size = 24, colorOverride, style, ...rest } = props;
  return (
    <MaterialIcons name={props.name}
      color={colorOverride || theme.theme.colors.text.primary.onPrimary}
      size={size || theme.theme.sizes.icon}
      style={[
        {
          textAlign: 'center'
        },
        style
      ]}
      {...rest as any} />
  )
}