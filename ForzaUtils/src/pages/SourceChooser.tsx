import React from "react";
import { AppBarContainer } from "../components/AppBarContainer";
import { StyleSheet, View } from "react-native";
import { TextCard } from "../components/TextCard";
import { useNavigation } from "@react-navigation/native";
import { AppRoutes, StackNavigation } from "../constants/types";
import { Row } from "../components/Row";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../context/Theme";
import { ThemeText } from "../components/ThemeText";

export interface SourceChooserProps {
  // None
}

export function SourceChooser(props: SourceChooserProps) {
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);

  return (
    <AppBarContainer
    onBack={() => {
      navigation.goBack();
    }}>
      <View style={styles.root}>
        <Row style={styles.cardRow}>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ThemeText style={styles.titleText}>
              Utilities
            </ThemeText>
            <ThemeText style={styles.bodyText}>
              Tuning calculator provides a decent base tune based on the car's
              specifications. 
            </ThemeText>
            <ThemeText style={styles.bodyText}>
              Data visualizer allows you to visualize data from
              your Forza telemetry, such as horsepower, torque, suspension travel,
              tire temperatures, and grip.
            </ThemeText>
          </View>
        </Row>
        <Row style={styles.buttonRow}>
          <TextCard
            style={{ flex: 1 }}
            centerContent
            allcapsLabel
            allcapsTitle
            title={'Tuning'}
            body="Tuning Calculator" 
            onPress={() => {
              navigation.navigate(AppRoutes.TUNING_CALCULATOR);
            }}/>
          <TextCard
            style={{ flex: 1 }}
            centerContent
            allcapsLabel
            allcapsTitle
            title={'Data'}
            body="Data Visualizer"
            onPress={() => {
              navigation.navigate(AppRoutes.DATA);
            }} />
        </Row>
      </View>
    </AppBarContainer>
  );
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardRow: {
      justifyContent: 'center',
      marginTop: '30%',
      marginBottom: theme.sizes.borderRadius,
    },
    buttonRow: {
      justifyContent: 'center',
      marginTop: '10%'
    },
    titleText: {
      fontSize: 24, 
      fontWeight: 'bold', 
      marginBottom: 10
    },
    bodyText: {
      fontSize: 16, 
      margin: 10,
      color: theme.colors.text.secondary.onPrimary,
      textAlign: 'center',
    }
  });
}