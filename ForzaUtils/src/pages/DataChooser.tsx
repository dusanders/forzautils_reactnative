import React, { useMemo, useCallback, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppRoutes, StackNavigation } from "../types/types";
import { TextCard } from "../components/TextCard";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { TrackMap } from "../components/TrackMap";
import { useLogger } from "../context/Logger";
import { ReplayState, useReplayControls } from "../context/Recorder";
import { invokeWithTheme } from "../hooks/ThemeState";
import { ThemeText } from "../components/ThemeText";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { useNetworkContext } from "../context/Network";

export interface DataChooserProps {

}

export function DataChooser(props: DataChooserProps) {
  const tag = "DataChooser.tsx";
  const styles = themeStyles();
  const logger = useLogger();
  const navigation = useNavigation<StackNavigation>();
  const replay = useReplayControls();
  const network = useNetworkContext();

  const CardButton = useMemo(() => ({ title, body, onPress }: { title: string, body: string, onPress: () => void }) => {
    return (
      <TextCard
        allcapsTitle
        centerContent
        title={title}
        body={body}
        titleStyle={styles.cardButtonTitle}
        bodyStyle={styles.cardButtonBody}
        onPress={onPress} />
    );
  }, [styles.cardButtonTitle, styles.cardButtonBody]);

  const dataElements = useMemo(() => [
    <View key="row1" style={{ flexDirection: 'row' }}>
      <CardButton
        title='HP / TQ Graph'
        body='Graph Horsepower and Torque'
        onPress={() => navigation.navigate(AppRoutes.HP_TQ_GRAPH)} />
      <CardButton
        title='Suspension Travel'
        body='Visually display suspension travel'
        onPress={() => navigation.navigate(AppRoutes.SUSPENSION_GRAPH)} />
    </View>,
    <View key="row2" style={{ flexDirection: 'row' }}>
      <CardButton
        title='Tire Temps'
        body='Display tire temperature information'
        onPress={() => navigation.navigate(AppRoutes.TIRE_TEMPS)} />
      <CardButton
        title='Grip'
        body='Compare tire slip, steering angle, throttle, and brake'
        onPress={() => navigation.navigate(AppRoutes.GRIP)} />
    </View>
  ], [navigation, CardButton]);

  const setRecording = useCallback(async () => {
    if (replay.replayState !== ReplayState.RECORDING) {
      replay.startRecording();
    } else {
      replay.closeRecording();
    }
  }, [replay.replayState]);

  const getFlyoutOptions = useCallback(() => ([{
    id: 'record-button',
    onPress: () => { },
    renderItem: () => (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemeText variant='primary' onBackground='onSecondary'>Record</ThemeText>
          <ThemeSwitch
            value={replay.replayState === ReplayState.RECORDING}
            onChange={() => setRecording()} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
          <ThemeText variant='primary' onBackground='onSecondary'>Debug Mode</ThemeText>
          <ThemeSwitch
            value={network.isDEBUG}
            onChange={() => {
              if (network.isDEBUG) {
                network.STOP_DEBUG();
              } else {
                network.DEBUG();
              }
            }} />
        </View>
      </View>
    )
  }]
  ), [replay.replayState, network.isDEBUG]);

  useEffect(() => {
    logger.log(tag, `ForzaUtils isDEBUG mode: ${network.isDEBUG}`);
  }, [network.isDEBUG]);
  
  logger.log(tag, `Rendering DataChooser.tsx`);

  return (
    <AppBarContainer
      title="Data Chooser"
      injectElements={getFlyoutOptions()}>
      <View style={styles.root}>
        <TrackMap
          style={styles.trackMapRoot} />
        <FlatList
          style={styles.listRoot}
          data={dataElements}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => item} />
      </View>
    </AppBarContainer>
  )
}

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    root: {
      height: '100%',
      alignItems: 'center',
    },
    trackMapRoot: {
      marginBottom: 20,
      width: '95%'
    },
    listRoot: {
      flexGrow: 0,
      margin: 0,
      width: '100%',
    },
    cardButtonTitle: {
      fontSize: theme.sizes.font.medium,
      textAlign: 'center'
    },
    cardButtonBody: {
      textAlign: 'center',
      fontSize: theme.sizes.font.small
    }
  }));
}