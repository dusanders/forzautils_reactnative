import React, { memo } from "react";
import LineChart, { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Paper } from "@/components/Paper";
import { ThemeText } from "@/components/ThemeText";
import { useThemeContext } from "@/theme/ThemeProvider";
import { HpTqReading } from "@/viewModels/HpTq/HpTqViewModel";


export interface HpTqCurvesProps {
  gear: number;
  width: number;
  data: HpTqReading[];
}

export const HpTqCurves = memo((props: HpTqCurvesProps) => {
  const theme = useThemeContext();
  const labelColor = theme.theme.colors.text.primary.onPrimary;
  const primaryColor = theme.theme.colors.text.primary.onSecondary;
  const secondaryColor = theme.theme.colors.text.secondary.onSecondary;
  const hpColor = theme.theme.colors.text.primary.onPrimary;
  const tqColor = theme.theme.colors.text.secondary.onPrimary;
  const sorted = props.data.sort((a, b) => a.rpm - b.rpm);

  const lineData: LineChartData = {
    labels: sorted.map((i) => `${i.rpm}`),
    datasets: [
      {
        data: sorted.map((i) => i.horsepower),
        color: () => hpColor,
      },
      {
        data: sorted.map((i) => i.torque),
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
        withDots={false}
        withShadow={false}
        formatXLabel={(label) => {
          const index = lineData.labels.indexOf(label);
          return lineData.labels.length > 10
            ? (index % 10 === 0)
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