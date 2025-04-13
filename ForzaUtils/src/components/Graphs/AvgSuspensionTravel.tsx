import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { Paper } from "../Paper";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { IThemeElements } from "../../constants/Themes";
import { BaseLineGraph } from "./BaseLineGraph";
import { CardContainer } from "../CardContainer";

export interface IAvgSuspensionTravelProps {
}

export function AvgSuspensionTravel(props: IAvgSuspensionTravelProps) {
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const viewModel = useViewModelStore().suspensionGraph;

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <BaseLineGraph
        dataLength={20}
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
      height: '20%',
      width: '100%',
      flexGrow: 0,
      padding: 0,
      paddingTop: 12,
      paddingBottom: 12,
    },
  })
}