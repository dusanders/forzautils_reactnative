import React, {  } from "react";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "../hooks/useTheme";
import { useViewModelStore } from "../context/viewModels/ViewModelStore";
import { ThemeText } from "./ThemeText";

export interface TrackMapProps {

}

export function TrackMap(props: TrackMapProps) {
  const theme = useTheme().theme;
  const viewModel = useViewModelStore().map;

  return (
    <View>
      <View>
        <ThemeText>{`Track: ${viewModel.trackId}`}</ThemeText>
        <ThemeText>x: {viewModel.playerPosition?.x}</ThemeText>
        <ThemeText>y: {viewModel.playerPosition?.y}</ThemeText>
        <ThemeText>minY: {viewModel.viewBox.minY}</ThemeText>
        <ThemeText>maxY: {viewModel.viewBox.maxY}</ThemeText>
        <ThemeText>minX: {viewModel.viewBox.minX}</ThemeText>
        <ThemeText>maxX: {viewModel.viewBox.maxX}</ThemeText>
      </View>
      <Svg height={viewModel.svgHeight} width={viewModel.svgWidth}
        viewBox={`
          ${viewModel.viewBox.minX}
          ${viewModel.viewBox.minY + (viewModel.viewBox.minY * 0.1)} 
          ${Math.abs(viewModel.viewBox.minX) + Math.abs(viewModel.viewBox.maxX * 1.3)} 
          ${Math.abs(viewModel.viewBox.minY) + Math.abs(viewModel.viewBox.maxY)}`}>
        <Path
          d={viewModel.svgPath}
          stroke={theme.colors.text.secondary.onPrimary}
          strokeWidth={Math.max(viewModel.viewBox.maxX, Math.abs(viewModel.viewBox.minY)) * 0.015}
          fill={'transparent'} />
        <Circle
          cx={viewModel.playerPosition?.x}
          cy={viewModel.playerPosition?.y}
          r={Math.max(viewModel.viewBox.maxX, Math.abs(viewModel.viewBox.minX)) * 0.035}
          fill={theme.colors.text.primary.onPrimary} />
      </Svg>
    </View>
  )
}