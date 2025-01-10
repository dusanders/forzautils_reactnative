import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ISuspensionGraphViewModel } from "../../context/viewModels/SuspensionGraphViewModel";
import { INavigationTarget } from "../../context/Navigator";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useNavigation } from "../../hooks/useNavigation";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { Paper } from "../../components/Paper";

export interface SuspensionTravelProps extends INavigationTarget {
  viewModel: ISuspensionGraphViewModel;
}

export function SuspensionTravel(props: SuspensionTravelProps) {
  const navigation = useNavigation();
  const theme = useTheme().theme;
  const style = themeStyles(theme);

  const labels = [
    'Left Front',
    'Right Front',
    'Left Rear',
    'Right Rear'
  ]

  const data = [
    33, 23, 43, 54,
  ]

  const chartData: ChartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      }
    ]
  }
  return (
    <AppBarContainer
      title="Suspension Travel"
      onBack={() => { navigation.goBack() }}>
      <Paper style={style.content}>
        <BarChart
          flatColor
          fromZero
          withInnerLines={false}
          data={chartData}
          height={Dimensions.get('window').height * 0.4}
          width={Dimensions.get('window').width * .90}
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
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
}