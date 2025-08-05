import React, { useMemo } from "react";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { StyleSheet } from "react-native";
import { BaseLineGraph, MemoBaseLineGraph } from "./BaseLineGraph";
import { CardContainer } from "../CardContainer";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";
import { MemoSkiaLineGraph } from "./SkiaLineGraph";

export interface IAvgSuspensionTravelProps {
}

export function AvgSuspensionTravel(props: IAvgSuspensionTravelProps) {
  const styles = themeStyles();
  const viewModel = useViewModelStore().suspensionGraph;
  const theme = themeService().theme;
  const graphData = useMemo(() => {
    return [
      {
        data: viewModel.avgTravel.map((point) => point.front),
        label: 'Front Avg Travel',
        color: theme.colors.text.primary.onPrimary
      },
      {
        data: viewModel.avgTravel.map((point) => point.rear),
        label: 'Rear Avg Travel',
        color: theme.colors.text.secondary.onPrimary
      }
    ];
  }, [viewModel.avgTravel]);

  return (
    <CardContainer
      centerContent
      style={styles.card}>
        <MemoSkiaLineGraph
          title={'Suspension Travel'}
          dataLength={viewModel.windowSize}
          data={graphData}
          minY={viewModel.avgTravelMin}
          maxY={viewModel.avgTravelMax} />
      {/* <MemoBaseLineGraph
        title={'Suspension Travel'}
        dataLength={viewModel.windowSize}
        data={graphData}
        minY={viewModel.avgTravelMin}
        maxY={viewModel.avgTravelMax}
      /> */}
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
  }));
}