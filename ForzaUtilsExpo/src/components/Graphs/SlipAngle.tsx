import { useThemeContext } from "@/theme/ThemeProvider";
import React, { useMemo } from "react";
import { CardContainer } from "../CardContainer";
import { IThemeElements } from "@/theme/Themes";
import { StyleSheet } from "react-native";
import { MemoBaseLineGraph } from "./BaseLineGraph";
import { useGripViewModel } from "@/viewModels/Grip/GripViewModel";

export interface SlipAngleProps {

}

export function SlipAngle(props: SlipAngleProps) {
  const tag = 'SlipAngle';
  const theme = useThemeContext().theme;
  const styles = themeStyles(theme);
  const viewModel = useGripViewModel();
  const graphData = useMemo(() => {
    return [
      {
        data: viewModel.slipRatioDataWindow.data.map((point) => point.front),
        label: 'Front Slip Angle',
        color: theme.colors.text.primary.onPrimary
      },
      {
        data: viewModel.slipRatioDataWindow.data.map((point) => point.rear),
        label: 'Rear Slip Angle',
        color: theme.colors.text.secondary.onPrimary
      }
    ];
  }, [viewModel.slipRatioDataWindow.data, theme.colors.text.primary.onPrimary, theme.colors.text.secondary.onPrimary]);
  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <MemoBaseLineGraph
        title="Slip Angle"
        dataLength={viewModel.slipRatioDataWindow.size}
        data={graphData} 
        minY={viewModel.slipRatioDataWindow.min}
        maxY={viewModel.slipRatioDataWindow.max}/>
    </CardContainer>
  )
};

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    card: {
      height: 180,
      width: '100%',
      padding: 0,
      paddingTop: 8,
      paddingBottom: 8,
    },
  });
}