import React, { useEffect, useState } from "react";
import { useNavigation } from "../../hooks/useNavigation";
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { Assets } from "../../assets";
import { DataEvent, IHpTqGraphViewModel } from "../../context/viewModels/HpTqGraphViewModel";
import { Paper } from "../../components/Paper";
import { AppBarContainer } from "../../components/AppBarContainer";
import { ThemeText } from "../../components/ThemeText";
import { AppRoutes, randomKey } from "../../constants/types";
import { HpTqCurves } from "./HpTqCurves";
import { INavigationTarget } from "../../context/Navigator";
import { ThemeButton } from "../../components/ThemeButton";
import { AppSettingsButton } from "../../components/AppBar";

export interface HpTqGraphProps extends INavigationTarget {
  route: AppRoutes;
  viewModel: IHpTqGraphViewModel;
}

interface GraphData {
  gear: number;
  data: DataEvent[];
}

export function HptqGraph(props: HpTqGraphProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const [graphWidth, setGraphWidth] = useState(Dimensions.get('window').width - 40)
  const [gears, setGears] = useState<GraphData[]>([]);

  useEffect(() => {
    const all = props.viewModel.gears.sort((a, b) => a.gear - b.gear);
    const newValues: GraphData[] = [];
    all.forEach((gear) => {
      const sorted = gear.events.sort((a, b) => a.rpm - b.rpm);
      const newGearData: GraphData = {
        gear: gear.gear,
        data: []
      }
      sorted.forEach((dataPoint) => {
        newGearData.data.push({
          hp: dataPoint.hp,
          tq: dataPoint.tq,
          rpm: dataPoint.rpm,
          gear: gear.gear
        });
      });
      newValues.push(newGearData);
    });
    setGears(newValues);
  }, [props.viewModel.data]);

  useEffect(() => {
    if (!props.viewModel.gears.length) {
      console.log(`Start DEBUG`);
      props.viewModel.DEBUG_StartStream();
    }
  }, []);

  const separator = () => {
    return (
      <View style={{
        height: 5
      }}></View>
    )
  }

  return (
    <AppBarContainer title="Hp / Tq Graph"
      onBack={() => {
        navigation.goBack()
      }}
      injectElements={[
        {
          id: randomKey(),
          onPress: () => { 
            console.log(`clearing...`)
            setGears([]);
          },
          renderItem: () => (
            <ThemeText
              allcaps
              fontFamily={'bold'}>
              Clear Data
            </ThemeText>
          )
        },
      ]}>
      <View
        style={styles.contentWrapper}>
        {gears.length < 1 && (
          <Paper style={styles.waitPaper}>
            <ThemeText
              fontFamily="bold"
              allcaps
              fontSize="large"
              style={styles.waitTitleText}>
              Awaiting Data
            </ThemeText>
            <ThemeText style={styles.waitBodyText}>
              No data received from Forza. Please drive in-game.
            </ThemeText>
            <ActivityIndicator />
          </Paper>
        )}
        {gears.length > 0 && (
          <FlatList
            ItemSeparatorComponent={separator}
            style={{
              flexGrow: 1
            }}
            data={gears}
            renderItem={(item) => (
              <HpTqCurves
                width={graphWidth}
                key={randomKey()}
                data={item.item.data}
                gear={item.item.gear} />
            )} />
        )}
      </View>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    waitBodyText: {
      width: '70%',
      textAlign: 'center',
      margin: 'auto',
      marginBottom: 20
    },
    waitTitleText: {
      textAlign: 'center',
      marginBottom: 12
    },
    waitPaper: {
      width: '80%'
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    yAxisText: {
      color: theme.colors.text.secondary.onPrimary,
      fontFamily: Assets.SupportedFonts.Regular
    },
    xAxisText: {
      color: theme.colors.text.primary.onPrimary,
      fontFamily: Assets.SupportedFonts.Regular
    }
  })
}