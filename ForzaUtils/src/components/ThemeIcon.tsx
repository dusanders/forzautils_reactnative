import { IconProps } from "@react-native-vector-icons/common";
import Icon from "@react-native-vector-icons/material-icons";
import React from "react";
import { invokeWithTheme } from "../hooks/ThemeState";

export interface ThemeIconProps<T> extends IconProps<T> {
  
}

export function ThemeIcon<T>(props: ThemeIconProps<T>) {
  return (
    <Icon name={props.name}
      color={invokeWithTheme(theme => theme.colors.text.primary.onPrimary)}
      size={props.size || invokeWithTheme(theme => theme.sizes.icon)}
      style={{
        textAlign: 'center'
      }}
      {...props as any} />
  )
}