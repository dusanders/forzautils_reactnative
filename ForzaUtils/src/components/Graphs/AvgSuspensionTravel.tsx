import React, {  } from "react";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { StyleSheet } from "react-native";
import { BaseLineGraph } from "./BaseLineGraph";
import { CardContainer } from "../CardContainer";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";

export interface IAvgSuspensionTravelProps {
}

export function AvgSuspensionTravel(props: IAvgSuspensionTravelProps) {
  const styles = themeStyles();
  const theme = themeService().theme;
  const viewModel = useViewModelStore().suspensionGraph;

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <BaseLineGraph
        title={'Suspension Travel'}
        dataLength={viewModel.windowSize}
        data={[
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
        ]} />

    </CardContainer>
  );
}
function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    card: {
      height: 180,
      width: '100%',
      padding: 0,
      paddingTop: 24,
      paddingBottom: 24,
    },
  }));
}