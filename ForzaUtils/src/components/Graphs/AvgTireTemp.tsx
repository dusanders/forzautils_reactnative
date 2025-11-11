import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";
import { LineGraph } from "./LIneGraph";
import { BaseLineGraph } from "./BaseLineGraph";

export interface AvgTireTempProps {
}

export function AvgTireTemps(props: AvgTireTempProps) {
  const viewModel = useViewModelStore().tireTemps;
  const theme = themeService().theme;
  const styles = themeStyles();
  
/** Kept for use with LineGraph component alternative
  const avgAxleLabels = useMemo(() => {
    return [
      {
        label: 'Front Avg Temp',
        color: theme.colors.text.primary.onPrimary
      },
      {
        label: 'Rear Avg Temp',
        color: theme.colors.text.secondary.onPrimary
      }
    ];
  }, [theme]);
  const avgAxleData = useCallback(() => {
    return {
      points: [
        viewModel.avgTemps.map((point) => point.front),
        viewModel.avgTemps.map((point) => point.rear),
      ],
      min: viewModel.avgTempWindowMin,
      max: viewModel.avgTempWindowMax,
    };
  }, [viewModel.avgTemps]);
  const leftFrontLabels = useMemo(() => [
    {
      label: 'Left Front Tire Temp',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme]);
  const rightFrontLabels = useMemo(() => [
    {
      label: 'Right Front Tire Temp',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme]);
  const leftRearLabels = useMemo(() => [
    {
      label: 'Left Rear Tire Temp',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme]);
  const rightRearLabels = useMemo(() => [
    {
      label: 'Right Rear Tire Temp',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme]);
  const getTireData = useCallback((tire: 'leftFront' | 'rightFront' | 'leftRear' | 'rightRear') => {
    return {
      points: [viewModel.tireDataWindow.data.map(t => t[tire])],
      min: viewModel.tireDataWindow.min,
      max: viewModel.tireDataWindow.max,
    }
  }, [viewModel.tireDataWindow]);
**/

  return (
    <ScrollView
      style={styles.scrollView}>
      <View style={styles.graphContainer}>
        <BaseLineGraph
          minY={viewModel.avgTempWindowMin}
          maxY={viewModel.avgTempWindowMax}
          dataLength={viewModel.avgTempWindowSize}
          title="Average Tire Temperatures"
          data={[
            {
              label: 'Front Avg Temp',
              color: theme.colors.text.primary.onPrimary,
              data: viewModel.avgTemps.map((point) => point.front),
            },
            {
              label: 'Rear Avg Temp',
              color: theme.colors.text.secondary.onPrimary,
              data: viewModel.avgTemps.map((point) => point.rear),
            },
          ]}
        />
      </View>
      <View
        style={styles.graphContainer}>
        <BaseLineGraph
          minY={viewModel.tireDataWindow.min}
          maxY={viewModel.tireDataWindow.max}
          dataLength={viewModel.tireDataWindow.size}
          title="Left Front Tire Temperature"
          data={[
            {
              label: 'Left Front Tire Temp',
              color: theme.colors.text.primary.onPrimary,
              data: viewModel.tireDataWindow.data.map(t => t.leftFront),
            },
          ]}
        />
      </View>
      <View style={styles.graphContainer}>
        <BaseLineGraph
          minY={viewModel.tireDataWindow.min}
          maxY={viewModel.tireDataWindow.max}
          dataLength={viewModel.tireDataWindow.size}
          title="Right Front Tire Temperature"
          data={[
            {
              label: 'Right Front Tire Temp',
              color: theme.colors.text.primary.onPrimary,
              data: viewModel.tireDataWindow.data.map(t => t.rightFront),
            },
          ]}
        />
      </View>
      <View style={styles.graphContainer}>
        <BaseLineGraph
          minY={viewModel.tireDataWindow.min}
          maxY={viewModel.tireDataWindow.max}
          dataLength={viewModel.tireDataWindow.size}
          title="Left Rear Tire Temperature"
          data={[
            {
              label: 'Left Rear Tire Temp',
              color: theme.colors.text.primary.onPrimary,
              data: viewModel.tireDataWindow.data.map(t => t.leftRear),
            },
          ]}
        />
      </View>
      <View style={styles.graphContainer}>
        <BaseLineGraph
          minY={viewModel.tireDataWindow.min}
          maxY={viewModel.tireDataWindow.max}
          dataLength={viewModel.tireDataWindow.size}
          title="Right Rear Tire Temperature"
          data={[
            {
              label: 'Right Rear Tire Temp',
              color: theme.colors.text.primary.onPrimary,
              data: viewModel.tireDataWindow.data.map(t => t.rightRear),
            },
          ]}
        />
      </View>
      {/* <LineGraph
        labelData={avgAxleLabels}
        getData={() => avgAxleData()}
      />
      <LineGraph
        labelData={leftFrontLabels}
        getData={() => getTireData('leftFront')}
      />
      <LineGraph
        labelData={rightFrontLabels}
        getData={() => getTireData('rightFront')}
      />
      <LineGraph
        labelData={leftRearLabels}
        getData={() => getTireData('leftRear')}
      />
      <LineGraph
        labelData={rightRearLabels}
        getData={() => getTireData('rightRear')}
      /> */}
    </ScrollView>
  )
}

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    scrollView: {
      marginBottom: 60,
    },
    graphContainer: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },
  }));
}