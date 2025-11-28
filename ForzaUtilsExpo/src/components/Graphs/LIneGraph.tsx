import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { CardContainer } from '../CardContainer';
import { useThemeContext } from '@/theme/ThemeProvider';
import { IThemeElements } from '@/theme/Themes';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { LineChart } from 'react-native-chart-kit';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

export interface ChartData {
  points: number[][];
  min: number;
  max: number;
}
export interface LabelSet {
  label: string;
  color: string;
}
export interface LineGraphProps {
  height?: number;
  labelData: LabelSet[];
  getData(): ChartData;
}

export function LineGraph(props: LineGraphProps) {
  const theme = useThemeContext().theme;
  const styles = themeStyles(theme, props.height);
  const [chartHeight, setChartHeight] = React.useState<number>(props.height || 180);
  const [chartWidth, setChartWidth] = React.useState<number>(Dimensions.get('window').width * 0.98);

  const chartConfig: AbstractChartConfig = useMemo(() => ({
    decimalPlaces: 2,
    propsForBackgroundLines: {
      stroke: 0
    },
    color: (opacity = 1) => theme.colors.text.primary.onPrimary,
    labelColor: (opacity = 1) => theme.colors.text.primary.onPrimary,
  }), [theme]);

  // Memoize the chart data structure
  const chartData = useMemo(() => {
    const result: LineChartData = {
      labels: [],
      datasets: props.getData().points.map((dataset, index) => ({
        data: dataset,
        color: (opacity = 1) => props.labelData[index].color,
        strokeWidth: 1,
      })),
    };
    result.datasets.push({
      data: [props.getData().min, props.getData().max],
      color: (opacity = 0) => 'transparent',
      strokeWidth: 0,
    })
    return result;
  }, [props.getData]);

  return (
    <CardContainer
      centerContent
      onLayout={(ev) => {
        setChartHeight(ev.nativeEvent.layout.height * 0.98)
        setChartWidth(ev.nativeEvent.layout.width * 0.98)
      }}
      style={styles.card}>
      <LineChart
        transparent
        chartConfig={chartConfig}
        bezier
        withDots={false}
        withScrollableDot={false}
        withVerticalLabels={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withShadow={false}
        width={chartWidth}
        height={chartHeight}
        style={styles.chart}
        data={chartData}  // Use the memoized data
      />
      <View style={styles.labelRow}>
        {props.labelData.map((dataset, index) => (
          <View style={styles.labelView} key={index}>
            <View style={{
              ...styles.labelIcon,
              backgroundColor: dataset.color
            }} />
            <Text style={styles.labelText}>
              {dataset.label}
            </Text>
          </View>
        ))}
      </View>
    </CardContainer>
  );
}
function themeStyles(theme: IThemeElements, height?: number) {
  return StyleSheet.create({
    chart: {
      padding: -5,
      margin: -5,
      marginBottom: -20,
      marginLeft: -10,
      borderRadius: theme.sizes.borderRadius,
    },
    card: {
      height: height || 180,
      width: '100%',
      padding: 0,
      paddingTop: 8,
      paddingBottom: 8,
    },
    labelIcon: {
      width: 12,
      height: 12,
      borderRadius: 12,
      marginRight: 5
    },
    labelText: {
      color: theme.colors.text.primary.onPrimary
    },
    labelView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10
    },
    labelRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      margin: 0,
      padding: 0
    },
  });
}