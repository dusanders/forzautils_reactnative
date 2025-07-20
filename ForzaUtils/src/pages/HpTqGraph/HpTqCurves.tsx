import React, { memo } from "react";
import LineChart, { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Paper } from "../../components/Paper";
import { ThemeText } from "../../components/ThemeText";
import { DataEvent } from "../../context/viewModels/HpTqGraphViewModel";
import { invokeWithTheme } from "../../hooks/ThemeState";


export interface HpTqCurvesProps {
  gear: number;
  width: number;
  data: DataEvent[];
}

export const HpTqCurves = memo((props: HpTqCurvesProps) => {
  const sorted = props.data.sort((a, b) => a.rpm - b.rpm);

  const lineData: LineChartData = {
    labels: sorted.map((i) => `${i.rpm}`),
    datasets: [
      {
        data: sorted.map((i) => i.hp),
        color: () => invokeWithTheme((theme) => theme.colors.text.primary.onPrimary),
      },
      {
        data: sorted.map((i) => i.tq),
        color: () => invokeWithTheme((theme) => theme.colors.text.secondary.onPrimary)
      }
    ],
    legend: ['Torque', 'Horsepower'],
  }

  return (
    <Paper centerContent>
      <ThemeText>
        Gear {props.gear}
      </ThemeText>
      <LineChart
        data={lineData}
        width={props.width || 40}
        height={200}
        withInnerLines={false}
        formatXLabel={(label) => {
          const index = lineData.labels.indexOf(label);
          return lineData.labels.length > 10
            ? (index % 5 === 0)
              ? label
              : ''
            : (index % 2 === 0)
              ? label
              : ''
        }}
        chartConfig={{
          labelColor: () => invokeWithTheme((theme) => theme.colors.text.primary.onPrimary),
          color: (opacity) => {
            if (opacity == 1) {
              return invokeWithTheme((theme) => theme.colors.text.primary.onSecondary)
            }
            return invokeWithTheme((theme) => theme.colors.text.secondary.onSecondary)
          },
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
        }} />
    </Paper>
  )
});