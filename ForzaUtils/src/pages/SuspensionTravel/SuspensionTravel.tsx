import React, { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { useThemeColors } from "../../hooks/ThemeState";
import { LineGraph } from "../../components/Graphs/LIneGraph";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";

export interface SuspensionTravelProps {
  // Nothing
}

export const SuspensionTravel = React.memo((props: SuspensionTravelProps) => {
  const theme = useThemeColors();
  const viewModel = useViewModelStore().suspensionGraph;

  // Memoize getData functions to prevent recreation
  const avgData = useCallback(() => ({
    points: [
      viewModel.avgTravel.map((point) => point.front),
      viewModel.avgTravel.map((point) => point.rear),
    ],
    min: viewModel.avgTravelMin,
    max: viewModel.avgTravelMax,
  }), [viewModel.avgTravel]);
  const avgLabelData = useMemo(() => [
    {
      label: 'Front Avg Travel',
      color: theme.colors.text.primary.onPrimary
    },
    {
      label: 'Rear Avg Travel',
      color: theme.colors.text.secondary.onPrimary
    }
  ], [theme.colors.text.primary.onPrimary, theme.colors.text.secondary.onPrimary]);

  const leftFrontData = useCallback(() => (
    {
      points: [viewModel.leftFrontWindow.data],
      min: viewModel.leftFrontWindow.min,
      max: viewModel.leftFrontWindow.max,
    }), [viewModel.leftFrontWindow]);
  const leftFrontLabelData = useMemo(() => [
    {
      label: 'Left Front Travel',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme.colors.text.primary.onPrimary]);

  const rightFrontData = useCallback(() => (
    {
      points: [viewModel.rightFrontWindow.data],
      min: viewModel.rightFrontWindow.min,
      max: viewModel.rightFrontWindow.max,
    }
  ), [viewModel.rightFrontWindow]);
  const rightFrontLabelData = useMemo(() => [
    {
      label: 'Right Front Travel',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme.colors.text.primary.onPrimary]);

  const leftRearData = useCallback(() => (
    {
      points: [viewModel.leftRearWindow.data],
      min: viewModel.leftRearWindow.min,
      max: viewModel.leftRearWindow.max,
    }
  ), [viewModel.leftRearWindow]);
  const leftRearLabelData = useMemo(() => [
    {
      label: 'Left Rear Travel',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme.colors.text.primary.onPrimary]);

  const rightRearData = useCallback(() => (
    {
      points: [viewModel.rightRearWindow.data],
      min: viewModel.rightRearWindow.min,
      max: viewModel.rightRearWindow.max,
    }
  ), [viewModel.rightRearWindow]);
  const rightRearLabelData = useMemo(() => [
    {
      label: 'Right Rear Travel',
      color: theme.colors.text.primary.onPrimary
    }
  ], [theme.colors.text.primary.onPrimary]);

  return (
    <AppBarContainer title="Suspension Travel">
      <ScrollView>
        <LineGraph
          getData={avgData}
          labelData={avgLabelData} />
        <LineGraph
          getData={leftFrontData}
          labelData={leftFrontLabelData} />
        <LineGraph
          getData={rightFrontData}
          labelData={rightFrontLabelData} />
        <LineGraph
          getData={leftRearData}
          labelData={leftRearLabelData} />
        <LineGraph
          getData={rightRearData}
          labelData={rightRearLabelData} />
      </ScrollView>
    </AppBarContainer>
  );
});