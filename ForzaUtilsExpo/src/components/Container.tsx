import { useThemeContext } from "@/theme/ThemeProvider";
import { BackgroundVariantType, IThemeElements } from "@/theme/Themes";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export type ContainerFlex = 'row' | 'column';
export type ContainerFill = 'parent' | 'width' | 'height';

export interface ContainerProps extends ViewProps {
  variant?: BackgroundVariantType;
  flex?: ContainerFlex;
  fill?: ContainerFill;
}

export function Container(props: ContainerProps) {
  const theme = useThemeContext();
  const styles = themeStyles(theme.theme);
  let baseStyle = styles.rootPrimary;
  switch (props.variant) {
    case 'secondary':
      baseStyle = styles.rootSecondary;
      break;
  }
  switch (props.fill) {
    case 'height':
      baseStyle = { ...baseStyle, ...styles.fillHeight };
      break;
    case 'width':
      baseStyle = { ...baseStyle, ...styles.fillWidth };
      break;
    case 'parent':
      baseStyle = { ...baseStyle, ...styles.fillHeight, ...styles.fillWidth };
  }
  switch (props.flex) {
    case 'column':
      baseStyle = { ...baseStyle, ...styles.flexColumn };
      break;
    case 'row':
      baseStyle = { ...baseStyle, ...styles.flexRow };
      break;
  }
  return (
    <View {...props} style={[baseStyle, props.style]}>
      {props.children}
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    rootPrimary: {
      backgroundColor: theme.colors.background.primary,
      padding: 10,
    },
    rootSecondary: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.sizes.borderRadius,
      padding: 10,
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
  });
}