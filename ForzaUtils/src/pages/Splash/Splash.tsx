import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ILocaleContext } from "../../context/withLocale";
import { ThemeType, withTheme } from "../../hooks/withTheme";
import { IColorDefinitions } from "../../constants/Colors";

export interface SplashProps {
  locale: ILocaleContext;
  theme: ThemeType
}

export function Splash(props: SplashProps) {
  const style = withStyles(withTheme(props.theme));
  return (
    <View style={style.root}>
      <Text
        style={style.appNameTxt}>
        {props.locale.strings.appName}
      </Text>
      <ActivityIndicator
        size={'large'}
        style={style.spinner} />
    </View>
  )
}
function withStyles(theme: IColorDefinitions) {
  return StyleSheet.create({
    root: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.background
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
      color: theme.text.primary,
      textAlign: 'center',
    }
  });
}