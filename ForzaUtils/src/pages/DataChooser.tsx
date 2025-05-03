import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppRoutes, randomKey, StackNavigation } from "../constants/types";
import { IThemeElements } from "../constants/Themes";
import { TextCard } from "../components/TextCard";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { TrackMap } from "../components/TrackMap";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";
import { AvgSuspensionTravel } from "../components/Graphs/AvgSuspensionTravel";
import { AvgTireTemps } from "../components/Graphs/AvgTireTemp";
import { Socket } from "../services/Socket";
import { useLogger } from "../context/Logger";
import { ThemeText } from "../components/ThemeText";
import { ThemeSwitch } from "../components/ThemeSwitch";

export interface DataChooserProps {

}

export function DataChooser(props: DataChooserProps) {
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const logger = useLogger();
  const navigation = useNavigation<StackNavigation>();
  const [isRecording, setIsRecording] = useState(false);

  const dataElements = [
    (<AvgSuspensionTravel />),
    (<AvgTireTemps />),
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

  useEffect(() => {
    Socket.getInstance(logger).DEBUG()
  }, []);

  return (
    <AppBarContainer
      title="Data Chooser"
      onBack={() => {
        navigation.goBack();
      }}
      injectElements={[
        {
          id: 'record-button',
          onPress: () => {

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
                  setIsRecording(!isRecording)
                }} />
            </>
          )
        }
      ]}>
      <View style={{
        height: '100%',
        alignItems: 'center'
      }}>
        <TrackMap
          style={{
            marginBottom: 20,
            width: '95%'
          }} />
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
    listRoot: {
      flexGrow: 0,
      margin: 0,
      width: '100%',
    }
  })
}