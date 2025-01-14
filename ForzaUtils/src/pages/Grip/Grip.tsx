import React, { memo, useMemo, useState } from "react";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { BarChart, LineChart, ProgressChart } from "react-native-chart-kit";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { useTheme } from "../../hooks/useTheme";

export interface GripProps {
  // Nothing
}

interface BrakeThrottleChartProps {
  throttle: number;
  brake: number;
}
const BrakeThrottleChart = memo((props: BrakeThrottleChartProps) => {
  return (
    <ProgressChart
      style={{
        backgroundColor: '#00000000'
      }}
      data={{
        labels: ['Brake', 'Throttle'],
        data: [props.brake, props.throttle]
      }}
      width={370}
      height={300}
      strokeWidth={21}
      radius={55}
      hideLegend
      chartConfig={{
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (op, index) => {
          switch (index) {
            case 0: return `rgba(244,0,0,${op})`
          }
          return `rgba(0,255,0,${op})`;
        }
      }} />
  )
})

export function Grip(props: GripProps) {
  const theme = useTheme().theme;
  const navigation = useNavigation<StackNavigation>();
  const viewModel = useViewModelStore().grip;
  const brakeThrottle = useMemo<BrakeThrottleChartProps>(() => {
    return {
      brake: viewModel.brake,
      throttle: viewModel.throttle
    }
  }, [viewModel.brake, viewModel.throttle]);

  const steeringChart: ChartData = {
    labels: ['Steering Angle'],
    datasets: [
      {
        data: [0]
      }
    ]
  }

  return (
    <AppBarContainer
      onBack={() => { navigation.pop() }}
      title="Grip">
      <BrakeThrottleChart
        brake={brakeThrottle.brake}
        throttle={brakeThrottle.throttle} />
      <BarChart
        style={{
          transform: [
            {rotate: '90deg'},
            {translateX: '40%'}
          ]
        }}
        withHorizontalLabels={false}
        flatColor
        fromZero
        withInnerLines={false}
        data={steeringChart}
        height={100}
        width={200}
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
    </AppBarContainer>
  )
}