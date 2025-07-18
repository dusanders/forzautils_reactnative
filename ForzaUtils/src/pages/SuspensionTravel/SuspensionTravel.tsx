import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { IThemeElements } from "../../constants/Themes";
import { BarChart } from "react-native-chart-kit";
import { ChartData, Dataset } from "react-native-chart-kit/dist/HelperTypes";
import { Paper } from "../../components/Paper";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { withScaledWindow } from "../../hooks/withScaledWindow";
import { themeService } from "../../hooks/ThemeState";

export interface SuspensionTravelProps {
  // Nothing
}

export function SuspensionTravel(props: SuspensionTravelProps) {
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
  const frontLabels = [
    'Left Front',
    'Right Front',
  ]
  const rearLabels = [
    'Left Rear',
    'Right Rear'
  ]
  const store = useViewModelStore();
  const viewModel = store.suspensionGraph;
  const navigation = useNavigation<StackNavigation>();
  const theme = themeService().theme;
  const dimensions = withScaledWindow(0.9, 0.3);
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
          height={dimensions.height}
          width={dimensions.width}
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
          height={dimensions.height}
          width={dimensions.width}
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