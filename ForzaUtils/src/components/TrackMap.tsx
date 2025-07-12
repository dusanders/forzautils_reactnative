import React, { } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { ThemeText } from "./ThemeText";
import { Paper } from "./Paper";
import { useCurrentTheme } from "../hooks/ThemeState";
import { useMapViewModel } from "../context/viewModels/MapViewModel";

export interface TrackMapProps {
  style?: StyleProp<ViewStyle>;
}

export function TrackMap(props: TrackMapProps) {
  const isValidNumber = (value: number) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }
  const theme = useCurrentTheme();
  const mapVM = useMapViewModel();
  const minSvgX = isValidNumber(mapVM.viewBox.minX)
    ? mapVM.viewBox.minX
    : 0;
  const minSvgY = isValidNumber(mapVM.viewBox.minY)
    ? mapVM.viewBox.minY
    : 0;
  const totalSvgHeight = Math.abs(mapVM.viewBox.minY) + Math.abs(mapVM.viewBox.maxY);
  const totalSvgWidth = Math.abs(mapVM.viewBox.minX) + Math.abs(mapVM.viewBox.maxX) * 1.0;
  return (
    <Paper style={props.style}>
      <View>
        <ThemeText>
          {`Track: ${mapVM.trackId}`}
        </ThemeText>
      </View>
      <Svg height={mapVM.svgHeight} width={mapVM.svgWidth}
        viewBox={`
          ${minSvgX - ((totalSvgWidth - minSvgX) * 0.1)}
          ${minSvgY} 
          ${totalSvgWidth} 
          ${totalSvgHeight + (totalSvgHeight * 0.3)}`}>
        <Path
          d={mapVM.svgPath}
          stroke={theme.colors.text.secondary.onPrimary}
          strokeWidth={Math.max(totalSvgWidth, totalSvgHeight) * 0.015}
          fill={'transparent'} />
        <Circle
          cx={mapVM.playerPosition?.x}
          cy={mapVM.playerPosition?.y}
          r={Math.max(totalSvgWidth, totalSvgHeight) * 0.035}
          fill={theme.colors.text.primary.onPrimary} />
      </Svg>
    </Paper>
  )
}