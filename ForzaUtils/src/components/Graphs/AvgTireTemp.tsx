import React, { useMemo } from "react";
import { CardContainer } from "../CardContainer";
import { BaseLineGraph, MemoBaseLineGraph } from "./BaseLineGraph";
import { StyleSheet } from "react-native";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";

export interface AvgTireTempProps {
}

export function AvgTireTemps(props: AvgTireTempProps) {
  const styles = themeStyles();
  const viewModel = useViewModelStore().tireTemps;
  const theme = themeService().theme;

  const graphData = useMemo(() => {
    return [
      {
        data: viewModel.avgTemps.map((point) => point.front),
        label: 'Front Avg Temp',
        color: theme.colors.text.primary.onPrimary
      },
      {
        data: viewModel.avgTemps.map((point) => point.rear),
        label: 'Rear Avg Temp',
        color: theme.colors.text.secondary.onPrimary
      }
    ];
  }, [viewModel.avgTemps]);

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <MemoBaseLineGraph
        title="Average Tire Temps"
        dataLength={viewModel.avgTempWindowSize}
        data={graphData} 
        minY={viewModel.avgTempWindowMin}
        maxY={viewModel.avgTempWindowMax}/>
    </CardContainer>
  )
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
  }));
}