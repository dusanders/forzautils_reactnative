import React, { useEffect, useReducer } from "react";
import { StateHandler } from "../../constants/types";
import { useForzaData } from "../../hooks/useForzaData";

export interface ITireTempViewModel {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
}

interface TireTempViewModelState {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
}
const initialState: TireTempViewModelState = {
  leftFront: 0,
  rightFront: 0,
  leftRear: 0,
  rightRear: 0
}
export function useTireTempsViewModel(): ITireTempViewModel {
  const forza = useForzaData();
  const [state, setState] = useReducer<StateHandler<TireTempViewModelState>>((prev, next) => {
    return {
      ...prev,
      ...next
    }
  }, initialState);

  useEffect(() => {
    if(!forza.packet) {
      return;
    }
    setState({
      leftFront: forza.packet.tireTemp.leftFront,
      rightFront: forza.packet.tireTemp.rightFront,
      leftRear: forza.packet.tireTemp.leftRear,
      rightRear: forza.packet.tireTemp.rightRear
    });
  }, [forza.packet])

  return {
    leftFront: state.leftFront,
    rightFront: state.rightFront,
    leftRear: state.leftRear,
    rightRear: state.rightRear
  }
}