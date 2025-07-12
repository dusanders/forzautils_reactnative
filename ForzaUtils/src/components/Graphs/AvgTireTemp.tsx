import React from "react";
import { CardContainer } from "../CardContainer";
import { BaseLineGraph } from "./BaseLineGraph";
import { StyleSheet } from "react-native";
import { useCurrentTheme } from "../../hooks/ThemeState";
import { useTireTempsViewModel } from "../../context/viewModels/TireTempViewModel";

export interface AvgTireTempProps {
}

export function AvgTireTemps(props: AvgTireTempProps) {
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  const tireVM = useTireTempsViewModel();

  return (
    <CardContainer
    centerContent
    style={styles.card}>
      <BaseLineGraph
      title="Average Tire Temps"
      dataLength={tireVM.avgTempWindowSize}
      data={[
        {
          data: tireVM.avgTemps.map((point) => point.front),
          label: 'Front Avg Temp',
          color: theme.colors.text.primary.onPrimary
        }, 
        {
          data: tireVM.avgTemps.map((point) => point.rear),
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