import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";
import { LineGraph } from "./LIneGraph";

export interface AvgTireTempProps {
}

export function AvgTireTemps(props: AvgTireTempProps) {
  const viewModel = useViewModelStore().tireTemps;
  const theme = themeService().theme;
  const styles = themeStyles();

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

  return (
    <ScrollView
    style={styles.scrollView}>
      <LineGraph
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
      />
    </ScrollView>
  )
}

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    scrollView: {
      marginBottom: 60,
    },
  }));
}