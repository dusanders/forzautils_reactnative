import React, { } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useViewModelStore } from "../context/viewModels/ViewModelStore";
import { ThemeText } from "./ThemeText";
import { Paper } from "./Paper";
import { invokeWithTheme } from "../hooks/ThemeState";

export interface TrackMapProps {
  style?: StyleProp<ViewStyle>;
}

export function TrackMap(props: TrackMapProps) {
  const isValidNumber = (value: number) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }
  const viewModel = useViewModelStore().map;
  const minSvgX = isValidNumber(viewModel.viewBox.minX)
    ? viewModel.viewBox.minX
    : 0;
  const minSvgY = isValidNumber(viewModel.viewBox.minY)
    ? viewModel.viewBox.minY
    : 0;
  const totalSvgHeight = Math.abs(viewModel.viewBox.minY) + Math.abs(viewModel.viewBox.maxY);
  const totalSvgWidth = Math.abs(viewModel.viewBox.minX) + Math.abs(viewModel.viewBox.maxX) * 1.0;
  return (
    <Paper style={props.style}>
      <View>
        <ThemeText>
          {`Track: ${viewModel.trackId}`}
        </ThemeText>
      </View>
      <Svg height={viewModel.svgHeight} width={viewModel.svgWidth}
        viewBox={`
          ${minSvgX - ((totalSvgWidth - minSvgX) * 0.1)}
          ${minSvgY} 
          ${totalSvgWidth} 
          ${totalSvgHeight + (totalSvgHeight * 0.3)}`}>
        <Path
          d={viewModel.svgPath}
          stroke={invokeWithTheme((theme) => theme.colors.text.secondary.onPrimary)}
          strokeWidth={Math.max(totalSvgWidth, totalSvgHeight) * 0.015}
          fill={'transparent'} />
        <Circle
          cx={viewModel.playerPosition?.x}
          cy={viewModel.playerPosition?.y}
          r={Math.max(totalSvgWidth, totalSvgHeight) * 0.035}
          fill={invokeWithTheme((theme) => theme.colors.text.primary.onPrimary)} />
      </Svg>
    </Paper>
  )
}