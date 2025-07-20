import React from "react";
import { CardContainer } from "../CardContainer";
import { BaseLineGraph } from "./BaseLineGraph";
import { StyleSheet } from "react-native";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";

export interface AvgTireTempProps {
}

export function AvgTireTemps(props: AvgTireTempProps) {
  const theme = themeService().theme;
  const styles = themeStyles();
  const viewModel = useViewModelStore().tireTemps;

  return (
    <CardContainer
    centerContent
    style={styles.card}>
      <BaseLineGraph
      title="Average Tire Temps"
      dataLength={viewModel.avgTempWindowSize}
      data={[
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
      ]}/>
    </CardContainer>
  )
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