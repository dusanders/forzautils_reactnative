import React from "react";
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

export interface DataChooserProps {

}

interface DataOption {
  id: string;
  route: AppRoutes;
  name: string;
  description: string;
}

const options: DataOption[] = [
  {
    id: randomKey(),
    route: AppRoutes.HP_TQ_GRAPH,
    name: 'HP / TQ Graph',
    description: 'Graph horsepower and torque'
  },
  {
    id: randomKey(),
    route: AppRoutes.SUSPENSION_GRAPH,
    name: 'Suspension Travel',
    description: 'Graph suspension travel'
  },
  {
    id: randomKey(),
    route: AppRoutes.TIRE_TEMPS,
    name: 'Tire Temps',
    description: 'Graph tire temps'
  },
  {
    id: randomKey(),
    route: AppRoutes.GRIP,
    name: 'Grip',
    description: 'Compare tire slip, steering angle, throttle, and brake'
  }
]

export function DataChooser(props: DataChooserProps) {
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const navigation = useNavigation<StackNavigation>();

  return (
    <AppBarContainer
      title="Data Chooser"
      onBack={() => {
        navigation.goBack();
      }}>
      <View style={{
        height: '100%',
        alignItems: 'center'
      }}>
        <TrackMap 
        style={{
          marginBottom: 20,
          width: '95%'
        }}/>
        {/* <AvgSuspensionTravel />
        <AvgTireTemps /> */}
        <FlatList
          style={styles.listRoot}
          data={options}
          numColumns={2}
          renderItem={(info) => {
            return (
              <TextCard
                id={info.item.id}
                key={info.item.id}
                style={{
                  width: '50%',
                }}
                allcapsTitle
                centerContent
                title={info.item.name}
                body={info.item.description}
                titleStyle={{
                  fontSize: theme.sizes.font.medium,
                  textAlign: 'center'
                }}
                bodyStyle={{
                  textAlign: 'center',
                  fontSize: theme.sizes.font.small
                }}
                onPress={(id) => {
                  for (const i of options) {
                    if (i.id === id) {
                      navigation.navigate(i.route);
                    }
                  }
                }} />
            )
          }} />
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