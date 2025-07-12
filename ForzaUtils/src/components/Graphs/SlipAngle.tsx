import React from "react";
import { CardContainer } from "../CardContainer";
import { StyleSheet } from "react-native";
import { useCurrentTheme } from "../../hooks/ThemeState";
import { BaseLineGraph } from "./BaseLineGraph";
import { useGripViewModel } from "../../context/viewModels/GripViewModel";

export interface SlipAngleProps {

}

export function SlipAngle(props: SlipAngleProps) {
  const tag = 'SlipAngle';
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  const gripVM = useGripViewModel();

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <BaseLineGraph
        title="Slip Angle"
        dataLength={gripVM.slipAngleWindowSize}
        data={[
          {
            data: gripVM.slipAngle.map((point) => point.front),
            label: 'Front Slip Angle',
            color: theme.colors.text.primary.onPrimary
          },
          {
            data: gripVM.slipAngle.map((point) => point.rear),
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