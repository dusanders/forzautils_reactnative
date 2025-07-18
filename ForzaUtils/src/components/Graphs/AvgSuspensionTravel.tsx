import React, {  } from "react";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { StyleSheet } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { BaseLineGraph } from "./BaseLineGraph";
import { CardContainer } from "../CardContainer";
import { themeService } from "../../hooks/ThemeState";

export interface IAvgSuspensionTravelProps {
}

export function AvgSuspensionTravel(props: IAvgSuspensionTravelProps) {
  const theme = themeService().theme;
  const styles = themeStyles(theme);
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
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    card: {
      height: 180,
      width: '100%',
      padding: 0,
      paddingTop: 24,
      paddingBottom: 24,
    },
  })
}