import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemeType, withTheme } from "../../hooks/withTheme";
import { IColorDefinitions } from "../../constants/Colors";

export interface BottomNavigationProps {
  children?: any;
  bottomRow: JSX.Element;
  theme: ThemeType;
}

export function BottomNavigation(props: BottomNavigationProps) {
  const style = styles(withTheme(props.theme));
  return (
    <View style={style.root}>
      <View style={style.content}>
        {props.children}
      </View>
      <View style={style.bottomBar}>
        {props.bottomRow}
      </View>
    </View>
  )
}

function styles(theme: IColorDefinitions) {
  return StyleSheet.create({
    root: {
      height: '100%',
      width: '100%',
    },
    content:{
      flexGrow: 1
    },
    bottomBar:{
      display: 'flex',
      flexDirection: 'row',
      height: 75
    }
  })
}