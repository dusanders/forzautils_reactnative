import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, ScaledSize, StyleSheet } from "react-native";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { BarChart } from "react-native-chart-kit";
import { ChartData, Dataset } from "react-native-chart-kit/dist/HelperTypes";
import { Paper } from "../../components/Paper";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { TireData } from "ForzaTelemetryApi";

export interface SuspensionTravelProps {
  // Nothing
}

const frontLabels = [
  'Left Front',
  'Right Front',
]
const rearLabels = [
  'Left Rear',
  'Right Rear'
]
export function SuspensionTravel(props: SuspensionTravelProps) {
  const getScaledHeight = (screenHeight: number) => {
    return screenHeight * 0.3;
  }
  const getScaledWidth = (screenWidth: number) => {
    return screenWidth;
  }
  const getDataSets = (toDisplay: number[]): Dataset[] => {
    return [
      {
        data: toDisplay
      },
      {
        data: [100, 0],
        withDots: false
      }
    ]
  }
  const store = useViewModelStore();
  const viewModel = store.suspensionGraph;
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme().theme;
  const [height, setHeight] = useState(getScaledHeight(Dimensions.get('window').height));
  const [width, setWidth] = useState(getScaledWidth(Dimensions.get('window').width));
  const style = themeStyles(theme);
  const frontChartData = useMemo<ChartData>(() => {
    return {
      labels: frontLabels,
      datasets: getDataSets([viewModel.leftFront, viewModel.rightFront])
    }
  }, [viewModel.leftFront, viewModel.rightFront]);
  const rearChartData = useMemo<ChartData>(() => {
    return {
      labels: rearLabels,
      datasets: getDataSets([viewModel.leftRear, viewModel.rightRear])
    }
  }, [viewModel.leftRear, viewModel.rightRear]);

  const handleOrientationChange = useCallback((ev: { window: ScaledSize, screen: ScaledSize }) => {
    setHeight(getScaledHeight(ev.window.height));
    setWidth(getScaledWidth(ev.window.width));
  }, []);

  useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange)
  })

  return (
    <AppBarContainer
      title="Suspension Travel"
      onBack={() => { navigation.goBack() }}>
      <Paper style={style.content}>
        <BarChart
          style={{
            marginBottom: 0,
            paddingBottom: 0
          }}
          flatColor
          fromZero
          fromNumber={65}
          withInnerLines={false}
          data={frontChartData}
          height={height}
          width={width}
          yAxisLabel=""
          xAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            color: (opacity, index) => {
              return index === 2 ? '' : theme.colors.text.primary.onPrimary
            },
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            width: 400,
          }} />
      </Paper>
      <Paper style={style.content}>
        <BarChart
          style={{
            marginBottom: 0,
            paddingBottom: 0
          }}
          flatColor
          fromZero
          withInnerLines={false}
          data={rearChartData}
          height={height}
          width={width}
          yAxisLabel=""
          xAxisLabel=""
          yAxisSuffix=""
          fromNumber={65}
          chartConfig={{
            color: (opacity, index) => {
              return theme.colors.text.primary.onPrimary
            },
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
          }} />
      </Paper>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    content: {
      width: '95%',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      paddingBottom: 0,
      marginBottom: theme.sizes.borderRadius
    }
  })
}