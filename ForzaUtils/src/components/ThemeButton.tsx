import React from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";

export interface ThemeButtonProps extends TouchableOpacityProps {
  children?: any;
}

export function ThemeButton(props: ThemeButtonProps) {
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);

  return (
    <TouchableOpacity
      style={{ ...styles.root, ...props.style as any }}
      onPress={(ev) => {
        if (props.onPress) {
          props.onPress(ev);
        }
      }}>
      {props.children}
    </TouchableOpacity>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      padding: theme.sizes.button.padding,
      elevation: theme.sizes.button.elevation,
      margin: theme.sizes.button.margin,
      backgroundColor: 'none',
      borderRadius: theme.sizes.borderRadius,
      minHeight: theme.sizes.button.size,
      minWidth: theme.sizes.button.size
    }
  })
}