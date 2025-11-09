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
  const labelColor = invokeWithTheme((theme) => theme.colors.text.primary.onPrimary);
  const primaryColor = invokeWithTheme((theme) => theme.colors.text.primary.onSecondary);
  const secondaryColor = invokeWithTheme((theme) => theme.colors.text.secondary.onSecondary);
  const hpColor = invokeWithTheme((theme) => theme.colors.text.primary.onPrimary);
  const tqColor = invokeWithTheme((theme) => theme.colors.text.secondary.onPrimary);
  const sorted = props.data.sort((a, b) => a.rpm - b.rpm);

  const lineData: LineChartData = {
    labels: sorted.map((i) => `${i.rpm}`),
    datasets: [
      {
        data: sorted.map((i) => i.hp),
        color: () => hpColor,
      },
      {
        data: sorted.map((i) => i.tq),
        color: () => tqColor
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
        bezier
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
          labelColor: () => labelColor,
          color: (opacity) => {
            if (opacity == 1) {
              return primaryColor
            }
            return secondaryColor
          },
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
        }} />
    </Paper>
  )
});