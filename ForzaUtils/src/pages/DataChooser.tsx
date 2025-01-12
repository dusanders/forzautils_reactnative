import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppRoutes, randomKey, StackNavigation } from "../constants/types";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../hooks/useTheme";
import { Card } from "../components/Card";
import { AppBarContainer } from "../components/AppBarContainer";
import { useNavigation } from "@react-navigation/native";

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
    route: AppRoutes.HP_TQ_GRAPH,
    name: 'Grip',
    description: 'Compare tire slip, steering angle, throttle, and brake'
  }
]

export function DataChooser(props: DataChooserProps) {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const navigation = useNavigation<StackNavigation>();

  return (
    <AppBarContainer
      title="Data Chooser"
      onBack={() => {
        navigation.goBack();
      }}>
      <View style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <FlatList
          style={styles.listRoot}
          data={options}
          numColumns={2}
          renderItem={(info) => {
            return (
              <Card
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
                  fontSize: theme.theme.sizes.font.medium,
                  width: '100%',
                  textAlign: 'center'
                }}
                bodyStyle={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: theme.theme.sizes.font.small
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