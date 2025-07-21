import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppRoutes, StackNavigation } from "../constants/types";
import { TextCard } from "../components/TextCard";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { TrackMap } from "../components/TrackMap";
import { AvgSuspensionTravel } from "../components/Graphs/AvgSuspensionTravel";
import { AvgTireTemps } from "../components/Graphs/AvgTireTemp";
import { useLogger } from "../context/Logger";
import { ThemeText } from "../components/ThemeText";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { ReplayState, useReplay } from "../context/Recorder";
import { useNetworkContext } from "../context/Network";
import { invokeWithTheme } from "../hooks/ThemeState";
import { SlipAngle } from "../components/Graphs/SlipAngle";

export interface DataChooserProps {

}

export function DataChooser(props: DataChooserProps) {
  const tag = 'DataChooser.tsx';
  const styles = themeStyles();
  const network = useNetworkContext();
  const logger = useLogger();
  const navigation = useNavigation<StackNavigation>();
  const replay = useReplay();

  const CardButton = ({ title, body, onPress }: { title: string, body: string, onPress: () => void }) => {
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
  }
  const dataElements = [
    (<AvgSuspensionTravel />),
    (<AvgTireTemps />),
    (<SlipAngle />),
    (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <CardButton
          title={'HP / TQ Graph'}
          body={'Graph Horsepower and Torque'}
          onPress={() => {
            navigation.navigate(AppRoutes.HP_TQ_GRAPH);
          }} />
        <CardButton
          title={'Suspension Travel'}
          body={'Visually display suspension travel'}
          onPress={() => {
            navigation.navigate(AppRoutes.SUSPENSION_GRAPH);
          }} />
      </View>
    ),
    (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <CardButton
          title={'Tire Temps'}
          body={'Display tire temperature information'}
          onPress={() => {
            navigation.navigate(AppRoutes.TIRE_TEMPS)
          }} />
        <CardButton
          title={'Grip'}
          body={'Compare tire slip, steering angle, throttle, and brake'}
          onPress={() => {
            navigation.navigate(AppRoutes.GRIP)
          }} />
      </View>
    )
  ]
  const setRecording = async () => {
    if (replay.replayState !== ReplayState.RECORDING) {
      replay.startRecording();
    } else {
      replay.closeRecording();
    }
  }
  const getFlyoutOptions = () => {
    if (replay.replayState === ReplayState.RECORDING || replay.replayState === ReplayState.IDLE) {
      return [
        {
          id: 'record-button',
          onPress: () => {
            // Nothing - this is handled by the switch
          },
          renderItem: () => (
            <>
              <ThemeText
                variant={'primary'}
                onBackground={'onSecondary'}>
                Record
              </ThemeText>
              <ThemeSwitch
                value={Boolean(replay.replayState === ReplayState.RECORDING)}
                onChange={(ev) => {
                  setRecording();
                }} />
            </>
          )
        }
      ]
    } else {
      return [];
    }
  }

  useEffect(() => {
    if (replay.replayState !== ReplayState.RECORDING) {
      // network.DEBUG();
    } else {
      network.STOP_DEBUG();
    }
  }, [replay.replayState]);

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
          renderItem={(item) => item.item} />
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