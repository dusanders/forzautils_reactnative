import React, {  } from "react";
import { StyleSheet } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { BaseLineGraph } from "./BaseLineGraph";
import { CardContainer } from "../CardContainer";
import { useCurrentTheme } from "../../hooks/ThemeState";
import { useSuspensionGraphViewModel } from "../../context/viewModels/SuspensionGraphViewModel";

export interface IAvgSuspensionTravelProps {
}

export function AvgSuspensionTravel(props: IAvgSuspensionTravelProps) {
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  const suspensionVM = useSuspensionGraphViewModel();

  return (
    <CardContainer
      centerContent
      style={styles.card}>
      <BaseLineGraph
        title={'Suspension Travel'}
        dataLength={suspensionVM.windowSize}
        data={[
          {
            data: suspensionVM.avgTravel.map((point) => point.front),
            label: 'Front Avg Travel',
            color: theme.colors.text.primary.onPrimary
          },
          {
            data: suspensionVM.avgTravel.map((point) => point.rear),
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
      height: 180,
      width: '100%',
      padding: 0,
      paddingTop: 24,
      paddingBottom: 24,
    },
  })
}