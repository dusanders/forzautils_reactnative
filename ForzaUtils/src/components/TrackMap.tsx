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
  const minSvgX = viewModel.viewBox.minX;
  const minSvgY = viewModel.viewBox.minY;
  const totalSvgHeight = Math.abs(viewModel.viewBox.minY) + Math.abs(viewModel.viewBox.maxY);
  const totalSvgWidth = Math.abs(viewModel.viewBox.minX) + Math.abs(viewModel.viewBox.maxX) * 1.3;
  return (
    <View>
      <View>
        <ThemeText>{`Track: ${viewModel.trackId}`}

          {JSON.stringify(viewModel.viewBox)}
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
          stroke={theme.colors.text.secondary.onPrimary}
          strokeWidth={Math.max(totalSvgWidth, totalSvgHeight) * 0.015}
          fill={'transparent'} />
        <Circle
          cx={viewModel.playerPosition?.x}
          cy={viewModel.playerPosition?.y}
          r={Math.max(totalSvgWidth, totalSvgHeight) * 0.035}
          fill={theme.colors.text.primary.onPrimary} />
      </Svg>
    </View>
  )
}