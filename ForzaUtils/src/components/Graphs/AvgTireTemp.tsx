import React from "react";
import { CardContainer } from "../CardContainer";
import { BaseLineGraph } from "./BaseLineGraph";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";
import { StyleSheet } from "react-native";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";

export interface AvgTireTempProps {
}

export function AvgTireTemps(props: AvgTireTempProps) {
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
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

function themeStyles(theme: any) {
  return StyleSheet.create({
    card: {
      height: 180,
      width: '100%',
      padding: 0,
      paddingTop: 24,
      paddingBottom: 24,
    },
  });
}