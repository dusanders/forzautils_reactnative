import React, { useState } from "react";
import { Button, ButtonProps, Pressable, PressableProps, StyleSheet } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../context/Theme";

export interface ThemeButtonProps extends PressableProps {
  children?: any;
}

export function ThemeButton(props: ThemeButtonProps) {
  const styles = themeStyles(useTheme().theme);

  return (
    <Pressable
      style={{ ...styles.root, ...props.style as any }}
      onPress={(ev) => {
        if (props.onPress) {
          props.onPress(ev);
        }
      }}>
      {props.children}
    </Pressable>
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