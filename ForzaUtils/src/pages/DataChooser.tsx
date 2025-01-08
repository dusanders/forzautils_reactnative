import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { INavigationTarget } from "../context/Navigator";
import { randomKey } from "../constants/types";
import { useNavigation } from "../hooks/useNavigation";
import { useForzaData } from "../hooks/useForzaData";
import { IThemeElements } from "../constants/Themes";
import { Container } from "../components/Container";
import { useTheme } from "../hooks/useTheme";
import { AppBar } from "../components/AppBar";
import { Card } from "../components/Card";

export interface DataChooserProps extends INavigationTarget {

}

interface DataOption {
  id: string;
  name: string;
  description: string;
}

const options: DataOption[] = [
  {
    id: randomKey(),
    name: 'HP / TQ Graph',
    description: 'Graph horsepower and torque'
  },
  {
    id: randomKey(),
    name: 'Suspension Travel',
    description: 'Graph suspension travel'
  },
  {
    id: randomKey(),
    name: 'Tire Temps',
    description: 'Graph tire temps'
  },
  {
    id: randomKey(),
    name: 'Grip',
    description: 'Compare tire slip, steering angle, throttle, and brake'
  }
]

export function DataChooser(props: DataChooserProps) {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const navigation = useNavigation();
  const forzaData = useForzaData();

  return (
    <Container
      style={styles.root}
      flex={'column'}
      fill={'parent'}>
      <AppBar
        title="Data Chooser"
        onBack={() => {
          navigation.goBack()
        }} />
      <FlatList
        style={styles.listRoot}
        data={options}
        numColumns={2}
        renderItem={(info) => {
          return (
            <Card key={info.item.id} style={{
              width: '50%',
            }}
              allcapsTitle
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
              }} />
          )
        }} />
    </Container>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0
    },
    listRoot: {
      flexGrow: 0,
      margin: 0,
      width: '100%',
    }
  })
}