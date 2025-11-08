import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { CardContainer } from '../CardContainer';
import { invokeWithTheme, themeService } from '../../hooks/ThemeState';
import { LineChart } from 'react-native-chart-kit';

export interface SuspensionData {
  points: number[];
  color: string;
  label: string;
}
export interface AvgSuspensionGraphProps {
  data?: SuspensionData[];
  getData(): SuspensionData[];
}

export function AvgSuspensionGraph(props: AvgSuspensionGraphProps) {
  const styles = themeStyles();
  const theme = themeService().theme;
  
  // Memoize the raw data to avoid recomputing on every render
  const rawData = useMemo(() => props.getData(), [props.getData]);
  
  // Memoize the chart data structure
  const chartData = useMemo(() => ({
    labels: [],
    datasets: rawData.map((dataset) => ({
      data: dataset.points,
      color: (opacity = 1) => dataset.color,
      strokeWidth: 1,
    })),
  }), [rawData]);
  
  // Memoize labelData for reactivity
  const labelData = useMemo(() => rawData, [rawData]);
  

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <LineChart
        chartConfig={{
          backgroundColor: theme.colors.background.primary,
          backgroundGradientFrom: theme.colors.background.primary,
          backgroundGradientTo: theme.colors.background.primary,
          decimalPlaces: 2,
          propsForBackgroundLines: {
            stroke: 0
          },
          color: (opacity = 1) => theme.colors.text.primary.onPrimary,
          labelColor: (opacity = 1) => theme.colors.text.primary.onPrimary,
        }}
        bezier
        withDots={false}
        withScrollableDot={false}
        withVerticalLabels={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withShadow={false}
        width={Dimensions.get('window').width * 0.98} // from react-native
        height={160}
        style={styles.chart}
        data={chartData}  // Use the memoized data
      />
      <View style={styles.labelRow}>
        {labelData.map((dataset) => (
          <View style={styles.labelView} key={dataset.label}>
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
function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    chart: {
      height: 160,
      width: Dimensions.get('window').width * 0.98,
      borderRadius: theme.sizes.borderRadius,
    },
    card: {
      height: 180,
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
  }));
}