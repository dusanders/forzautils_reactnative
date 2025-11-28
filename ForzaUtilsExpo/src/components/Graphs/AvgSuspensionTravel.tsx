import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { MemoBaseLineGraph } from "./BaseLineGraph";
import { CardContainer } from "../CardContainer";
import { IThemeElements } from "@/theme/Themes";
import { useThemeContext } from "@/theme/ThemeProvider";
import { useSuspensionViewModel } from "@/viewModels/Suspension/SuspensionViewModel";

export interface IAvgSuspensionTravelProps {
}

export function AvgSuspensionTravel(props: IAvgSuspensionTravelProps) {
  const theme = useThemeContext().theme;
  const styles = themeStyles(theme);
  const viewModel = useSuspensionViewModel();
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
      <MemoBaseLineGraph
        title={'Suspension Travel'}
        dataLength={viewModel.windowSize}
        data={graphData}
        minY={viewModel.avgTravelMin}
        maxY={viewModel.avgTravelMax}
      />
    </CardContainer>
  );
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    card: {
      height: 180,
      width: '100%',
      padding: 0,
      paddingTop: 8,
      paddingBottom: 8,
    },
  });
}