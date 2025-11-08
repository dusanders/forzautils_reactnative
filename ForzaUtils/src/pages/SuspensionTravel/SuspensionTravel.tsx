import React, { useCallback } from "react";
import { ScrollView } from "react-native";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { useThemeColors } from "../../hooks/ThemeState";
import { AvgSuspensionGraph } from "../../components/Graphs/AvgSuspensionGraph";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";

export interface SuspensionTravelProps {
  // Nothing
}

export const SuspensionTravel = React.memo((props: SuspensionTravelProps) => {
  const theme = useThemeColors();
  const viewModel = useViewModelStore().suspensionGraph;

  // Memoize getData functions to prevent recreation
  const avgData = useCallback(() => [
    {
      points: viewModel.avgTravel.map((point) => point.front),
      color: theme.colors.text.primary.onPrimary,
      label: 'Front Avg Travel'
    },
    {
      points: viewModel.avgTravel.map((point) => point.rear),
      color: theme.colors.text.secondary.onPrimary,
      label: 'Rear Avg Travel'
    }
  ], [viewModel.avgTravel, theme.colors.text.primary.onPrimary, theme.colors.text.secondary.onPrimary]);

  const leftFrontData = useCallback(() => [
    {
      points: viewModel.leftFrontWindow,
      color: theme.colors.text.primary.onPrimary,
      label: 'Left Front Travel'
    }
  ], [viewModel.leftFrontWindow, theme.colors.text.primary.onPrimary]);

  const rightFrontData = useCallback(() => [
    {
      points: viewModel.rightFrontWindow,
      color: theme.colors.text.primary.onPrimary,
      label: 'Right Front Travel'
    }
  ], [viewModel.rightFrontWindow, theme.colors.text.primary.onPrimary]);

  const leftRearData = useCallback(() => [
    {
      points: viewModel.leftRearWindow,
      color: theme.colors.text.primary.onPrimary,
      label: 'Left Rear Travel'
    }
  ], [viewModel.leftRearWindow, theme.colors.text.primary.onPrimary]);

  const rightRearData = useCallback(() => [
    {
      points: viewModel.rightRearWindow,
      color: theme.colors.text.primary.onPrimary,
      label: 'Right Rear Travel'
    }
  ], [viewModel.rightRearWindow, theme.colors.text.primary.onPrimary]);

  return (
    <AppBarContainer title="Suspension Travel">
      <ScrollView>
        <AvgSuspensionGraph getData={avgData} />
        <AvgSuspensionGraph getData={leftFrontData} />
        <AvgSuspensionGraph getData={rightFrontData} />
        <AvgSuspensionGraph getData={leftRearData} />
        <AvgSuspensionGraph getData={rightRearData} />
      </ScrollView>
    </AppBarContainer>
  );
});