import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { Row } from "@/components/Row";
import { TextCard } from "@/components/TextCard";
import { ThemeText } from "@/components/ThemeText";
import { percentOfDeviceHeight } from "@/helpers/misc";
import { AppRoutes, MainAppNavigation } from "@/navigation/types";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";


export interface SourceChooserProps {
  // None
}

const TAG = 'SourceChooser.tsx';
export function SourceChooser(props: SourceChooserProps) {
  const theme = useThemeContext();
  const navigation = useNavigation<MainAppNavigation>();
  const styles = themeStyles(theme.theme);

  return (
    <AppBarContainer>
      <View style={styles.root}>
        <Row style={styles.cardRow}>
          <View style={{
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
            }} />
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
        <Row>
          <TextCard
            style={{ flex: 1 }}
            centerContent
            allcapsLabel
            allcapsTitle
            title={'Replay'}
            body="View a previously recorded session"
            onPress={() => {
              navigation.push(AppRoutes.REPLAY_LIST, { listId: 'fromSourceChooser' });
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
      marginTop: percentOfDeviceHeight(10),
      marginBottom: theme.sizes.borderRadius,
    },
    buttonRow: {
      justifyContent: 'center',
      marginTop: 20
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