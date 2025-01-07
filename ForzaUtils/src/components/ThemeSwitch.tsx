import React from "react";
import { Switch, SwitchProps } from "react-native";
import { useTheme } from "../hooks/useTheme";

export type SwitchOnPalette = 'primary' | 'secondary';

export interface ThemeSwitchProps extends SwitchProps {
  onPalette?: SwitchOnPalette;
}

export function ThemeSwitch(props: ThemeSwitchProps) {
  const theme = useTheme();
  let trueBg = theme.theme.colors.background.onSecondary;
  let falseBg = theme.theme.colors.background.secondary;
  let thumb = theme.theme.colors.background.onPrimary;
  switch (props.onPalette) {
    case 'secondary':
      trueBg = theme.theme.colors.background.onSecondary
      falseBg = theme.theme.colors.background.onPrimary
      thumb = props.value
        ? theme.theme.colors.background.secondary
        : theme.theme.colors.background.primary
  }
  return (
    <Switch trackColor={{
      false: falseBg,
      true: trueBg
    }}
      thumbColor={thumb}
      style={{
        width: theme.theme.sizes.icon * 2,
        marginLeft: 5,
        marginRight: 5,
      }} {...props} />
  )
}