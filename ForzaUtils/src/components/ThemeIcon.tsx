import { IconProps } from "@react-native-vector-icons/common";
import Icon from "@react-native-vector-icons/material-icons";
import React from "react";
import { useTheme } from "../context/Theme";

export interface ThemeIconProps<T> extends IconProps<T> {
  
}

export function ThemeIcon<T>(props: ThemeIconProps<T>) {
  const theme = useTheme().theme;
  return (
    <Icon name={props.name as any}
      color={theme.colors.text.primary.onPrimary}
      size={theme.sizes.icon}
      style={{
        textAlign: 'center'
      }}
      {...props as any} />
  )
}