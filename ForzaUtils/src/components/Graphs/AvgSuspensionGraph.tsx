import React, { useMemo } from 'react';
import { useViewModelStore } from '../../context/viewModels/ViewModelStore';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { CardContainer } from '../CardContainer';
import { invokeWithTheme, themeService } from '../../hooks/ThemeState';
import { LineChart } from 'react-native-chart-kit';

export interface AvgSuspensionGraphProps {

}

export function AvgSuspensionGraph(props: AvgSuspensionGraphProps) {
  const styles = themeStyles();
  const viewModel = useViewModelStore().suspensionGraph;
  const theme = themeService().theme;

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <LineChart
        chartConfig={{
          backgroundColor: theme.colors.card.borderColor,
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
        style={{
          borderRadius: theme.sizes.borderRadius,
          paddingHorizontal: 0,
          marginLeft: 0
        }}
        data={{
          labels: [],
          datasets: [
            {
              data: viewModel.avgTravel.map((point) => point.front),
              color: (opacity = 1) => theme.colors.text.primary.onPrimary,
              strokeWidth: 1,
            },
            {
              data: viewModel.avgTravel.map((point) => point.rear),
              color: (opacity = 1) => theme.colors.text.secondary.onPrimary,
              strokeWidth: 1,
            },
          ],
        }}
      />
      <View style={styles.labelRow}>
        <View style={styles.labelView}>
          <View style={{
            ...styles.labelIcon,
            backgroundColor: theme.colors.text.primary.onPrimary
          }} />
          <Text style={styles.labelText}>
            Front Avg Travel
          </Text>
        </View>
        <View style={styles.labelView}>
          <View style={{
            ...styles.labelIcon,
            backgroundColor: theme.colors.text.secondary.onPrimary
          }} />
          <Text style={styles.labelText}>
            Rear Avg Travel
          </Text>
        </View>
      </View>
    </CardContainer>
  );
}
function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
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