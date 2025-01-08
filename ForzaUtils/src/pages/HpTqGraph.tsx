import React, { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { useNavigation } from "../hooks/useNavigation";
import { AppBar } from "../components/AppBar";
import { Dimensions, StyleSheet } from "react-native";
import { useForzaData } from "../hooks/useForzaData";
import { useTheme } from "../hooks/useTheme";
import { IThemeElements } from "../constants/Themes";
import { Assets } from "../assets";
import { IHpTqGraphViewModel } from "../context/HpTqGraphViewModel";
import { Paper } from "../components/Paper";
import { LineChart } from "react-native-chart-kit";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Dataset } from "react-native-chart-kit/dist/HelperTypes";

export interface HpTqGraphProps {
  viewModel: IHpTqGraphViewModel;
}

export function HptqGraph(props: HpTqGraphProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const forza = useForzaData();
  const [graphWidth, setGraphWidth] = useState(0)

  useEffect(() => {

  }, [forza.packet]);

  const sets: Dataset[] = [
    {
      data: [43, 54, 65, 76],
      color: () => theme.theme.colors.text.primary.onPrimary,
      strokeWidth: 2 // optional
    },
    {
      data: [23, 34, 72, 89],
      color: () => theme.theme.colors.text.secondary.onPrimary
    }
  ]
  const data: LineChartData = {
    labels: ['1234', '1345', '1451', '1512'],
    datasets: sets,
    legend: ['Torque', 'Horsepower']
  }
  return (
    <Container
      fill={'parent'}
      flex={'column'}>
      <AppBar title="Hp / Tq Graph"
        onBack={() => {
          navigation.goBack()
        }} />
      <Paper
      onLayout={(ev) => {
        ev.target.measure((x, y, width, height) => {
          setGraphWidth(width)
        })
      }}
        centerContent
        style={{
          marginTop: 50,
        }}>
        <LineChart
          data={data}
          width={graphWidth}
          height={200}
          style={{
            backgroundColor: '#00000000'// theme.theme.colors.background.onPrimary
          }}
          withInnerLines={false}
          chartConfig={{
            labelColor: () => theme.theme.colors.text.primary.onPrimary,
            color: () => 'pink',
            backgroundColor: 'green',
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0
          }} />
      </Paper>
    </Container>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
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