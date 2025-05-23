import React, {  } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";

export interface SplashProps {

}

export function Splash(props: SplashProps) {
  const theme = useSelector(getTheme);
  const style = withStyles(theme);
  return (
    <View style={style.root}>
      <Text
        style={style.appNameTxt}>
        {/* {locale.strings.appName} */}
      </Text>
      <ActivityIndicator
        size={'large'}
        style={style.spinner} />
    </View>
  )
}

function withStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.background.primary
    },
    spinner: {
      marginTop: 40,
      transform: [
        {
          scaleX: 2
        },
        {
          scaleY: 2
        }
      ]
    },
    appNameTxt: {
      fontSize: 33,
      color: theme.colors.text.primary.onPrimary,
      textAlign: 'center',
    }
  });
}