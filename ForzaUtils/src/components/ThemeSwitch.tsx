import React from "react";
import { Switch, SwitchProps } from "react-native";
import { useCurrentTheme } from "../hooks/ThemeState";

export type SwitchOnPalette = 'primary' | 'secondary';

export interface ThemeSwitchProps extends SwitchProps {
  onPalette?: SwitchOnPalette;
}

export function ThemeSwitch(props: ThemeSwitchProps) {
  const theme = useCurrentTheme();
  let trueBg = theme.colors.background.onSecondary;
  let falseBg = theme.colors.background.onPrimary;
  let thumb = props.value
    ? theme.colors.text.primary.onPrimary
    : theme.colors.text.secondary.onPrimary;
  switch (props.onPalette) {
    case 'secondary':
      trueBg = theme.colors.background.onSecondary
      falseBg = theme.colors.background.onPrimary
      thumb = props.value
        ? theme.colors.background.secondary
        : theme.colors.background.primary
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