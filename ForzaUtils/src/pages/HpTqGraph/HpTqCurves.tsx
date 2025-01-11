import React from "react";
import LineChart, { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Paper } from "../../components/Paper";
import { ThemeText } from "../../components/ThemeText";
import { useTheme } from "../../hooks/useTheme";

export interface CurveDataPoint {
  rpm: number,
  hp: number,
  tq: number
}

export interface HpTqCurvesProps {
  gear: number;
  width: number;
  data: CurveDataPoint[];
}

export function HpTqCurves(props: HpTqCurvesProps) {
  const theme = useTheme();
  const sorted = props.data.sort((a, b) => a.rpm - b.rpm);

  const lineData: LineChartData = {
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
            ? (index % 5 === 1)
              ? label
              : ''
            : (index % 2 === 1)
            ? label
            : ''
        }}
        chartConfig={{
          labelColor: () => theme.theme.colors.text.primary.onPrimary,
          color: (opacity) => {
            if (opacity == 1) {
              return theme.theme.colors.text.primary.onSecondary
            }
            return theme.theme.colors.text.secondary.onSecondary
          },
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
        }} />
    </Paper>
  )
}