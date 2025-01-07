import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../hooks/useTheme";

export type ContainerVariant = 'primary' | 'secondary';
export type ContainerFlex = 'row' | 'column';
export type ContainerFill = 'parent' | 'width' | 'height';

export interface ContainerProps extends ViewProps {
  variant?: ContainerVariant;
  flex?: ContainerFlex;
  fill?: ContainerFill;
}

export function Container(props: ContainerProps) {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  let baseStyle = styles.rootPrimary;
  switch(props.variant) {
    case 'secondary': 
      baseStyle = styles.rootSecondary;
      break;
  }
  switch(props.fill) {
    case 'height':
      baseStyle = {...baseStyle, ...styles.fillHeight};
      break;
    case 'width':
      baseStyle = {...baseStyle, ...styles.fillWidth};
      break;
    case 'parent':
      baseStyle = {...baseStyle, ...styles.fillHeight, ...styles.fillWidth};
  }
  switch(props.flex) {
    case 'column':
      baseStyle = {...baseStyle, ...styles.flexColumn};
      break;
    case 'row':
      baseStyle = {...baseStyle, ...styles.flexRow};
      break;
  }
  return (
    <View style={[baseStyle, props.style]}>
      {props.children}
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    rootPrimary: {
      backgroundColor: theme.colors.background.primary
    },
    rootSecondary: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.sizes.borderRadius,
      padding: 10,
      color: theme.colors.text.secondary.onPrimary
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row'
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column'
    },
    fillWidth: {
      width: '100%'
    },
    fillHeight: {
      height: '100%'
    }
  })
}