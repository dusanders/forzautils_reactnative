import React, { useContext, useEffect } from "react";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { StyleSheet, View } from "react-native";
import { TextCard } from "../components/TextCard";
import { useNavigation } from "@react-navigation/native";
import { AppRoutes, StackNavigation } from "../constants/types";
import { Row } from "../components/Row";
import { IThemeElements } from "../constants/Themes";
import { ThemeText } from "../components/ThemeText";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";
import { ReplayContext, useReplay } from "../context/Replay";
import { useLogger } from "../context/Logger";
import { ISessionInfo } from "../services/Database/DatabaseInterfaces";
import { Dirs, FileSystem } from 'react-native-file-access';

export interface SourceChooserProps {
  // None
}

export function SourceChooser(props: SourceChooserProps) {
  const tag = 'SourceChooser.tsx';
  const navigation = useNavigation<StackNavigation>();
  const logger = useLogger();
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const replay = useReplay();

  const getAll = async () => {
    const rows = await replay.getAllSessions();
    logger.log(tag, `all rows: ${JSON.stringify(rows)}`);
    return rows;
  }

  const create = async (info: ISessionInfo) => {
    const created = await replay.getOrCreate(info);
    return created;
    logger.log(tag, `created: ${created.info.name}`);
  }

  useEffect(() => {
    logger.log(tag, `loaded with replay...`);
    const init = async () => {
      await getAll();
    }
    init();
  }, [replay]);

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