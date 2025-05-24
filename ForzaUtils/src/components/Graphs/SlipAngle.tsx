import React from "react";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { CardContainer } from "../CardContainer";
import { StyleSheet } from "react-native";
import { useCurrentTheme } from "../../hooks/ThemeState";
import { BaseLineGraph } from "./BaseLineGraph";

export interface SlipAngleProps {

}

export function SlipAngle(props: SlipAngleProps) {
  const tag = 'SlipAngle';
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  const viewModel = useViewModelStore().grip;

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <BaseLineGraph
        title="Slip Angle"
        dataLength={viewModel.slipAngleWindowSize}
        data={[
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
        ]} />
    </CardContainer>
  )
};

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