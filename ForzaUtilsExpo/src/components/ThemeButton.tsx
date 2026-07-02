import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";
import React from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

export interface ThemeButtonProps extends TouchableOpacityProps {
  children?: any;
}

export function ThemeButton(props: ThemeButtonProps) {
  const theme = useThemeContext();
  const styles = themeStyles(theme.theme);

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
  });
}