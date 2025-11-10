import React, { useMemo } from "react";
import { CardContainer } from "../CardContainer";
import { MemoBaseLineGraph } from "./BaseLineGraph";
import { ScrollView, StyleSheet } from "react-native";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";
import { LineGraph } from "./LIneGraph";

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
    <ScrollView>
      <CardContainer
        centerContent
        style={styles.card}>
        <MemoBaseLineGraph
          title="Average Tire Temps"
          dataLength={viewModel.avgTempWindowSize}
          data={graphData}
          minY={viewModel.avgTempWindowMin}
          maxY={viewModel.avgTempWindowMax} />
      </CardContainer>
      <LineGraph
        labelData={[
          {
            label: 'Front Avg Temp',
            color: theme.colors.text.primary.onPrimary
          },
          {
            label: 'Rear Avg Temp',
            color: theme.colors.text.secondary.onPrimary
          }
        ]}
        getData={() => ({
          points: [
            viewModel.avgTemps.map((point) => point.front),
            viewModel.avgTemps.map((point) => point.rear),
          ],
          min: viewModel.avgTempWindowMin,
          max: viewModel.avgTempWindowMax,
        })}
      />
    </ScrollView>
  )
}

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    card: {
      height: 350,
      width: '100%',
      padding: 0,
      paddingTop: 8,
      paddingBottom: 8,
    },
  }));
}