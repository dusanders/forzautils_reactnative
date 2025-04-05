import React from "react";
import { Switch, SwitchProps } from "react-native";
import { useTheme } from "../context/Theme";

export type SwitchOnPalette = 'primary' | 'secondary';

export interface ThemeSwitchProps extends SwitchProps {
  onPalette?: SwitchOnPalette;
}

export function ThemeSwitch(props: ThemeSwitchProps) {
  const theme = useTheme();
  let trueBg = theme.theme.colors.background.onSecondary;
  let falseBg = theme.theme.colors.background.onPrimary;
  let thumb = props.value
    ? theme.theme.colors.text.primary.onPrimary
    : theme.theme.colors.text.secondary.onPrimary;
  switch (props.onPalette) {
    case 'secondary':
      trueBg = theme.theme.colors.background.onSecondary
      falseBg = theme.theme.colors.background.onPrimary
      thumb = props.value
        ? theme.theme.colors.background.secondary
        : theme.theme.colors.background.primary
      break;
  }
  return (
    <Switch
      trackColor={{
        false: falseBg,
        true: trueBg
      }}
      thumbColor={thumb}
      style={{
        marginLeft: 5,
        marginRight: 5,
      }} 
      {...props} />
  )
}