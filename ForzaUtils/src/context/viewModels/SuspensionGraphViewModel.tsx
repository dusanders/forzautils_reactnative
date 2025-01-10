import React, { ReactElement, useReducer } from "react";
import { StateHandler } from "../../constants/types";

export interface ISuspensionGraphViewModel {
  leftFront: number[];
  leftRear: number[];
  rightFront: number[];
  rightRear: number[];
}

export interface SuspensionGraphViewModelProps {
  children: (vm: ISuspensionGraphViewModel) => ReactElement;
}

interface SuspensionGraphViewModelState {
  leftFront: number[];
  leftRear: number[];
  rightFront: number[];
  rightRear: number[];
}

const initialState: SuspensionGraphViewModelState = {
  leftFront: [],
  leftRear: [],
  rightFront: [],
  rightRear: []
}

export function SuspensionGraphViewModel(props: SuspensionGraphViewModelProps) {
  const [state, setState] = useReducer<StateHandler<SuspensionGraphViewModelState>>((prev, next) => {
    const result = {
      ...prev,
      ...next
    }
    return result;
  }, initialState);
  return props.children({
    leftFront: state.leftFront,
    leftRear: state.leftRear,
    rightFront: state.rightFront,
    rightRear: state.rightRear
  });
}