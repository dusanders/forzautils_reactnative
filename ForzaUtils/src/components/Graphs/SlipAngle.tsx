import React from "react";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { CardContainer } from "../CardContainer";
import { StyleSheet } from "react-native";
import { invokeWithTheme } from "../../hooks/ThemeState";
import { BaseLineGraph } from "./BaseLineGraph";

export interface SlipAngleProps {

}

export function SlipAngle(props: SlipAngleProps) {
  const tag = 'SlipAngle';
  const styles = themeStyles();
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
            color: invokeWithTheme(theme => theme.colors.text.primary.onPrimary)
          },
          {
            data: viewModel.slipAngle.map((point) => point.rear),
            label: 'Rear Slip Angle',
            color: invokeWithTheme(theme => theme.colors.text.secondary.onPrimary)
          }
        ]} />
    </CardContainer>
  )
};

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