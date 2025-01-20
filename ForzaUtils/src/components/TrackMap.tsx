import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Path, Text } from "react-native-svg";
import { useTheme } from "../hooks/useTheme";
import { useViewModelStore } from "../context/viewModels/ViewModelStore";
import { DirectionalData } from "ForzaTelemetryApi";
import { StateHandler } from "../constants/types";
import { ThemeText } from "./ThemeText";

export interface TrackMapProps {

}

interface TrackMapState {
  minY: number;
  minX: number;
  maxY: number;
  maxX: number;
  position: DirectionalData | undefined;
  pathString: string;
  trackId: number;
}
export function TrackMap(props: TrackMapProps) {
  const returnMax = (a: number, b: number) => {
    let a1 = a || 0;
    let b1 = b || 0;
    return a1 > b1 ? a1 : b1;
  }
  const returnMin = (a: number | undefined, b: number | undefined) => {
    let a1 = a || 0;
    let b1 = b || 0;
    return a1 < b1 ? a1 : b1;
  }
  
  const theme = useTheme().theme;
  const initialState: TrackMapState = {
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    pathString: '',
    minY: -1,
    maxY: 1,
    minX: -1,
    maxX: 1,
    trackId: 0
  }
  const viewModel = useViewModelStore().map;
  const [state, setState] = useReducer<StateHandler<TrackMapState>>((prev: TrackMapState, next: Partial<TrackMapState>) => {
    const hasPathString = prev.pathString.length;
    const isNewPosition = (next.position && (
      next.position.x !== prev.position?.x
      || next.position.z !== prev.position?.z)
    );
    if (Boolean(viewModel.trackId) && prev.trackId != viewModel.trackId) {
      return {
        ...initialState,
        ...{
          trackId: viewModel.trackId
        }
      }
    }
    next.trackId = viewModel.trackId || prev.trackId;
    if (!isNewPosition) {
      return prev;
    }
    if (!hasPathString && isNewPosition) {
      if (next.position?.x != 0 && next.position?.z != 0) {
        next.pathString = `M${next.position?.x},${next.position?.z}`
      }
    } else {
      if (next.position?.x != 0 && next.position?.z != 0) {
        next.pathString = `${prev.pathString}L${next.position?.x},${next.position?.z}`;
      }
    }
    next.minX = returnMin(prev.minX, next.position!.x);
    next.minY = returnMin(prev.minY, next.position!.z);
    next.maxX = returnMax(prev.maxX, Math.abs(next.position!.x));
    next.maxY = returnMax(prev.maxY, Math.abs(next.position!.z));
    return {
      ...prev,
      ...next
    }
  }, initialState);

  useEffect(() => {
    if (!viewModel.position) {
      return;
    }
    setState({
      position: viewModel.position,
    });
  }, [viewModel.position]);


  return (
    <View>
      <View>
        <ThemeText>x: {`Track: ${viewModel.trackId}`}</ThemeText>
        <ThemeText>x: {viewModel.position?.x}</ThemeText>
        <ThemeText>y: {viewModel.position?.y}</ThemeText>
        <ThemeText>z: {viewModel.position?.z}</ThemeText>
        <ThemeText>minY: {state.minY}</ThemeText>
        <ThemeText>maxY: {state.maxY}</ThemeText>
        <ThemeText>minX: {state.minX}</ThemeText>
        <ThemeText>maxX: {state.maxX}</ThemeText>
      </View>
      <Svg height={300} width={350}
        viewBox={`
          ${state.minX - (Math.abs(state.minX * 0.15))}
          ${state.minY - (Math.abs(state.minY * 0.1))} 
          ${state.maxX + Math.abs(state.minX * 1.2)} 
          ${(state.maxY + Math.abs(state.minY * 1.2))}`}>
        <Path
          d={state.pathString}
          stroke={theme.colors.text.secondary.onPrimary}
          strokeWidth={returnMax(state.maxX, state.maxY) * 0.015}
          fill={'transparent'} />
        <Circle
          cx={state.position?.x}
          cy={state.position?.z}
          r={returnMax(state.maxX, state.maxY) * 0.035}
          fill={theme.colors.text.primary.onPrimary} />
      </Svg>
    </View>
  )
}