import React, { memo } from "react";
import LineChart, { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Paper } from "../../components/Paper";
import { ThemeText } from "../../components/ThemeText";
import { DataEvent } from "../../context/viewModels/HpTqGraphViewModel";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";


export interface HpTqCurvesProps {
  gear: number;
  width: number;
  data: DataEvent[];
}

export const HpTqCurves = memo((props: HpTqCurvesProps) => {
  const theme = useSelector(getTheme);
  const sorted = props.data.sort((a, b) => a.rpm - b.rpm);

  const lineData: LineChartData = {
    labels: sorted.map((i) => `${i.rpm}`),
    datasets: [
      {
        data: sorted.map((i) => i.hp),
        color: () => theme.colors.text.primary.onPrimary,
      },
      {
        data: sorted.map((i) => i.tq),
        color: () => theme.colors.text.secondary.onPrimary
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
          labelColor: () => theme.colors.text.primary.onPrimary,
          color: (opacity) => {
            if (opacity == 1) {
              return theme.colors.text.primary.onSecondary
            }
            return theme.colors.text.secondary.onSecondary
          },
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
        }} />
    </Paper>
  )
});