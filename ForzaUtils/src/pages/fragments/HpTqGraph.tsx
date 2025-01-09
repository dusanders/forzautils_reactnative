import React, { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { useNavigation } from "../../hooks/useNavigation";
import { AppBar } from "../../components/AppBar";
import { ActivityIndicator, Dimensions, FlatList, LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import { useForzaData } from "../../hooks/useForzaData";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { Assets } from "../../assets";
import { DataEvent, GearData, IHpTqGraphViewModel } from "../../context/HpTqGraphViewModel";
import { Paper } from "../../components/Paper";
import { LineChart } from "react-native-chart-kit";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Dataset } from "react-native-chart-kit/dist/HelperTypes";
import { AppBarContainer } from "../../components/AppBarContainer";
import { ThemeText } from "../../components/ThemeText";
import { AppRoutes, randomKey } from "../../constants/types";

export interface HpTqGraphProps {
  route?: AppRoutes;
  gearData?: GearData[];
  viewModel: IHpTqGraphViewModel;
}

interface GraphData {
  gear: number;
  data: DataEvent[];
}

const debugData: DataEvent[] = [
  {
    rpm: 1234,
    hp: 43,
    tq: 23,
    gear: 1
  },
  {
    rpm: 1345,
    hp: 54,
    tq: 34,
    gear: 1
  },
  {
    rpm: 1451,
    hp: 65,
    tq: 72,
    gear: 1
  },
  {
    rpm: 1512,
    hp: 89,
    tq: 98,
    gear: 1
  },
  {
    rpm: 1645,
    hp: 98,
    tq: 102,
    gear: 1
  },
  {
    rpm: 1896,
    hp: 78,
    tq: 87,
    gear: 1
  },
  {
    rpm: 1932,
    hp: 65,
    tq: 76,
    gear: 1
  }
]
const debugStateData: GraphData[] = [
  {
    gear: 1,
    data: debugData
  },
  {
    gear: 2,
    data: debugData
  }
]
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

  const getDataForGear = (graph: GraphData): LineChartData => {
    const sorted = graph.data.sort((a, b) => a.rpm - b.rpm)
    const data: LineChartData = {
      labels: sorted.map((i) => `${i.rpm}`),
      datasets: [
        {
          data: sorted.map((i) => i.hp),
          color: () => theme.theme.colors.text.primary.onPrimary,
        },
        {
          data: sorted.map((i) => i.tq),
          color: () => theme.theme.colors.text.secondary.onPrimary
        }
      ],
      legend: ['Torque', 'Horsepower'],
    };
    return data;
  }

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
      }}>
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
              <Paper
                key={randomKey()}
                centerContent>
                <ThemeText>
                  Gear {item.item.gear}
                </ThemeText>
                <LineChart
                  data={getDataForGear(item.item)}
                  width={graphWidth || 40}
                  height={200}
                  style={{
                    backgroundColor: '#00000000'// theme.theme.colors.background.onPrimary
                  }}
                  withInnerLines={false}
                  chartConfig={{
                    labelColor: () => theme.theme.colors.text.primary.onPrimary,
                    color: (opacity) => {
                      if (opacity == 1) {
                        return theme.theme.colors.text.primary.onSecondary
                      }
                      return theme.theme.colors.text.secondary.onSecondary
                    },
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0
                  }} />
              </Paper>
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