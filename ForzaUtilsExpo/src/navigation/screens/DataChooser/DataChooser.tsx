import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { SlipAngle } from "@/components/Graphs/SlipAngle";
import { TextCard } from "@/components/TextCard";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { ThemeText } from "@/components/ThemeText";
import { TrackMap } from "@/components/TrackMap/TrackMap";
import { Logger } from "@/hooks/Logger";
import { AppRoutes, MainAppNavigation } from "@/navigation/types";
import { useNetworkService } from "@/services/Forza/NetworkService";
import { ReplayState, useRecorderService } from "@/services/Recorder/RecorderService";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useCallback, useEffect } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

export interface DataChooserProps {

}

export function DataChooser(props: DataChooserProps) {
  const tag = "DataChooser.tsx";
  const theme = useThemeContext();
  const styles = themeStyles(theme.theme);
  const navigation = useNavigation<MainAppNavigation>();
  const replay = useRecorderService();
  const network = useNetworkService();

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
    if (replay.state.replayState !== ReplayState.RECORDING) {
      replay.startRecording();
    } else {
      replay.closeRecording();
    }
  }, [replay.state.replayState]);

  const getFlyoutOptions = useCallback(() => ([{
    id: 'record-button',
    onPress: () => { },
    renderItem: () => (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemeText variant='primary' onBackground='onSecondary'>Record</ThemeText>
          <ThemeSwitch
            value={replay.state.replayState === ReplayState.RECORDING}
            onValueChange={() => setRecording()} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
          <ThemeText variant='primary' onBackground='onSecondary'>Debug Mode</ThemeText>
          <ThemeSwitch
            value={network.isDEBUG}
            onValueChange={(val) => {
              Logger.log(tag, `Toggling debug mode. Current state: ${network.isDEBUG}`);
              if (network.isDEBUG) {
                network.STOP_DEBUG();
              } else {
                network.DEBUG(20);
              }
            }} />
        </View>
      </View>
    )
  }]
  ), [replay.state.replayState, network.isDEBUG]);

  useEffect(() => {
    Logger.log(tag, `ForzaUtils isDEBUG mode: ${network.isDEBUG}`);
  }, [network.isDEBUG]);

  Logger.log(tag, `Rendering DataChooser.tsx`);

  return (
    <AppBarContainer
      title="Data Chooser"
      injectElements={getFlyoutOptions()}>
      <View style={styles.root}>
        <TrackMap
          style={styles.trackMapRoot} />
        <ScrollView style={{ height: 400 }}>
          <SlipAngle />
          <SlipAngle />
          <SlipAngle />
          <SlipAngle />
          <SlipAngle />
          <SlipAngle />
          <SlipAngle />
          <SlipAngle />
        </ScrollView>
        <FlatList
          style={styles.listRoot}
          data={dataElements}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => item} />
      </View>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
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
  });
}