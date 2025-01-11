import React, { ReactElement, useEffect, useReducer } from "react";
import { StateHandler } from "../../constants/types";
import { useForzaData } from "../../hooks/useForzaData";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}

interface SuspensionGraphViewModelState {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}

const initialState: SuspensionGraphViewModelState = {
  leftFront: 0,
  leftRear: 0,
  rightFront: 0,
  rightRear: 0
}

export function useSuspensionGraphViewModel(): ISuspensionGraphViewModel {
  const forza = useForzaData();
  const [state, setState] = useReducer<StateHandler<SuspensionGraphViewModelState>>((prev, next) => {
    const result = {
      ...prev,
      ...next
    }
    return result;
  }, initialState);

  useEffect(() => {
    if (!forza.packet) {
      return;
    }
    const leftFront = forza.packet.normalizedSuspensionTravel.leftFront;
    const rightFront = forza.packet.normalizedSuspensionTravel.rightFront;
    const leftRear = forza.packet.normalizedSuspensionTravel.leftRear;
    const rightRear = forza.packet.normalizedSuspensionTravel.rightRear;
    setState({
      leftFront: leftFront,
      rightFront: rightFront,
      leftRear: leftRear,
      rightRear: rightRear
    });
  }, [forza.packet]);

  return {
    leftFront: state.leftFront,
    leftRear: state.leftRear,
    rightFront: state.rightFront,
    rightRear: state.rightRear
  };
}