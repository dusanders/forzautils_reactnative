import React, { useMemo } from "react";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { CardContainer } from "../CardContainer";
import { StyleSheet } from "react-native";
import { invokeWithTheme, themeService } from "../../hooks/ThemeState";
import { BaseLineGraph, MemoBaseLineGraph } from "./BaseLineGraph";

export interface SlipAngleProps {

}

export function SlipAngle(props: SlipAngleProps) {
  const tag = 'SlipAngle';
  const styles = themeStyles();
  const viewModel = useViewModelStore().grip;
  const theme = themeService().theme;
  const graphData = useMemo(() => {
    return [
      {
        data: viewModel.slipAngle.map((point) => point.front),
        label: 'Front Slip Angle',
        color: theme.colors.text.primary.onPrimary
      },
      {
        data: viewModel.slipAngle.map((point) => point.rear),
        label: 'Rear Slip Angle',
        color: theme.colors.text.secondary.onPrimary
      }
    ];
  }, [viewModel.slipAngle, theme.colors.text.primary.onPrimary, theme.colors.text.secondary.onPrimary]);
  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <MemoBaseLineGraph
        title="Slip Angle"
        dataLength={viewModel.slipAngleWindowSize}
        data={graphData} 
        minY={viewModel.slipAngleMin}
        maxY={viewModel.slipAngleMax}/>
    </CardContainer>
  )
};

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