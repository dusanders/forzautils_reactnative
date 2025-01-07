import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeText } from "../components/ThemeText";
import { INavigationTarget } from "../context/Navigator";
import { AppRoutes } from "../constants/types";
import { useNavigation } from "../hooks/useNavigation";
import { useForzaData } from "../hooks/useForzaData";
import { IThemeElements } from "../constants/Themes";
import { Container } from "../components/Container";
import { useTheme } from "../hooks/useTheme";
import { ThemeButton } from "../components/ThemeButton";
import { AppBar } from "../components/AppBar";

export interface DataChooserProps extends INavigationTarget {

}

export function DataChooser(props: DataChooserProps) {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const navigation = useNavigation();
  const forzaData = useForzaData();

  return (
    <Container
      style={styles.root}
      flex={'column'}
      fill={'parent'}>
      <AppBar
        title="Data Chooser"
        onBack={() => {
          navigation.goBack()
        }} />
      <ThemeButton onPress={() => {
        navigation.goBack();
      }}>
        <ThemeText>
          Back
        </ThemeText>
      </ThemeButton>
      <ThemeButton onPress={() => {
        navigation.navigateTo(AppRoutes.IP_INFO)
      }}>
        <ThemeText>
          NEXT
        </ThemeText>
      </ThemeButton>
      <ThemeText>
        DATA CHOOSER
      </ThemeText>
    </Container>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      justifyContent: 'center',
      alignItems: 'center',
    }
  })
}