import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/Theme";
import { IThemeElements } from "../constants/Themes";
import { ThemeText } from "../components/ThemeText";
import { Container } from "../components/Container";
import { useLocale } from "../context/Locale";

export interface WifiErrorProps {

}

export function WifiError(props: WifiErrorProps) {
  const locale = useLocale();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);

  return (
    <Container style={styles.root}>
      <ThemeText variant={'error'} style={styles.titleText}>
        ERROR
      </ThemeText>
      <ThemeText variant={'warning'} style={styles.descText}>
        There seems to be an issue with the device Wifi. Please check the network
        connection.
      </ThemeText>
      <ThemeText variant={'warning'} style={styles.descText}>
        Please ensure the device is connected to the same WiFi network as
        Forza. Also ensure the app is given the correct permissions to access
        WiFi information!
      </ThemeText>
    </Container>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 0
    },
    titleText: {
      fontSize: 34,
    },
    descText: {
      fontSize: 14,
      width: '70%',
      textAlign: 'center',
      fontWeight: 700
    }
  })
}