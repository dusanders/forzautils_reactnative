import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppRoutes, StackNavigation } from "../constants/types";
import { IThemeElements } from "../constants/Themes";
import { TextCard } from "../components/TextCard";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { TrackMap } from "../components/TrackMap";
import { AvgSuspensionTravel } from "../components/Graphs/AvgSuspensionTravel";
import { AvgTireTemps } from "../components/Graphs/AvgTireTemp";
import { useLogger } from "../context/Logger";
import { ThemeText } from "../components/ThemeText";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { useReplay } from "../context/Recorder";
import { useNetworkContext } from "../context/Network";
import { packetService } from "../hooks/PacketState";
import { themeService } from "../hooks/ThemeState";
import { SlipAngle } from "../components/Graphs/SlipAngle";

export interface DataChooserProps {

}

export function DataChooser(props: DataChooserProps) {
  const tag = 'DataChooser.tsx';
  const theme = themeService().theme;
  const styles = themeStyles(theme);
  const packet = packetService().packet;
  const network = useNetworkContext();
  const logger = useLogger();
  const navigation = useNavigation<StackNavigation>();
  const replay = useReplay();
  const [isRecording, setIsRecording] = useState(false);

  const dataElements = [
    (<AvgSuspensionTravel />),
    (<AvgTireTemps />),
    (<SlipAngle />),
    (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TextCard
          allcapsTitle
          centerContent
          title={'HP / TQ Graph'}
          body={'Graph Horsepower and Torque'}
          titleStyle={{
            fontSize: theme.sizes.font.medium,
            textAlign: 'center'
          }}
          bodyStyle={{
            textAlign: 'center',
            fontSize: theme.sizes.font.small
          }}
          onPress={(id) => {
            navigation.navigate(AppRoutes.HP_TQ_GRAPH)
          }} />
        <TextCard
          allcapsTitle
          centerContent
          title={'Suspension Travel'}
          body={'Visually display suspension travel'}
          titleStyle={{
            fontSize: theme.sizes.font.medium,
            textAlign: 'center'
          }}
          bodyStyle={{
            textAlign: 'center',
            fontSize: theme.sizes.font.small
          }}
          onPress={(id) => {
            navigation.navigate(AppRoutes.SUSPENSION_GRAPH)
          }} />
      </View>
    ),
    (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TextCard
          allcapsTitle
          centerContent
          title={'Tire Temps'}
          body={'Display tire temperature information'}
          titleStyle={{
            fontSize: theme.sizes.font.medium,
            textAlign: 'center'
          }}
          bodyStyle={{
            textAlign: 'center',
            fontSize: theme.sizes.font.small
          }}
          onPress={(id) => {
            navigation.navigate(AppRoutes.TIRE_TEMPS)
          }} />
        <TextCard
          allcapsTitle
          centerContent
          title={'Grip'}
          body={'Compare tire slip, steering angle, throttle, and brake'}
          titleStyle={{
            fontSize: theme.sizes.font.medium,
            textAlign: 'center'
          }}
          bodyStyle={{
            textAlign: 'center',
            fontSize: theme.sizes.font.small
          }}
          onPress={(id) => {
            navigation.navigate(AppRoutes.GRIP)
          }} />
      </View>
    )
  ]

  const setRecording = async () => {
    if (!isRecording) {
      const file = await replay.getOrCreate();
      replay.setRecording(file);
      setIsRecording(true);
    } else {
      replay.closeRecording();
      setIsRecording(false);
    }
  }

  useEffect(() => {
    if (!Boolean(network.replay)) {
      // network.DEBUG();
    } else {
      network.STOP_DEBUG();
    }
  }, [network.replay]);

  useEffect(() => {
    if (packet && isRecording) {
      replay.submitPacket(packet);
    }
  }, [packet]);

  return (
    <AppBarContainer
      title="Data Chooser"
      onBack={() => {
        navigation.goBack();
      }}
      injectElements={Boolean(network.replay)
        ? []
        : [{
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
                value={isRecording}
                onChange={(ev) => {
                  setRecording();
                }} />
            </>
          )
        }]}>
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
    }
  })
}