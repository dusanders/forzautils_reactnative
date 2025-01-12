import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, ScaledSize, StyleSheet } from "react-native";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { BarChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { Paper } from "../../components/Paper";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";

export interface SuspensionTravelProps {
  // Nothing
}

const labels = [
  'Left Front',
  'Right Front',
  'Left Rear',
  'Right Rear'
]
export function SuspensionTravel(props: SuspensionTravelProps) {
  const getScaledHeight = (screenHeight: number) => {
    return screenHeight * 0.5;
  }
  const getScaledWidth = (screenWidth: number) => {
    return screenWidth;
  }
  const store = useViewModelStore();
  const viewModel = store.suspensionGraph;
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme().theme;
  const [height, setHeight] = useState(getScaledHeight(Dimensions.get('window').height));
  const [width, setWidth] = useState(getScaledWidth(Dimensions.get('window').width));
  const style = themeStyles(theme);
  const [chartData, setChartData] = useState<ChartData>({
    labels: labels,
    datasets: [
      {
        data: [0, 0, 0, 0]
      }
    ]
  });

  const handleOrientationChange = useCallback((ev: {window: ScaledSize, screen: ScaledSize}) => {
    setHeight(getScaledHeight(ev.window.height));
    setWidth(getScaledWidth(ev.window.width));
  }, [])

  const handleViewModelUpdate = useCallback(() => {
    setChartData({
      labels: labels,
      datasets: [
        {
          data: [
            viewModel.leftFront,
            viewModel.rightFront,
            viewModel.leftRear,
            viewModel.rightRear
          ],
        },
      ]
    })
  }, [store.suspensionGraph.leftFront]);

  useEffect(
    handleViewModelUpdate,
    [store.suspensionGraph.leftFront]
  );

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
          withInnerLines={false}
          data={chartData}
          height={height}
          width={width}
          yAxisLabel=""
          xAxisLabel=""
          yAxisSuffix=""
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
      paddingBottom: 0
    }
  })
}