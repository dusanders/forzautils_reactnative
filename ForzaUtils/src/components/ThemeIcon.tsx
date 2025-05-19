import { IconProps } from "@react-native-vector-icons/common";
import Icon from "@react-native-vector-icons/material-icons";
import React from "react";
import { useCurrentTheme } from "../hooks/ThemeState";

export interface ThemeIconProps<T> extends IconProps<T> {
  
}

export function ThemeIcon<T>(props: ThemeIconProps<T>) {
  const theme = useCurrentTheme();
  return (
    <Icon name={props.name}
      color={theme.colors.text.primary.onPrimary}
      size={theme.sizes.icon}
      style={{
        textAlign: 'center'
      }}
      {...props as any} />
  )
}